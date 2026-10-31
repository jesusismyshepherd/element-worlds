"""The breathing exhibit in Oxygen's air wing (src/worlds/wings/oxygen/airBreath.js): a tap on the lungs
starts the breathing, a tap again holds the breath (the user, 2026-10-30: every step a tap on its thing;
it was E and E again before); E opens the panel, whose button does the same. Checks the hand shows over
the lungs, the prompt names the next tap, the panel's button works, and that nothing throws, and films two
breaths (oxygen in from the left column, carbon dioxide out to the right one) and the held lungs as a
contact sheet, tools/shots/breath/cycle.png, to look at. Dev server on 5310 (or --port).

    python tools/breath_probe.py [--port 5310]
"""
import argparse
import io
import os
import sys

from PIL import Image, ImageDraw
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')
ap = argparse.ArgumentParser()
ap.add_argument('--port', type=int, default=5310)
a = ap.parse_args()
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'shots', 'breath', 'cycle.png')
os.makedirs(os.path.dirname(out), exist_ok=True)
fails = []


def check(what, ok, detail=''):
    print(f'{what:50} {"ok" if ok else "WRONG"} {detail}')
    if not ok:
        fails.append(what)


# the lungs on the page: their world point through the camera as drawn (its view offset included)
LUNGS = """() => {
  const p = __ew.world.parts.breath.at().project(__ew.camera)
  const r = __ew.canvas.getBoundingClientRect()
  return { x: r.left + (p.x + 1) / 2 * r.width, y: r.top + (1 - p.y) / 2 * r.height }
}"""

with sync_playwright() as p:
    b = p.chromium.launch(channel='msedge', headless=True, args=['--use-angle=d3d11'])
    page = b.new_page(viewport={'width': 1280, 'height': 720})
    errs = []
    page.on('pageerror', lambda e: errs.append(str(e)))
    page.goto(f'http://localhost:{a.port}/e/O/air?lang=en')
    page.wait_for_function("() => window.__ew && __ew.world && location.pathname === '/e/O/air' && !__ew.store.get().fading", timeout=90000)
    page.wait_for_timeout(2000)
    page.evaluate("""() => {
      const it = __ew.world.interactables.find(i => i.id === 'breath')
      const L = Math.hypot(it.x, it.z)
      __ew.setMode('first')
      __ew.teleport(it.x * 0.93, it.z * 0.93, Math.atan2(-it.x / L, -it.z / L), 0.02)
    }""")
    page.wait_for_timeout(1500)
    verb = lambda: page.evaluate("() => __ew.store.get().prompt?.verb")
    v0 = verb()
    check('the prompt names the tap', v0 == 'Tap the lungs to breathe', v0)
    # E opens the panel; its button starts and holds the breath too
    page.keyboard.press('e')
    page.wait_for_timeout(300)
    title = page.evaluate('() => __ew.store.get().panel?.title')
    check('E opens the panel', title == 'Breathing', str(title))
    button = lambda: page.evaluate('() => __ew.store.get().panel?.blocks.find(b => b.buttons)?.buttons[0]')
    check("the panel's button says take a breath", (button() or {}).get('label') == 'Take a breath', str(button()))
    page.evaluate('() => __ew.store.get().panel.blocks.find(b => b.buttons).buttons[0].onClick()')
    page.wait_for_timeout(200)
    check("the panel's button starts it", page.evaluate('() => __ew.world.parts.breath.on') and (button() or {}).get('label') == 'Hold your breath', str(button()))
    page.evaluate('() => __ew.store.get().panel.blocks.find(b => b.buttons).buttons[0].onClick()')
    page.wait_for_timeout(200)
    check('and holds it', not page.evaluate('() => __ew.world.parts.breath.on'))
    page.evaluate("() => __ew.store.set({ panel: null, speech: null })")
    page.wait_for_timeout(9000)
    # a tap on the lungs
    at = page.evaluate(LUNGS)
    check('the hand shows over the lungs', page.evaluate(f"() => __ew.world.pointAt(__ew.rayAt({{ x: {at['x']}, y: {at['y']} }}))"), str(at))
    page.mouse.click(at['x'], at['y'])
    page.wait_for_timeout(300)
    page.evaluate("() => __ew.store.set({ panel: null })")
    check('a tap on the lungs starts the breathing', page.evaluate('() => __ew.world.parts.breath.on') and verb() == 'Tap the lungs to hold your breath', str(verb()))
    shots = []
    for i in range(16):
        page.wait_for_timeout(700)
        page.evaluate("() => __ew.store.set({ panel: null, speech: null })")
        shots.append(Image.open(io.BytesIO(page.screenshot(clip={'x': 300, 'y': 150, 'width': 700, 'height': 260}))))
    at = page.evaluate(LUNGS)
    page.mouse.click(at['x'], at['y'])
    page.wait_for_timeout(300)
    check('a tap again holds the breath', not page.evaluate('() => __ew.world.parts.breath.on') and verb() == 'Tap the lungs to breathe', str(verb()))
    page.wait_for_timeout(6000)
    page.evaluate("() => __ew.store.set({ panel: null, speech: null })")
    shots.append(Image.open(io.BytesIO(page.screenshot(clip={'x': 300, 'y': 150, 'width': 700, 'height': 260}))))
    check('nothing throws', not errs, str(errs))
    b.close()
w, h = 350, 130
sheet = Image.new('RGB', (w * 4, h * 5), 'white')
d = ImageDraw.Draw(sheet)
for i, s in enumerate(shots):
    sheet.paste(s.resize((w, h)), ((i % 4) * w, (i // 4) * h))
    d.text(((i % 4) * w + 4, (i // 4) * h + 2), f'{(i + 1) * 0.7:.1f}s' if i < 16 else 'held', fill='black')
sheet.save(out)
print('contact sheet:', out)
sys.exit(1 if fails else 0)
