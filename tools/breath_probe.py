"""The breathing exhibit in Oxygen's air wing (src/worlds/wings/oxygen/airBreath.js): E starts the
breathing, E again holds the breath. Checks the prompt's verb changes and that nothing throws, and films
two breaths (oxygen in from the left column, carbon dioxide out to the right one) and the held lungs as a
contact sheet, tools/shots/breath/cycle.png, to look at. Dev server on 5310.

    python tools/breath_probe.py
"""
import sys, os, io
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw
sys.stdout.reconfigure(encoding='utf-8')
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'shots', 'breath', 'cycle.png')
os.makedirs(os.path.dirname(out), exist_ok=True)
fails = []


def check(what, ok, detail=''):
    print(f'{what:50} {"ok" if ok else "WRONG"} {detail}')
    if not ok:
        fails.append(what)


with sync_playwright() as p:
    b = p.chromium.launch(channel='msedge', headless=True, args=['--use-angle=d3d11'])
    page = b.new_page(viewport={'width': 1280, 'height': 720})
    errs = []
    page.on('pageerror', lambda e: errs.append(str(e)))
    page.goto('http://localhost:5310/e/O/air?lang=en')
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
    page.keyboard.press('e')
    page.wait_for_timeout(300)
    page.evaluate("() => __ew.store.set({ panel: null })")
    check('E starts the breathing (the prompt says hold)', verb() == 'Hold your breath' and v0 == 'Take a breath', f'{v0} -> {verb()}')
    shots = []
    for i in range(16):
        page.wait_for_timeout(700)
        page.evaluate("() => __ew.store.set({ panel: null, speech: null })")
        shots.append(Image.open(io.BytesIO(page.screenshot(clip={'x': 300, 'y': 150, 'width': 700, 'height': 260}))))
    page.keyboard.press('e')
    page.wait_for_timeout(300)
    check('E again holds the breath', verb() == 'Take a breath', verb())
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
