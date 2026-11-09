"""Inside the atom (/e/<Symbol>/atom, docs/knowledge/inside-the-atom.md), worked by hand as a player does:
the greeting; at the electron map, its keys found on the screen, the hand over them (world.pointAt) and a
tap on each (world.onTap with the ray through that point): a subshell, the same key again (its first
orbital), a box (one orbital), "All"; E opens the map's panel, its electron map picks a cloud and its zoom
slider shrinks you towards the nucleus; the camera tapped (a photo), a burst of 100; the nucleus tapped (its
panel); the arch back to the hall (you come out in front of its atom). Screenshots in tools/shots/atom/.
Console errors fail it.

    py -3.11 tools/atom_probe.py [--el Fe] [--port 5310] [--phone] [--lang en] [--level scientist] [--no-shots]
"""
import argparse
import math
import pathlib
import sys
import time

from playwright.sync_api import sync_playwright

OUT = pathlib.Path(__file__).parent / 'shots' / 'atom'

# where a board key (or "All") is on the screen: its uv on the board, through the board's mesh, projected
KEY = """(sel) => {
  const b = __ew.world.parts.board
  const uv = b.uvOf(sel)
  if (!uv) return null
  const c = b.mesh.localToWorld(b.mesh.position.clone().set((uv.x - 0.5) * b.width, (uv.y - 0.5) * b.height, 0))
  c.project(__ew.camera)
  const r = __ew.canvas.getBoundingClientRect()
  return { x: r.left + (c.x + 1) / 2 * r.width, y: r.top + (1 - c.y) / 2 * r.height, on: Math.abs(c.x) < 0.96 && Math.abs(c.y) < 0.96 && c.z < 1 }
}"""
# the middle of a thing of the room (the camera's body, the nucleus), projected
THING = """(name) => {
  const t = name === 'camera' ? __ew.world.parts.camera.body : __ew.world.parts.nucleus
  const c = t.getWorldPosition(t.position.clone())
  c.project(__ew.camera)
  const r = __ew.canvas.getBoundingClientRect()
  return { x: r.left + (c.x + 1) / 2 * r.width, y: r.top + (1 - c.y) / 2 * r.height, on: Math.abs(c.x) < 0.96 && Math.abs(c.y) < 0.96 && c.z < 1 }
}"""
HAND = "({ x, y }) => !!__ew.world.pointAt(__ew.rayAt({ x, y }))"
TAP = "({ x, y }) => __ew.world.onTap(__ew.rayAt({ x, y }))"
PROMPT = "() => { const p = __ew.store.get().prompt; return p ? `${p.verb}: ${p.label}` : '' }"
SEL = "() => __ew.world.sel"
SHOTS = "() => __ew.world.shared.cloud.get().shots"
MAP = "() => __ew.world.panels.map('explorer').blocks.find(b => b.orbitals).orbitals"


def main():
    sys.stdout.reconfigure(encoding='utf-8')
    ap = argparse.ArgumentParser()
    ap.add_argument('--el', default='Fe')
    ap.add_argument('--port', type=int, default=5310)
    ap.add_argument('--base', default=None)
    ap.add_argument('--phone', action='store_true')
    ap.add_argument('--lang', default='en')
    ap.add_argument('--level', default=None, help='explorer or scientist')
    ap.add_argument('--no-shots', action='store_true')
    a = ap.parse_args()
    base = (a.base or f'http://localhost:{a.port}').rstrip('/')
    tag = f"{a.el}-{'phone' if a.phone else 'pc'}-{a.lang}-{a.level or 'explorer'}"
    OUT.mkdir(parents=True, exist_ok=True)
    fails, errors = [], []

    def check(what, ok, detail=''):
        print(f'  {what:58} {"ok" if ok else "WRONG"} {detail}')
        if not ok:
            fails.append(what)

    with sync_playwright() as p:
        b = p.chromium.launch(channel='msedge', headless=True, args=['--use-angle=d3d11', '--ignore-gpu-blocklist'])
        w, h = (390, 844) if a.phone else (1600, 900)
        ctx = b.new_context(viewport={'width': w, 'height': h}, device_scale_factor=2 if a.phone else 1, has_touch=a.phone, is_mobile=a.phone)
        if a.level:
            ctx.add_init_script(f"try {{ localStorage.setItem('ew-level', '{a.level}') }} catch (e) {{}}")
        page = ctx.new_page()
        page.on('console', lambda m: m.type == 'error' and errors.append(m.text))
        page.on('pageerror', lambda e: errors.append(str(e)))

        def shot(name):
            if not a.no_shots:
                page.screenshot(path=str(OUT / f'{name}-{tag}.png'))

        def face(x, z, tx, tz, pitch=-0.05):
            page.evaluate(f'() => __ew.teleport({x}, {z}, {math.atan2(-(tx - x), -(tz - z))}, {pitch})')
            time.sleep(1.5)

        def tap_at(at, what, expect=None, wait=1.2):
            if not at or not at['on']:
                check(f'{what} on the screen', False, str(at))
                return
            check(f'the hand over {what}', page.evaluate(HAND, at), f"({at['x']:.0f}, {at['y']:.0f})")
            page.evaluate(TAP, at)
            time.sleep(wait)
            if expect is not None:
                got = page.evaluate(SEL)
                check(f'tap {what}: shows {expect}', got == expect, f'(shows {got})')

        page.goto(f'{base}/e/{a.el}/atom?lang={a.lang}')
        page.wait_for_function('window.__ew && window.__ew.world && window.__ew.world.choose && !window.__ew.store.get().fading', timeout=90000)
        time.sleep(2.5)
        speech = page.evaluate('() => __ew.store.get().speech?.text || ""')
        check('the Atomling greets', len(speech) > 20, speech[:70])
        shot('0-arrive')

        # the electron map: stand in front of it, facing it
        spot = page.evaluate("() => { const i = __ew.world.interactables.find(i => i.id === 'map'); return { x: i.x, z: i.z, f: i.focus } }")
        face(spot['x'], spot['z'], spot['f']['x'], spot['f']['z'])
        print(f'  prompt: {page.evaluate(PROMPT)}')
        subs = page.evaluate(MAP)['subs']
        outer = subs[-1]['id']
        tap_at(page.evaluate(KEY, {'sub': outer}), f'the {outer} key', outer)
        shot('1-subshell')
        tap_at(page.evaluate(KEY, {'sub': outer}), f'the {outer} key again', f'{outer}:0')
        last = len(subs[-1]['boxes']) - 1
        if last > 0:
            tap_at(page.evaluate(KEY, {'sub': outer, 'm': last}), f'box {last} of {outer}', f'{outer}:{last}')
            shot('2-orbital')
        tap_at(page.evaluate(KEY, {'sub': 'all'}), '"All"', 'all')

        # E: the panel, its map and its zoom
        page.evaluate('() => __ew.player.use()')
        time.sleep(0.8)
        check('E opens the electron map panel', page.evaluate("() => !!__ew.store.get().panel?.blocks?.some(b => b.orbitals)"))
        first = subs[0]['id']
        page.evaluate(f"() => __ew.store.get().panel.blocks.find(b => b.orbitals).orbitals.pick({{ sub: '{first}', m: null }})")
        time.sleep(1.0)
        check(f"the panel's map picks {first}", page.evaluate(SEL) == first, page.evaluate(SEL))
        page.evaluate("() => __ew.store.get().panel.blocks.find(b => b.orbitals).orbitals.pick({ sub: 'all', m: null })")
        time.sleep(1.0)
        if len(subs) > 1:
            slider = page.evaluate("() => !!__ew.store.get().panel?.blocks?.find(b => b.slider)")
            check('the whole atom has its zoom slider', slider)
            if slider:
                page.evaluate("() => __ew.store.get().panel.blocks.find(b => b.slider).slider.onInput(0.8)")
                time.sleep(1.5)
                zoom = page.evaluate("() => __ew.world.shared.cloud.get().zoom")
                check('the slider shrinks you (zoom > 1)', zoom > 1.5, f'(×{zoom:.1f})')
                shot('3-panel-zoom')
                page.evaluate("() => __ew.store.get().panel.blocks.find(b => b.slider).slider.onInput(0)")
        page.evaluate('() => __ew.store.set({ panel: null })')

        # the camera: tap it, then a burst
        cam = page.evaluate("() => { const i = __ew.world.interactables.find(i => i.id === 'camera'); const g = __ew.world.parts.camera.group; return { x: i.x, z: i.z, cx: g.position.x, cz: g.position.z } }")
        face(cam['x'], cam['z'], cam['cx'], cam['cz'], 0.0)
        print(f'  prompt: {page.evaluate(PROMPT)}')
        before = page.evaluate(SHOTS)
        tap_at(page.evaluate(THING, 'camera'), 'the camera', None, 1.0)
        check('a tap on the camera takes a photo', page.evaluate(SHOTS) == before + 1, f'({before} -> {page.evaluate(SHOTS)})')
        page.evaluate(f"() => __ew.world.choose('{outer}')")
        time.sleep(1.2)
        page.evaluate('() => __ew.world.photos(100)')
        time.sleep(4.5)
        check('a burst of 100 photos', page.evaluate(SHOTS) == 100, f'({page.evaluate(SHOTS)})')
        page.evaluate('() => __ew.teleport(0, 10.2, 0, 0.02)')
        time.sleep(1.5)
        shot('4-photos')

        # the nucleus
        face(0, 3.0, 0, 0, 0.1)
        tap_at(page.evaluate(THING, 'nucleus'), 'the nucleus', None, 1.0)
        title = page.evaluate('() => __ew.store.get().panel?.title || ""')
        check('a tap on the nucleus opens its panel', bool(title), title)
        shot('5-nucleus')
        page.evaluate('() => __ew.store.set({ panel: null })')

        # back through the arch
        page.evaluate('() => __ew.teleport(0, 12.7, Math.PI, 0)')
        page.wait_for_function("() => __ew.store.get().world?.kind === 'atrium' && __ew.world && __ew.world.tiles && !__ew.store.get().fading", timeout=60000)
        time.sleep(1.5)
        pos = page.evaluate('() => ({ x: __ew.player.pos.x, z: __ew.player.pos.z })')
        check('the arch goes back to the hall, in front of its atom', abs(pos['x']) < 0.5 and 2.5 < pos['z'] < 4.5, str(pos))
        shot('6-back-in-the-hall')
        b.close()

    for e in errors:
        print('console error:', e)
    print(f"\n{len(fails)} wrong" + (': ' + ', '.join(fails) if fails else '') + f", {len(errors)} console errors")
    sys.exit(1 if fails or errors else 0)


if __name__ == '__main__':
    main()
