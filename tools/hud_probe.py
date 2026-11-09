"""The HUD keeps the middle of the screen free (docs/knowledge/hud-layout.md): opens each kind of world
on a computer, an upright phone and a phone on its side (also with the browser's bars, the sizes of
the user's screenshots), shows what the HUD can show there (the selected element's card, a drawer, the
quiz, today's element and its lesson, a story panel, the Atomling speaking, a molecule made, the forge's
atom, the neon name window, the lab's Alloy Forge)
and checks that nothing of the HUD lies in the middle of the part of the screen it leaves free (where
the engine draws the world's centre; the stick in its corner excepted), and that
the HUD covers little of the screen (at rest under a third, about half at most with something opened
to read). The treasure hunts' sheet, a hunt's clue card in a hall and its chip in the forge's bar come
last (a hunt started stays on in that screen's later scenes). Screenshots in
tools/shots/hud/. Console errors fail the run. Start the dev server first (port 5310).

    python tools/hud_probe.py                  every screen, every scene
    python tools/hud_probe.py --screen phone   the screens whose name has "phone"
    python tools/hud_probe.py --scene plaza    the scenes whose name has "plaza"
    python tools/hud_probe.py --base https://element-worlds.vercel.app   the live site
"""
import argparse
import os
import random
import sys

from playwright.sync_api import sync_playwright

READY = 'window.__ew && window.__ew.world && !window.__ew.store.get().fading'
SHOTS = os.path.join(os.path.dirname(__file__), 'shots', 'hud')

# name: (width, height, touch)
SCREENS = {
    'desktop': (1440, 900, False),
    'laptop': (1280, 720, False),
    'phone-upright': (412, 780, True),  # full screen
    'phone-upright-bars': (412, 640, True),  # inside the browser's bars
    'phone-side': (800, 380, True),  # full screen
    'phone-side-bars': (690, 265, True),  # inside the browser's bars (the user's screenshot)
}

# what lies in the middle of the free part of the screen (the world's centre), as a share of that part
ZONE = 0.36
# the most of the screen the HUD may cover (the user: the pop-ups "obscure most of the screen"): little
# at rest, about half with something the player opened to read (a story, the quiz, the name window)
REST = 0.3

CHECK = r"""(zone) => {
  const ew = window.__ew
  const W = innerWidth, H = innerHeight
  const v = ew.view
  const fw = v.w * W, fh = v.h * H
  const cx = W / 2 + v.x, cy = H / 2 + v.y
  const z = { l: cx - zone / 2 * fw, r: cx + zone / 2 * fw, t: cy - zone / 2 * fh, b: cy + zone / 2 * fh }
  const shown = el => {
    for (let e = el; e; e = e.parentElement) {
      const cs = getComputedStyle(e)
      if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) < 0.05) return false
    }
    return true
  }
  // what of an element shows: its box cut by every scrolling box round it
  const clip = (el, r) => {
    let l = r.left, t = r.top, rr = r.right, b = r.bottom
    for (let e = el.parentElement; e && e !== document.body; e = e.parentElement) {
      const cs = getComputedStyle(e)
      if (cs.overflowX === 'visible' && cs.overflowY === 'visible') continue
      const p = e.getBoundingClientRect()
      l = Math.max(l, p.left); t = Math.max(t, p.top); rr = Math.min(rr, p.right); b = Math.min(b, p.bottom)
    }
    return { l, t, r: rr, b }
  }
  const world = document.querySelector('canvas.world')
  const boxes = []
  for (const el of document.querySelectorAll('body *')) {
    // the 3D and what holds it (the page's own background is behind the 3D)
    if (el === world || el.contains(world)) continue
    const r = el.getBoundingClientRect()
    if (r.width < 2 || r.height < 2) continue
    const cs = getComputedStyle(el)
    const m = cs.backgroundColor.match(/rgba?\(([^)]+)\)/)
    const alpha = m ? Number(m[1].split(',')[3] ?? 1) : 0
    const text = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())
    if (!(alpha > 0.05 || text || el.tagName === 'BUTTON' || el.tagName === 'INPUT')) continue
    const c = clip(el, r)
    if (c.r - c.l < 2 || c.b - c.t < 2 || !shown(el)) continue
    // the stick sits in the screen's corner under the thumb, by design
    c.thumb = !!el.closest('[data-thumb]')
    c.what = `${el.tagName.toLowerCase()} "${(el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 40)}" at ${[c.l, c.t, c.r - c.l, c.b - c.t].map(Math.round)}`
    boxes.push(c)
  }
  const bad = boxes.filter(b => !b.thumb && !(b.r <= z.l || b.l >= z.r || b.b <= z.t || b.t >= z.b)).map(b => b.what)
  // how much of the screen the HUD covers: a grid of points
  let hit = 0
  let n = 0
  for (let y = 4; y < H; y += 8) for (let x = 4; x < W; x += 8) {
    n++
    if (boxes.some(b => x >= b.l && x < b.r && y >= b.t && y < b.b)) hit++
  }
  return { covered: hit / n, view: { x: Math.round(v.x), y: Math.round(v.y), w: +v.w.toFixed(2), h: +v.h.toFixed(2) }, bad }
}"""


def wait_ready(page):
    page.wait_for_function(READY, timeout=90000)
    page.wait_for_timeout(700)


def open_exhibit(page, pattern=None):
    """Walk up to the exhibits in turn (those whose label matches) and use each until one opens what it
    tells (a panel, or the world's own window; some open it a moment later); returns its label."""
    labels = page.evaluate(
        """(pattern) => {
          const label = it => (typeof it.label === 'function' ? it.label() : it.label) || ''
          window.__probeList = (__ew.world.interactables || []).filter(it => it.onUse && !/arch|porta|door|volta|back/i.test(label(it))
            && (!pattern || new RegExp(pattern, 'i').test(label(it))))
          return window.__probeList.map(label)
        }""",
        pattern,
    )
    for i, label in enumerate(labels):
        page.evaluate(f'() => {{ const it = window.__probeList[{i}]; __ew.teleport(it.x + 0.5, it.z + 0.5); it.onUse() }}')
        try:
            page.wait_for_function('() => { const s = __ew.store.get(); return !!(s.panel || s.overlay) }', timeout=2500)
            return label
        except Exception:  # noqa: BLE001 (this one tells nothing: the next)
            continue
    return None


def scenes():
    """name: (address, what to do once it is ready)."""
    def plaza(page):
        pass

    def plaza_selected(page):
        page.evaluate('() => __ew.world.select(6)')
        page.wait_for_timeout(1300)

    def plaza_drawer(page):
        page.locator('button[aria-label]').filter(has_text='🎨').first.click()
        page.wait_for_timeout(900)

    def plaza_quiz(page):
        page.locator('button').filter(has_text='❓').first.click()
        page.wait_for_timeout(1800)

    def plaza_daily(page):
        # today's element: its sheet opened on the streak and the week
        page.click('[data-daily-open]')
        page.wait_for_selector('[data-daily-begin], [data-daily-practice]', timeout=10000)
        page.wait_for_timeout(1500)

    def plaza_daily_lesson(page):
        # its lesson: the first step, the table to find the day's element in
        plaza_daily(page)
        page.click('[data-daily-begin]')
        page.wait_for_selector('[data-daily-step]', timeout=10000)
        page.wait_for_timeout(1500)

    def plaza_hunts(page):
        # the treasure hunts' sheet (docs/knowledge/hunts.md)
        page.click('[data-hunts-open]')
        page.wait_for_selector('[data-hunts] [data-hunt-track]', timeout=10000)
        page.wait_for_timeout(1500)

    def hall_hunt(page):
        # a hunt on: its clue card under the bar at the right (across the top of an upright phone, where the
        # Atomling's bubble makes way for it). The hunt stays on in this screen's later scenes.
        page.evaluate("() => { window.__ew.store.set({ speech: null }); window.__ewHunts.start('records') }")
        page.wait_for_selector('[data-hunt-card] [data-hunt-riddle]', timeout=10000)
        page.wait_for_timeout(1200)

    def forge_hunt(page):
        # the hunt still on (hall-hunt): in the forge the clue waits folded in the top bar
        page.wait_for_selector('[data-hunt-chip]', timeout=10000)
        page.wait_for_timeout(800)

    def walk_panel(page):
        if not open_exhibit(page):
            raise RuntimeError('no exhibit opened a panel')
        page.wait_for_timeout(900)

    def walk_speech(page):
        page.evaluate("() => __ew.store.set({ speech: { text: 'Sou o carbono: estou em todos os seres vivos, nos diamantes e no grafite do teu lápis. Queres saber porquê?', who: 'Carbono', color: '#9aa3b5' } })")
        page.wait_for_timeout(600)

    def lab_water(page):
        page.evaluate("() => { __ew.world.add('O'); __ew.world.add('H'); __ew.world.add('H') }")
        page.wait_for_timeout(1500)

    def forge(page):
        page.wait_for_timeout(800)

    def forge_race(page):
        # in a probe room (PRB...), a race on: the line of who builds together and the race's board
        code = 'PRB' + ''.join(random.choice('ABCDEFGHJKMNPQRSTUVWXYZ') for _ in range(3))
        page.evaluate(f"() => __ewRoom.join('{code}', 'Ana')")
        page.wait_for_function("() => __ewRoom.status === 'on' && __ewShared.mode === 'room'", timeout=20000)
        page.evaluate("() => __ewRace.start('C12')")
        page.wait_for_function("() => __ewRace.s && __ewRace.s.phase === 'racing'", timeout=15000)
        page.evaluate("() => { __ew.world.add('p'); __ew.world.add('p'); __ew.world.add('n') }")
        page.wait_for_timeout(1500)

    def stars(page):
        page.evaluate('() => { __ew.world.tapCore(); __ew.world.setLife(0.6) }')
        page.wait_for_timeout(1500)

    def stars_slow(page):
        page.evaluate("() => { __ew.world.go('slow'); __ew.world.tapNucleus(); __ew.world.tapNucleus() }")
        page.wait_for_timeout(2200)

    def bench_alloys(page):
        # the lab's Alloy Forge: a bronze mixed in the crucible's card, an ingot of steel struck on the anvil's
        page.evaluate("() => { __ew.world.recipe('steel'); __ew.world.pour() }")
        page.wait_for_timeout(4300)
        page.evaluate("() => { __ew.world.strike(); __ew.world.recipe('bronze') }")
        page.wait_for_timeout(1500)

    def atom_map(page):
        # inside the atom: the electron map's panel (its map block, the words, the zoom slider), uranium's the
        # longest (seven shells)
        page.evaluate("() => __ew.showPanel(__ew.world.panels.map)")
        page.wait_for_timeout(900)

    def neon_name(page):
        if not open_exhibit(page, 'nome|name'):
            raise RuntimeError('the name window did not open')
        page.wait_for_timeout(700)

    # name: (address, what to do, the most the HUD may cover)
    return {
        'plaza': ('/', plaza, REST),
        'plaza-selected': ('/', plaza_selected, REST),
        'plaza-drawer': ('/', plaza_drawer, 0.4),
        'plaza-quiz': ('/', plaza_quiz, 0.5),
        'plaza-daily': ('/', plaza_daily, 0.5),
        'plaza-daily-lesson': ('/', plaza_daily_lesson, 0.5),
        'hall-panel': ('/e/C', walk_panel, 0.55),
        'hall-speech': ('/e/C', walk_speech, REST),
        'wing-panel': ('/e/C/allotropes', walk_panel, 0.55),
        'lab-water': ('/lab', lab_water, 0.5),  # a workbench: the palette and the missions are its tools
        'forge': ('/forge?z=26', forge, 0.5),
        'forge-race': ('/forge', forge_race, 0.5),  # in a room, racing: the race's board where the missions were
        'neon-name': ('/e/Ne/signs', neon_name, 0.55),
        'atom-map': ('/e/U/atom', atom_map, 0.55),  # inside the atom: the electron map's panel
        'stars': ('/stars', stars, 0.5),  # the Star Forge: its sliders, its card, its table
        'stars-slow': ('/stars', stars_slow, 0.5),  # its slow capture, the path on the chart
        'bench-alloys': ('/lab/alloys', bench_alloys, 0.5),  # the Alloy Forge: the crucible's card, the anvil's, the book
        'plaza-hunts': ('/', plaza_hunts, 0.5),  # the treasure hunts' sheet
        # (last: a hunt started here stays on for what follows in the same screen)
        'hall-hunt': ('/e/C', hall_hunt, 0.5),  # a hunt's clue card, something opened to read (it folds to a chip)
        # the hunt's chip in the forge's bar: the forge alone is at its 50% on the smallest phone on its side
        # (690 x 265), and the chip, the least a hunt can show, adds about 1%
        'forge-hunt': ('/forge?z=26', forge_hunt, 0.52),
    }


def main():
    sys.stdout.reconfigure(encoding='utf-8')
    ap = argparse.ArgumentParser()
    ap.add_argument('--port', type=int, default=5310)
    ap.add_argument('--base', default='')
    ap.add_argument('--screen', default='')
    ap.add_argument('--scene', default='')
    ap.add_argument('--lang', default='pt-pt')
    a = ap.parse_args()
    os.makedirs(SHOTS, exist_ok=True)
    problems = []
    errors = []
    with sync_playwright() as p:
        b = p.chromium.launch(channel='msedge', headless=True, args=['--use-angle=d3d11', '--ignore-gpu-blocklist'])
        for sname, (w, h, touch) in SCREENS.items():
            if a.screen not in sname:
                continue
            ctx = b.new_context(viewport={'width': w, 'height': h}, is_mobile=touch, has_touch=touch, device_scale_factor=2 if touch else 1)
            for name, (path, act, most) in scenes().items():
                if a.scene not in name:
                    continue
                page = ctx.new_page()
                where = f'{sname}/{name}'
                page.on('console', lambda m, where=where: m.type == 'error' and errors.append(f'{where}: {m.text[:240]}'))
                page.on('pageerror', lambda e, where=where: errors.append(f'{where}: {str(e)[:240]}'))
                sep = '&' if '?' in path else '?'
                page.goto(f'{a.base or f"http://localhost:{a.port}"}{path}{sep}lang={a.lang}')
                try:
                    wait_ready(page)
                    act(page)
                    page.wait_for_timeout(500)  # the view offset eases in
                    r = page.evaluate(CHECK, ZONE)
                except Exception as e:  # noqa: BLE001 (a probe reports and goes on)
                    problems.append(f'{where}: {str(e)[:200]}')
                    page.close()
                    continue
                page.screenshot(path=os.path.join(SHOTS, f'{sname}_{name}.png'))
                verdict = 'ok' if not r['bad'] and r['covered'] <= most else 'PROBLEM'
                print(f'{where:42} HUD covers {r["covered"]:.0%}  view {r["view"]} {verdict}')
                for x in r['bad'][:4]:
                    print('    in the middle:', x)
                if r['bad']:
                    problems.append(f'{where}: {len(r["bad"])} in the middle')
                if r['covered'] > most:
                    problems.append(f'{where}: the HUD covers {r["covered"]:.0%} of the screen')
                page.close()
            ctx.close()
        b.close()
    for x in problems:
        print('PROBLEM', x)
    for e in errors:
        print('console error:', e)
    sys.exit(1 if problems or errors else 0)


if __name__ == '__main__':
    main()
