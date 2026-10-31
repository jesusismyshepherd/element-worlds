"""Carbon's wings worked by hand (src/worlds/wings/carbon/README.md, "Worked by hand"): the visitor
chooses each step by tapping the thing it is about (the user, 2026-10-30). For every station of the
allotropes gallery and the life garden the probe stands where a player uses it, facing it, finds each
thing on the screen, checks that the hand shows over it (world.pointAt) and taps it there (world.onTap
with the ray through that point, as a click does), then checks what changed; the panels open with E
(player.use), their sliders are moved; the prompt is printed after each step. Screenshots in
tools/shots/carbon/ (computer or phone, the language and depth in the name). Console errors fail it.

    py -3.11 tools/carbon_taps_probe.py [--port 5310] [--phone] [--lang en] [--level scientist]
                                        [--only peel,press] [--no-shots]
"""
import argparse
import math
import pathlib
import sys
import time

from playwright.sync_api import sync_playwright

OUT = pathlib.Path(__file__).parent / 'shots' / 'carbon'
GALLERY = '/e/C/allotropes'
GARDEN = '/e/C/life'


def ring(r, deg):
    return (r * math.cos(math.radians(deg)), r * math.sin(math.radians(deg)))


# (world, station, where the player stands, what it faces, pitch, steps). Steps: ('tap', thing, what must
# then be true, seconds to wait first), ('use',) E, ('js', code), ('wait', s), ('shot', name), ('close',)
# the panel, ('nohand', thing) the hand must not show there. In the code: P the world's parts, S the
# store's state, I(id) an exhibit.
STATIONS = [
    (GALLERY, 'peel', (-4.4, -2.6), (-7.3, -3.2), 0.1, [
        ('shot', 'peel-0'),
        ('tap', 'stack', 'P.peel.out', 4.4),
        ('shot', 'peel-free'),
        ('close',),
        ('tap', 'sheet', '!P.peel.out && !P.peel.moving', 2.2),
        ('js', '__ew.teleport(-2.6, -2.2, 1.37, 0.45)'), ('wait', 1.5),
        ('shot', 'peel-tape'),
        ('tap', 'tape', 'P.peel.out', 4.4),
        ('close',),
        ('tap', 'sheet', '!P.peel.out && !P.peel.moving', 2.2),
        ('use',), ('wait', 0.6), ('shot', 'peel-panel'),
        ('js', "S.panel.blocks.find(b => b.buttons).buttons[0].onClick()"), ('wait', 4.4),
        ('check', 'P.peel.free'),
        ('js', "S.panel.blocks.find(b => b.buttons).buttons[1].onClick()"), ('wait', 2.2),
        ('check', '!P.peel.out'), ('close',),
    ]),
    (GALLERY, 'graphite', (4.4, -2.6), (7.3, -3.2), 0.1, [
        ('tap', 'graphite', 'P.gr.slid', 2.6),
        ('shot', 'graphite-slid'),
        ('close',),
        ('tap', 'graphite', '!P.gr.slid', 2.4),
    ]),
    (GALLERY, 'transistor', (-4.5, -21.2), (-7.3, -21.4), 0.15, [
        ('shot', 'transistor-0'),
        ('tap', 'gate', 'P.transistor.busy', 2.6),
        ('shot', 'transistor-low'),
        ('wait', 5.0), ('close',),
        ('check', 'P.transistor.swept && P.transistor.mode === 0'),
        ('tap', 'chip@-0.75,0.05,0', 'P.transistor.mode === 1 && !P.transistor.swept', 0.6),
        ('tap', 'knob', 'P.transistor.busy', 2.6),
        ('shot', 'transistor-gap-low'),
        ('wait', 5.0),
        ('use',), ('wait', 0.4),
        ('js', 'P.tap.gate(0)'), ('wait', 1.2),
        ('check', 'Math.abs(P.transistor.vg) < 0.05 && P.transistor.current === 0'),
        ('shot', 'transistor-panel'),
        ('js', "S.panel.blocks.find(b => b.buttons).buttons[1].onClick()"), ('wait', 0.4),
        ('check', 'P.transistor.mode === 0 && P.transistor.current > 0.1'),
        ('close',),
    ]),
    (GALLERY, 'press', (4.5, -25.4), (7.7, -25.4), 0.28, [
        ('shot', 'press-0'),
        ('nohand', 'press-lever'),
        ('tap', 'press-graphite', 'P.press.actions.step === 1', 1.7),
        ('tap', 'press-lever', 'P.press.actions.step === 2', 3.9),
        ('shot', 'press-squeezed'),
        ('tap', 'press-capsule', 'P.press.actions.step === 3', 4.1),
        ('shot', 'press-hot'),
        ('tap', 'press-ram', 'P.press.actions.step === 4', 3.6),
        ('shot', 'press-diamond'),
        ('check', "S.panel && S.panel.exhibit === 'press'"),
        ('close',),
        ('tap', 'press-diamond', 'P.press.actions.step === 0', 1.5),
        ('use',), ('wait', 0.4), ('shot', 'press-panel'),
        ('js', "S.panel.blocks.find(b => b.buttons).buttons[2].onClick()"), ('wait', 0.3),
        ('check', 'P.press.actions.step === 0 && !P.press.actions.busy'),
        ('js', "S.panel.blocks.find(b => b.buttons).buttons[0].onClick()"), ('wait', 1.7),
        ('check', 'P.press.actions.step === 1'),
        ('close',),
    ]),
    (GALLERY, 'moire', (-6.7, -32.8), (-8.7, -37.0), 0.15, [
        ('tap', 'moire', "S.panel && S.panel.exhibit === 'moire'", 0.8),
        ('shot', 'moire-panel'),
        ('close',),
    ]),
] + [
    (GALLERY, sid, use, at, 0.1, [('tap', sid, f"I('{sid}').found", wait), ('shot', f'{sid}-tapped'), ('close',)])
    for sid, use, at, wait in [
        ('physics', (-4.3, -9.0), (-7.3, -9.6), 1.8),
        ('chemistry', (-4.4, -15.0), (-7.3, -15.4), 2.0),
        ('materials', (-3.9, -27.4), (-6.0, -27.2), 1.6),
        ('pencil', (4.3, -8.2), (7.2, -8.4), 2.0),
        ('diamond', (4.3, -15.8), (7.6, -16.2), 1.7),
        ('brilliant', (3.6, -19.6), (5.0, -19.8), 1.5),
        ('nanotube', (0, -18.0), (0, -25.0), 1.8),
        ('fullerene', (0, -32.2), (0, -35.0), 1.0),
        ('football', (5.3, -32.6), (7.3, -33.4), 2.4),
    ]
] + [
    (GARDEN, 'dial', (-7.7, 1.6), (-7.0, 2.7), 0.1, [
        ('shot', 'dial-0'),
        ('tap', 'dial', 'P.dial.night', 2.4),
        ('shot', 'dial-night'),
        ('use',), ('wait', 0.4),
        ('js', 'P.tap.sun(0.5)'), ('wait', 2.5),
        ('check', 'Math.abs(P.dial.sun - 0.5) < 0.01 && !P.dial.night'),
        ('shot', 'dial-dusk'),
        ('close',),
        ('tap', 'dial', 'P.dial.night', 0.5),
        ('tap', 'dial', '!P.dial.night && P.dial.sun === 1', 2.4),
    ]),
    (GARDEN, 'c14', ring(9.9, 135), ring(12.4, 135), 0.12, [
        ('shot', 'c14-0'),
        ('nohand', 'jar'),
        ('tap', 'clock', 'P.clock.halvings === 1', 1.9),
        ('tap', 'clock', 'P.clock.halvings === 2', 1.9),
        ('tap', 'clock', 'P.clock.halvings === 3', 1.9),
        ('tap', 'clock', 'P.clock.halvings === 4', 2.0),
        ('shot', 'c14-four'),
        ('check', "S.panel && S.panel.exhibit === 'c14'"),
        ('close',),
        ('js', "for (let k = 0; k < 4; k++) setTimeout(() => P.tap.c14('wait'), k * 1800)"), ('wait', 7.6),
        ('check', 'P.clock.halvings === 8'),
        ('nohand', 'clock'),
        ('tap', 'jar', 'P.clock.halvings === 0', 1.8),
        ('shot', 'c14-fresh'),
    ]),
] + [
    (GARDEN, sid, ring(9.9 if sid in ('body', 'cycle') else 10.2, deg), ring(12.2 if sid in ('body', 'cycle') else 11.6, deg), 0.1,
     [('tap', sid, f"I('{sid}').found", 1.2), ('shot', f'{sid}-tapped'), ('close',)])
    for sid, deg in [('body', 225), ('methane', 284), ('ethane', 296.5), ('ethanol', 309), ('benzene', 321.5), ('glucose', 334), ('cycle', 45)]
]

PRE = "const P = __ew.world.parts, S = __ew.store.get(), I = id => __ew.world.interactables.find(i => i.id === id);"
# where a thing is on the screen: the middle of its meshes, projected
# (`name@x,y,z`: that point in the thing's own frame instead, e.g. the chip's source pad beside its gate)
WHERE = """(spec) => {
  const [name, at] = spec.split('@')
  const t = __ew.world.parts.targets[name]
  if (!t) return null
  let c
  if (at) {
    const [x, y, z] = at.split(',').map(Number)
    c = t.localToWorld(t.position.clone().set(x, y, z))
  } else {
    const pts = []
    t.traverse(m => {
      if (!m.geometry) return
      m.geometry.computeBoundingSphere()
      pts.push(m.localToWorld(m.geometry.boundingSphere.center.clone()))
    })
    c = pts[0].clone()
    for (const p of pts.slice(1)) c.add(p)
    c.multiplyScalar(1 / pts.length)
  }
  const w = { x: c.x, z: c.z }
  c.project(__ew.camera)
  const b = __ew.canvas.getBoundingClientRect()
  return { x: b.left + (c.x + 1) / 2 * b.width, y: b.top + (1 - c.y) / 2 * b.height, on: Math.abs(c.x) < 0.94 && Math.abs(c.y) < 0.94 && c.z < 1, w }
}"""
# a player who cannot see the thing (an upright phone's narrow view) turns toward it where they stand
TURN = """({ x, z }) => {
  const p = __ew.player.pos
  __ew.teleport(p.x, p.z, Math.atan2(-(x - p.x), -(z - p.z)), __ew.player.pitch)
}"""
HAND = "({ x, y }) => !!__ew.world.pointAt(__ew.rayAt({ x, y }))"
TAP = "({ x, y }) => __ew.world.onTap(__ew.rayAt({ x, y }))"
PROMPT = "() => { const p = __ew.store.get().prompt; return p ? `${p.verb}: ${p.label}` : '' }"


def main():
    sys.stdout.reconfigure(encoding='utf-8')
    ap = argparse.ArgumentParser()
    ap.add_argument('--port', type=int, default=5310)
    ap.add_argument('--base', default=None)
    ap.add_argument('--phone', action='store_true')
    ap.add_argument('--lang', default='en')
    ap.add_argument('--level', default=None, help='explorer or scientist')
    ap.add_argument('--only', default='', help='station names, comma separated')
    ap.add_argument('--no-shots', action='store_true')
    a = ap.parse_args()
    only = {s for s in a.only.split(',') if s}
    base = (a.base or f'http://localhost:{a.port}').rstrip('/')
    tag = f"{'phone' if a.phone else 'pc'}-{a.lang}-{a.level or 'explorer'}"
    OUT.mkdir(parents=True, exist_ok=True)
    fails, errors = [], []

    def check(what, ok, detail=''):
        print(f'  {what:60} {"ok" if ok else "WRONG"} {detail}')
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
        here = None
        for world, name, (ux, uz), (tx, tz), pitch, steps in STATIONS:
            if only and name not in only:
                continue
            if world != here:
                page.goto(f'{base}{world}?lang={a.lang}')
                page.wait_for_function('window.__ew && window.__ew.world && window.__ew.world.onTap && !window.__ew.store.get().fading', timeout=90000)
                time.sleep(2.0)
                here = world
            print(f'{name}:')
            page.evaluate('() => __ew.store.set({ panel: null, speech: null })')
            yaw = math.atan2(-(tx - ux), -(tz - uz))
            page.evaluate(f'() => __ew.teleport({ux}, {uz}, {yaw}, {pitch})')
            time.sleep(1.6)
            print(f'  prompt: {page.evaluate(PROMPT)}')
            for step in steps:
                kind = step[0]
                if kind == 'tap' or kind == 'nohand':
                    at = page.evaluate(WHERE, step[1])
                    if at and not at['on']:
                        page.evaluate(TURN, at['w'])
                        time.sleep(1.2)
                        print(f'  (turned toward {step[1]})')
                        at = page.evaluate(WHERE, step[1])
                    if not at or not at['on']:
                        check(f'{step[1]} on the screen', False, str(at))
                        continue
                    hand = page.evaluate(HAND, at)
                    if kind == 'nohand':
                        check(f'no hand over {step[1]} now', not hand)
                        continue
                    check(f'the hand over {step[1]}', hand, f"({at['x']:.0f}, {at['y']:.0f})")
                    page.evaluate(TAP, at)
                    time.sleep(step[3])
                    ok = page.evaluate(f'() => {{ {PRE} return !!({step[2]}) }}')
                    check(f'tap {step[1]}: {step[2]}', ok)
                    print(f'  prompt: {page.evaluate(PROMPT)}')
                elif kind == 'check':
                    check(step[1], page.evaluate(f'() => {{ {PRE} return !!({step[1]}) }}'))
                elif kind == 'use':
                    page.evaluate('() => __ew.player.use()')
                elif kind == 'js':
                    page.evaluate(f'() => {{ {PRE} {step[1]} }}')
                elif kind == 'wait':
                    time.sleep(step[1])
                elif kind == 'close':
                    page.evaluate('() => __ew.store.set({ panel: null })')
                    time.sleep(0.3)
                elif kind == 'shot' and not a.no_shots:
                    path = OUT / f'{step[1]}-{tag}.png'
                    page.screenshot(path=str(path))
        b.close()
    for e in errors:
        print('console error:', e[:300])
    print(f'\n{len(fails)} wrong' if fails else '\nall ok')
    sys.exit(1 if fails or errors else 0)


if __name__ == '__main__':
    main()
