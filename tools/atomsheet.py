"""Atomling contact sheets: each Atomling alone on the /atomlings stage, framed from a few angles,
composed into sheets (front, three-quarter, side, back, and a wave), plus the page's own rows.

    python tools/atomsheet.py close --only H,He,Li --name t1 [--angles front,q,back,wave] [--cell 280] [--per-row 2]
    python tools/atomsheet.py rows --sets featured,p1,p2 --prefix before
"""
import argparse
import time
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
from playwright.sync_api import sync_playwright

ROOT = 'http://localhost:5310'

SETUP = r"""
(() => {
  const L = window.__lineup
  const any = L.members[0].a.root
  let B3 = null
  for (const m of L.members) m.a.root.traverse(o => {
    if (B3 || !o.isMesh || !o.geometry || o.isInstancedMesh) return
    o.geometry.computeBoundingBox()
    const C = o.geometry.boundingBox?.constructor
    if (C && C.prototype.setFromObject) B3 = C
  })
  window.__B3 = B3
  window.__V3 = any.position.constructor
  for (const m of L.members) { m.nextWave = 1e9; m.a.root.rotation.y = 0 }
  for (const c of L.cast.children) if (!L.members.some(m => m.a.root === c)) c.visible = false
  return L.members.length
})()
"""

FRAME = r"""
([i, yaw, pitch, wave]) => {
  const L = window.__lineup
  L.members.forEach((m, k) => (m.a.root.visible = k === i))
  const m = L.members[i]
  // the box of the character at rest (the rig: body, hover, hands, objects; not the ground shadow)
  const box = new window.__B3().setFromObject(m.a.root.children[0], true)
  const c = box.getCenter(new window.__V3())
  const s = box.getSize(new window.__V3())
  const r = Math.max(s.x, s.y, s.z) * 0.62
  const fov = L.camera.fov * Math.PI / 180
  const d = r / Math.sin(fov / 2) * 1.02
  L.controls.target.copy(c)
  L.camera.position.set(c.x + Math.sin(yaw) * Math.cos(pitch) * d, c.y + Math.sin(pitch) * d, c.z + Math.cos(yaw) * Math.cos(pitch) * d)
  L.controls.update()
  if (wave) m.a.wave()
  return [s.x, s.y, s.z]
}
"""

ANGLES = {
  'front': (0.0, 0.18, False),
  'q': (0.85, 0.3, False),
  'side': (1.57, 0.15, False),
  'qback': (-2.4, 0.35, False),
  'back': (3.14159, 0.3, False),
  'wave': (-0.5, 0.2, True),
  'top': (0.3, 1.0, False),
}


def close(a):
    names = [s for s in a.only.split(',') if s]
    angles = a.angles.split(',')
    cell = a.cell
    out = Path(a.out)
    out.mkdir(parents=True, exist_ok=True)
    errors = []
    tiles = []
    with sync_playwright() as p:
        b = p.chromium.launch(channel='msedge', headless=True, args=['--use-angle=d3d11', '--ignore-gpu-blocklist'])
        page = b.new_page(viewport={'width': cell, 'height': cell})
        page.on('console', lambda m: m.type == 'error' and errors.append(m.text))
        page.on('pageerror', lambda e: errors.append(str(e)))
        # the page's panels hidden on every load (the dev server reloads when other agents save files)
        page.add_init_script("document.addEventListener('DOMContentLoaded', () => { const s = document.createElement('style'); s.textContent = '.glass{display:none!important}'; document.head.appendChild(s) })")
        page.goto(f'{ROOT}/atomlings?only={",".join(names)}&lang={a.lang}')
        page.wait_for_function('window.__lineup && window.__lineup.members.length > 0', timeout=90000)
        time.sleep(a.wait)
        n = page.evaluate(SETUP)
        ready = "!!(window.__B3 && window.__lineup && window.__lineup.members.length && window.__lineup.members[0].nextWave > 1e8)"
        for i in range(n):
            row = []
            for ang in angles:
                yaw, pitch, wave = ANGLES[ang]
                if not page.evaluate(ready):
                    page.wait_for_function('window.__lineup && window.__lineup.members.length > 0', timeout=90000)
                    time.sleep(a.wait)
                    page.evaluate(SETUP)
                page.evaluate(FRAME, [i, yaw, pitch, wave])
                time.sleep(0.75 if wave else 0.25)
                path = out / f'_{names[i]}_{ang}.png'
                page.screenshot(path=str(path))
                row.append(Image.open(path).convert('RGB'))
            tiles.append((names[i], row))
        b.close()
    # the sheet
    per = a.per_row
    gw = cell * len(angles)
    rows = (len(tiles) + per - 1) // per
    sheet = Image.new('RGB', (gw * per + (per - 1) * 8, rows * (cell + 26)), '#0b0f24')
    draw = ImageDraw.Draw(sheet)
    try:
        font = ImageFont.truetype('arial.ttf', 18)
    except Exception:
        font = ImageFont.load_default()
    for k, (name, row) in enumerate(tiles):
        x0 = (k % per) * (gw + 8)
        y0 = (k // per) * (cell + 26)
        draw.text((x0 + 6, y0 + 3), name, fill='#ffffff', font=font)
        for j, im in enumerate(row):
            sheet.paste(im, (x0 + j * cell, y0 + 26))
    dst = out / f'{a.name}.png'
    sheet.save(dst)
    for f in out.glob('_*.png'):
        f.unlink()
    print('sheet', dst)
    for e in errors:
        print('console error:', e[:300])


def rows(a):
    out = Path(a.out)
    out.mkdir(parents=True, exist_ok=True)
    w, h = map(int, a.size.split('x'))
    errors = []
    with sync_playwright() as p:
        b = p.chromium.launch(channel='msedge', headless=True, args=['--use-angle=d3d11', '--ignore-gpu-blocklist'])
        page = b.new_page(viewport={'width': w, 'height': h})
        page.on('console', lambda m: m.type == 'error' and errors.append(m.text))
        page.on('pageerror', lambda e: errors.append(str(e)))
        for s in a.sets.split(','):
            q = f'set={s}' if not s.startswith('only=') else s
            name = s if not s.startswith('only=') else 'only'
            page.goto(f'{ROOT}/atomlings?{q}&lang={a.lang}')
            page.wait_for_function('window.__lineup && window.__lineup.members.length > 0', timeout=90000)
            time.sleep(a.wait)
            dst = out / f'{a.prefix}-{name}.png'
            page.screenshot(path=str(dst))
            print('shot', dst)
        b.close()
    for e in errors:
        print('console error:', e[:300])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('mode', choices=['close', 'rows'])
    ap.add_argument('--only', default='')
    ap.add_argument('--name', default='sheet')
    ap.add_argument('--angles', default='front,q,back')
    ap.add_argument('--cell', type=int, default=280)
    ap.add_argument('--per-row', type=int, default=2)
    ap.add_argument('--sets', default='featured')
    ap.add_argument('--prefix', default='rows')
    ap.add_argument('--size', default='1700x900')
    ap.add_argument('--lang', default='pt-pt')
    ap.add_argument('--wait', type=float, default=3)
    ap.add_argument('--out', default=str(Path(__file__).with_name('shots')))
    a = ap.parse_args()
    close(a) if a.mode == 'close' else rows(a)


if __name__ == '__main__':
    main()
