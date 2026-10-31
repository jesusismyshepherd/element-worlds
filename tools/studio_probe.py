"""The family studio (/studio, src/pages/Studio.jsx; docs/knowledge/update-dashboard.md, "The family
studio") from end to end, with a throwaway account (probe_st_xxxx, the pokemon-site's kind):

- signed out: the backlog is there (the queue in its order, every waiting entry, every built day), the
  sign-in prompt, no form and no verdict buttons; the database answers a post and a read without an
  account with null;
- a new account made through the page's own sign-in sheet, which closes by itself;
- an idea, a verdict (Sooner) on the first item up next and a note on it, all sent through the page;
- after a reload, all three read back from the page (what was sent, the item's thread, the pressed
  verdict) and from ew_studio_list as the account, each with its username;
- the page in Portuguese; an admin's view (ew_me and ew_studio_list answered by the probe: someone else's
  idea with their name and Claude's answer under it);
- signing out takes the form and the notes away.

Screenshots in tools/shots/studio/ (computer and phone, signed out and in, two languages). At the end the
account goes: with EW_DASH_PASS set, through ew_admin forget_probe (its rows go with it); without, the
probe prints the SQL to run with the Supabase MCP (project kawvqpvntdgehigwvfao).

    python tools/studio_probe.py [--port 5347 | --base https://element-worlds.vercel.app]
Run it through the machine's heavy-job lock when other sessions render (CLAUDE.md).
"""
import argparse
import json
import os
import secrets
import sys
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
OUT = Path(__file__).with_name('shots') / 'studio'
URL = 'https://kawvqpvntdgehigwvfao.supabase.co'
KEY = 'sb_publishable_XjLWqFaE6h9ENP_Glh5gnQ_jDzbnMs9'
SESSION = 'sb-kawvqpvntdgehigwvfao-auth-token'
PHONE = dict(viewport={'width': 390, 'height': 844}, device_scale_factor=2, is_mobile=True, has_touch=True)


def rpc(fn, args, token=None):
    headers = {'apikey': KEY, 'Content-Type': 'application/json'}
    if token:
        headers['Authorization'] = f'Bearer {token}'
    req = urllib.request.Request(f'{URL}/rest/v1/rpc/{fn}', data=json.dumps(args).encode(), method='POST', headers=headers)
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read())


def main():
    sys.stdout.reconfigure(encoding='utf-8')
    ap = argparse.ArgumentParser()
    ap.add_argument('--port', type=int, default=5347)
    ap.add_argument('--base', default=None)
    a = ap.parse_args()
    base = (a.base or f'http://localhost:{a.port}').rstrip('/')
    backlog = json.loads((ROOT / 'docs/studio/backlog.json').read_text(encoding='utf-8'))
    words = {code: json.loads((ROOT / f'src/i18n/locales/{code}.json').read_text(encoding='utf-8'))['studio'] for code in ('en', 'pt-pt')}
    items = {i['id']: i for i in backlog['items']}
    queue = [i for i in backlog['next'] if items[i]['status'] == 'next']
    days = sorted({b['date'] for b in backlog['built']}, reverse=True)
    first = queue[0]
    name = 'probe_st_' + secrets.token_hex(3)
    password = 'pw-' + secrets.token_hex(6)
    tag = secrets.token_hex(2)
    idea, note = f'probe idea {tag}: a world for iron', f'probe note {tag}: more stars'
    OUT.mkdir(parents=True, exist_ok=True)
    fails, errors = [], []
    made = False

    def check(what, ok, detail=''):
        print(f'{what:70} {"ok" if ok else "WRONG"} {detail}')
        if not ok:
            fails.append(what)

    def wait(page, js, timeout=15000, arg=None):
        try:
            page.wait_for_function(js, arg=arg, timeout=timeout)
            return True
        except Exception:
            return False

    def shot(page, label, full=False):
        path = OUT / f'{label}.png'
        page.screenshot(path=str(path), full_page=full)
        print(f'shot {path}')

    def open_page(ctx, path='/studio', lang='en'):
        page = ctx.new_page()
        page.on('console', lambda m: m.type == 'error' and errors.append(m.text))
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.goto(f'{base}{path}{"&" if "?" in path else "?"}lang={lang}')
        page.wait_for_selector('[data-studio]', timeout=60000)
        return page

    def texts(page, sel):
        return page.eval_on_selector_all(sel, 'els => els.map(e => e.textContent.trim())')

    try:
        with sync_playwright() as p:
            b = p.chromium.launch(channel='msedge', headless=True)
            ctx = b.new_context(viewport={'width': 1440, 'height': 900})
            page = open_page(ctx)

            # signed out: the backlog, the prompt, nothing to post with
            got = page.eval_on_selector_all('[data-section="next"] [data-queue]', 'els => els.map(e => e.dataset.queue)')
            check('up next: the queue in its order', got == queue, f'{got}')
            building = page.eval_on_selector_all('[data-section="building"] [data-queue]', 'els => els.map(e => e.dataset.queue)')
            check('being built: what is building', sorted(building) == sorted(i['id'] for i in backlog['items'] if i['status'] == 'building'), f'{building}')
            check('every waiting entry', page.locator('[data-waiting]').count() == len(backlog.get('waiting', [])))
            got = page.eval_on_selector_all('[data-built-day]', 'els => els.map(e => e.dataset.builtDay)')
            check('built: every day, newest first', got == days, f'{len(got)} days')
            check('built: a tokens line under every entry', page.locator('[data-built] [data-tokens]').count() == len(backlog['built']))
            ideas = sum(1 for i in backlog['items'] if i['status'] != 'built')
            check('all ideas: every one not built is a tile', page.locator('[data-section="ideas"] [data-open]').count() == ideas)
            check('signed out: the sign-in prompt, no form, no verdicts',
                  page.locator('[data-signin]').count() == 1 and page.locator('[data-tell-text]').count() == 0 and page.locator('[data-verdict]').count() == 0)
            r1 = rpc('ew_studio_post', {'p_kind': 'idea', 'p_item': '', 'p_text': 'anonymous', 'p_value': None})
            r2 = rpc('ew_studio_list', {})
            check('signed out: the database takes no post and gives nothing to read', r1 is None and r2 is None, f'{r1} {r2}')
            shot(page, 'out-en')
            page.click(f'[data-section="next"] [data-open="{first}"]')
            page.wait_for_selector(f'[data-sheet="{first}"]')
            check('signed out: an item opens, with the sign-in prompt instead of a form',
                  page.locator(f'[data-sheet="{first}"] [data-signin]').count() == 1 and page.locator('[data-note-text]').count() == 0)
            page.click('[data-sheet-close]')

            # a new account through the page's own sheet
            page.click('[data-section="tell"] [data-signin]')
            page.click('[data-account-tab="up"]')
            page.fill('[data-account-name]', name)
            page.fill('[data-account-password]', password)
            page.click('[data-account-submit]')
            made = True
            ok = wait(page, '() => document.querySelector("[data-tell-text]") && !document.querySelector("[data-account-sheet]")', 30000)
            check('a new account made in the sheet; the sheet closes, the form is there', ok)
            check('the account button names the account', name in page.inner_text('[data-account-open]'))
            check('signed in: verdict buttons on the queue', page.locator(f'[data-queue="{first}"] [data-verdict]').count() == 3)

            # an idea, a verdict and a note, through the page
            page.fill('[data-tell-text]', idea)
            page.click('[data-tell-send]')
            ok = wait(page, '(t) => [...document.querySelectorAll("[data-sent] [data-entry-text]")].some(e => e.textContent === t)', 15000, idea)
            check('the idea is sent and shows in what was sent', ok, page.inner_text('[data-tell-status]'))
            check('the form is emptied and says it was sent', page.input_value('[data-tell-text]') == '' and words['en']['tell']['sent'] in page.inner_text('[data-tell-status]'))
            page.click(f'[data-queue="{first}"] [data-verdict="first"]')
            ok = wait(page, f'() => document.querySelector(\'[data-queue="{first}"] [data-verdict="first"]\').getAttribute("aria-pressed") === "true"')
            check('Sooner on the first item up next is pressed', ok)
            page.click(f'[data-notes="{first}"]')
            page.wait_for_selector(f'[data-sheet="{first}"] [data-note-text]')
            page.fill('[data-note-text]', note)
            page.click('[data-note-send]')
            ok = wait(page, '([id, t]) => [...document.querySelectorAll(`[data-thread="${id}"] [data-entry-text]`)].some(e => e.textContent === t)', 15000, [first, note])
            check("the note is sent and shows in the item's thread", ok)
            kinds = page.eval_on_selector_all(f'[data-thread="{first}"] [data-entry]', 'els => els.map(e => e.dataset.kind)')
            check("the item's thread: the verdict, then the note", kinds == ['verdict', 'note'], f'{kinds}')
            shot(page, 'in-en-sheet')
            page.click('[data-sheet-close]')

            # read back after a reload, from the page and from the database
            page.reload()
            page.wait_for_selector('[data-studio]')
            ok = wait(page, '() => document.querySelectorAll("[data-sent] [data-entry]").length >= 3', 20000)
            sent = texts(page, '[data-sent] [data-entry-text]')
            who = texts(page, '[data-sent] [data-entry-who]')
            check('after a reload: idea, verdict and note in what was sent', ok and idea in sent and note in sent and len(sent) == 3, f'{sent}')
            check('each with the account that sent it', who == [name] * 3, f'{who}')
            check('each waiting for Claude', page.get_attribute('[data-unanswered]', 'data-unanswered') == '3')
            check('the verdict is still pressed', page.get_attribute(f'[data-queue="{first}"] [data-verdict="first"]', 'aria-pressed') == 'true')
            check("the item's tile is marked Sooner", page.locator(f'[data-section="ideas"] [data-open="{first}"] >> text={words["en"]["verdict"]["first"]}').count() == 1)
            token = json.loads(page.evaluate(f'localStorage.getItem("{SESSION}")'))['access_token']
            rows = rpc('ew_studio_list', {}, token)
            mine = [(r['kind'], r.get('item'), r.get('value'), r['text'], r['username'], r['mine']) for r in rows]
            check('the database has the three, as the account', sorted(mine, key=str) == sorted([
                ('idea', None, None, idea, name, True), ('verdict', first, 'first', '', name, True), ('note', first, None, note, name, True)], key=str), f'{mine}')
            shot(page, 'in-en')

            # Portuguese
            page.click('[data-lang="pt-pt"]')
            ok = wait(page, '(t) => document.querySelector("#h-next").textContent === t', 5000, words['pt-pt']['next']['title'])
            check('in Portuguese: the headings follow, and the note on English is there', ok and page.locator('[data-english-note]').count() == 1)
            phone = b.new_context(storage_state=ctx.storage_state(), **PHONE)
            pp = open_page(phone, lang='pt-pt')
            wait(pp, '() => document.querySelectorAll("[data-sent] [data-entry]").length >= 3', 20000)
            shot(pp, 'in-pt-phone')
            pp.locator('[data-sent]').scroll_into_view_if_needed()
            shot(pp, 'in-pt-phone-sent')
            pp.click(f'[data-notes="{first}"]')
            pp.wait_for_selector(f'[data-thread="{first}"]')
            shot(pp, 'in-pt-phone-sheet')
            phone.close()

            # an admin's view: the probe answers ew_me (admin) and ew_studio_list (someone else's idea, answered)
            now = datetime.now(timezone.utc)
            other = [
                {'id': 900001, 'kind': 'idea', 'item': None, 'value': None, 'text': 'A world for iron where you forge a sword',
                 'created_at': (now - timedelta(hours=3)).isoformat(), 'reply': 'Added to the ideas as "Iron forge"; it waits behind the halls.',
                 'replied_at': (now - timedelta(hours=2)).isoformat(), 'username': 'example_kid', 'mine': False},
                {'id': 900002, 'kind': 'verdict', 'item': first, 'value': 'later', 'text': '', 'created_at': (now - timedelta(hours=1)).isoformat(),
                 'reply': None, 'replied_at': None, 'username': 'example_kid', 'mine': False},
            ]

            def as_admin(route):
                r = route.fetch()
                body = r.json()
                if isinstance(body, dict):
                    body['admin'] = True
                route.fulfill(response=r, json=body)

            def everyone(route):
                r = route.fetch()
                route.fulfill(response=r, json=(r.json() or []) + other)

            adm = b.new_context(storage_state=ctx.storage_state(), viewport={'width': 1440, 'height': 900})
            adm.route('**/rest/v1/rpc/ew_me', as_admin)
            adm.route('**/rest/v1/rpc/ew_studio_list', everyone)
            ap_ = open_page(adm)
            ok = wait(ap_, '() => document.querySelector("[data-admin-note]") && document.querySelectorAll("[data-sent] [data-entry]").length >= 5', 20000)
            who = texts(ap_, '[data-sent] [data-entry-who]')
            check("an admin sees everyone's, with their names", ok and 'example_kid' in who and name in who, f'{who}')
            check("and Claude's answer under the one answered", ap_.locator('[data-entry="900001"] [data-reply]').count() == 1)
            ap_.locator('[data-sent]').scroll_into_view_if_needed()
            shot(ap_, 'admin-en')
            ap_.click(f'[data-notes="{first}"]')
            ap_.wait_for_selector(f'[data-thread="{first}"]')
            who = texts(ap_, f'[data-thread="{first}"] [data-entry-who]')
            check("an admin's item thread names each one", 'example_kid' in who and name in who, f'{who}')
            shot(ap_, 'admin-en-sheet')
            adm.close()

            # sign out: the form and the notes go
            page.click('[data-lang="en"]')
            page.click('[data-account-open]')
            page.click('[data-account-out]')
            ok = wait(page, '() => !document.querySelector("[data-tell-text]") && !document.querySelector("[data-entry]")', 15000)
            check('signing out takes the form and the notes away', ok)
            page.keyboard.press('Escape')
            ctx.close()

            # signed out on a phone, in Portuguese, for the eye
            ph = b.new_context(**PHONE)
            pg = open_page(ph, lang='pt-pt')
            shot(pg, 'out-pt-phone')
            ph.close()
            b.close()
    finally:
        if made:
            pw = os.environ.get('EW_DASH_PASS')
            if pw:
                r = rpc('ew_admin', {'p_pass': pw, 'p_action': 'forget_probe', 'p_args': {'username': name}})
                print('the probe account deleted, its rows with it:', r)
            else:
                print(f'\nEW_DASH_PASS is not set: remove the probe with the Supabase MCP (execute_sql, project kawvqpvntdgehigwvfao):\n'
                      f"  delete from public.ew_studio_notes where account in (select id from public.profiles where username like 'probe\\_%');\n"
                      f"  delete from auth.users where email = '{name}@pokemon-app.internal';")
    for e in errors:
        print('console error:', e[:400])
    print(f'\n{len(fails)} wrong' if fails else '\nall ok')
    sys.exit(1 if fails or errors else 0)


if __name__ == '__main__':
    main()
