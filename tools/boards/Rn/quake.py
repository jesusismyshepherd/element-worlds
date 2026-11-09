"""Board 'quake': radon as an earthquake sign, as research. A slice through the ground at dusk: layers of rock
offset along a fault, two big arrows pushing the blocks past each other, small cracks opening near the
fault deep down; radon rising up the fault zone into the soil and into the water of a well, where a little
monitoring hut with an antenna measures it. Above, a screen with the reading: flat, rising, a peak, falling
again, then the earthquake's jagged trace. Houses with tiled roofs on the left, mountains behind."""
import math
import os
import random
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from rnkit import *  # noqa: E402,F401,F403

COLOR = "#5ee08f"
SURF = 336
LAYERS = ["#8a6a4a", "#6e5040", "#9a7a54", "#5a4a44", "#7c6450", "#4e4248", "#6a5a4a"]


def build():
    s = Svg("Rn", COLOR)
    setup(s)
    background(s, glows=[(620, 330, 360, 0.5), (980, 160, 260, 0.45)], seed=1995, stars=40,
               star_box=(0, 0, 1200, 220), bokeh=4)
    rnd = random.Random(117)
    s.d(lin("mtn", [(0, "#2c4a56"), (1, "#1a2c3a")], x1=0, y1=0, x2=0, y2=1),
        lin("turf", [(0, "#4a7a44"), (1, "#2e4c2a")], x1=0, y1=0, x2=0, y2=1),
        lin("water", [(0, "#4a8ad8"), (1, "#1e4a8a")], x1=0, y1=0, x2=0, y2=1),
        lin("screen", [(0, "#0e1a2a"), (1, "#0a1220")], x1=0, y1=0, x2=0, y2=1))

    # ---------- mountains behind
    s.a(f'<path d="{smooth([(-40, 300), (120, 220), (260, 250), (420, 196), (560, 240), (700, 210), (880, 256), (1040, 226), (1240, 270), (1240, 340), (-40, 340)])}" fill="url(#mtn)"/>')

    # ---------- the slice: layers of rock, offset across the fault
    fault_top, fault_bot = (600, SURF), (450, 700)
    def fx(y):
        return fault_top[0] + (fault_bot[0] - fault_top[0]) * (y - fault_top[1]) / (fault_bot[1] - fault_top[1])
    off = 46  # the left block is pushed up this much
    s.d(f'<clipPath id="leftB"><path d="M-10,{SURF - 8} L{f(fx(SURF))},{SURF - 8} L{f(fx(800))},800 L-10,800Z"/></clipPath>',
        f'<clipPath id="rightB"><path d="M{f(fx(SURF))},{SURF} L1210,{SURF} L1210,800 L{f(fx(800))},800Z"/></clipPath>')
    for clip, shift in (("leftB", -off), ("rightB", 0)):
        out = [f'<g clip-path="url(#{clip})">']
        y = SURF + 2 + shift
        k = 0
        while y < 820:
            h = 46 + (k * 17) % 22
            wave = [(x, y + 8 * math.sin(x / 160 + k)) for x in range(-40, 1320, 80)]
            pts = wave + [(1300, y + h + 10), (-40, y + h + 10)]
            out.append(f'<polygon points="{P(pts)}" fill="{LAYERS[k % len(LAYERS)]}"/>')
            y += h
            k += 1
        out.append("</g>")
        s.a("".join(out))
    # the topsoil and turf over both blocks, a small step where the fault meets the surface
    s.a(f'<path d="M-10,{SURF - 10} L{f(fx(SURF) - 4)},{SURF - 10} L{f(fx(SURF) + 6)},{SURF} L1210,{SURF} L1210,{SURF + 18} '
        f'L{f(fx(SURF) + 4)},{SURF + 18} L{f(fx(SURF) - 6)},{SURF + 8} L-10,{SURF + 8}Z" fill="url(#turf)"/>')
    # darken the deep part
    s.d(lin("deepQ", [(0, NAVY_DEEP, 0), (1, NAVY_DEEP, 0.7)], x1=0, y1=0, x2=0, y2=1))
    s.a(f'<rect x="0" y="{SURF + 20}" width="1200" height="{800 - SURF - 20}" fill="url(#deepQ)"/>')
    # the fault itself: a dark seam
    s.a(f'<line x1="{f(fx(SURF))}" y1="{SURF}" x2="{f(fx(700))}" y2="700" stroke="#1a1418" stroke-width="7"/>')
    # the push: the left block up, the right block down
    for (y, sgn) in ((470, 1), (560, -1)):
        x = fx(y) + (-62 if sgn > 0 else 62)
        dx, dy = (fault_top[0] - fault_bot[0]), (fault_top[1] - fault_bot[1])
        n = math.hypot(dx, dy)
        ux, uy = dx / n * 70 * sgn, dy / n * 70 * sgn
        s.a(arrow([(x - ux, y - uy), (x + ux, y + uy)], "#ff6a5a", w=9, op=0.9))
    # small cracks opening near the fault, deep down
    for (x, y) in ((fx(560) - 30, 560), (fx(600) + 26, 600), (fx(520) + 30, 520), (fx(610) - 40, 612)):
        pts = [(x, y)]
        for j in range(4):
            pts.append((pts[-1][0] + rnd.uniform(-10, 10), pts[-1][1] - rnd.uniform(6, 12)))
        s.a(f'<polyline points="{P(pts)}" fill="none" stroke="#ffd08a" stroke-width="2.5" opacity="0.8"/>')

    # ---------- the well and its little hut
    wx = 760
    s.a(f'<rect x="{wx - 18}" y="{SURF}" width="36" height="250" fill="#141018"/>',
        f'<rect x="{wx - 14}" y="{SURF + 96}" width="28" height="150" fill="url(#water)"/>',
        f'<rect x="{wx - 18}" y="{SURF}" width="4" height="250" fill="#5a5e68"/><rect x="{wx + 14}" y="{SURF}" width="4" height="250" fill="#5a5e68"/>')
    s.a(f'<line x1="{wx}" y1="{SURF - 30}" x2="{wx}" y2="{SURF + 200}" stroke="#c8ccd6" stroke-width="3"/>',
        f'<rect x="{wx - 6}" y="{SURF + 196}" width="12" height="22" rx="3" fill="#e0a83a"/>')
    hx = wx + 40
    s.a(f'<rect x="{hx - 50}" y="{SURF - 62}" width="100" height="62" fill="#d8d2c4"/>'.replace("#d8d2c4", "#b8b2a6"),
        f'<path d="M{hx - 60},{SURF - 60} L{hx},{SURF - 92} L{hx + 60},{SURF - 60}Z" fill="#4a5a6a"/>',
        f'<rect x="{hx - 14}" y="{SURF - 40}" width="28" height="40" fill="#5a4a3a"/>',
        f'<line x1="{hx + 36}" y1="{SURF - 70}" x2="{hx + 36}" y2="{SURF - 150}" stroke="#c8ccd6" stroke-width="3"/>',
        f'<circle cx="{hx + 36}" cy="{SURF - 152}" r="5" fill="#ff6a5a"/>',
        glow(hx + 36, SURF - 152, 14, "#ff6a5a", 0.5, "s4"))
    s.a(f'<path d="M{wx},{SURF - 30} L{hx - 50},{SURF - 30}" stroke="#c8ccd6" stroke-width="3"/>')
    # radio waves from the antenna, up to the screen
    for k in range(3):
        r = 16 + k * 12
        s.a(f'<path d="M{hx + 36 + r * 0.7},{SURF - 152 - r * 0.7} A{r},{r} 0 0 0 {hx + 36 - r * 0.2},{SURF - 152 - r}" '
            f'fill="none" stroke="{COLOR}" stroke-width="3" opacity="{0.8 - k * 0.2:.2f}"/>')

    # ---------- radon rising up the fault zone, into the soil and the well's water
    for k in range(7):
        y0 = 640 - k * 34
        x0 = fx(y0) + rnd.uniform(-20, 20)
        s.a(radon(x0, y0, 7.5, 0.95 - k * 0.04))
    s.a(wisp([(fx(660), 660), (fx(560) + 8, 560), (fx(460) - 6, 460), (fx(SURF) + 4, SURF + 8), (fx(SURF) - 10, SURF - 40)], w=12, op=0.3))
    s.a(wisp([(fx(520) + 10, 520), (650, 470), (wx - 10, SURF + 160)], w=9, op=0.3))
    for (x, y) in ((wx - 4, SURF + 130), (wx + 6, SURF + 170), (wx - 6, SURF + 210), (680, 480), (620, 500)):
        s.a(radon(x, y, 7, 0.95))
    for (x, y, o) in ((fx(SURF) - 14, SURF - 34, 0.8), (fx(SURF) + 10, SURF - 70, 0.55)):
        s.a(radon(x, y, 6.5, o))

    # ---------- houses with tiled roofs on the left block
    for (x, w) in ((110, 120), (270, 100), (410, 90)):
        base = SURF - 10
        s.a(f'<rect x="{x}" y="{base - 56}" width="{w}" height="56" fill="#cfc4b0" opacity="0.85"/>'.replace("#cfc4b0", "#a89e8c"),
            f'<path d="M{x - 20},{base - 50} Q{x - 4},{base - 56} {x + 10},{base - 84} L{x + w - 10},{base - 84} '
            f'Q{x + w + 4},{base - 56} {x + w + 20},{base - 50}Z" fill="#4e5868"/>',
            f'<line x1="{x + 10}" y1="{base - 84}" x2="{x + w - 10}" y2="{base - 84}" stroke="#8a94a8" stroke-width="4" stroke-linecap="round"/>',
            f'<rect x="{x + w * 0.4}" y="{base - 36}" width="{w * 0.2}" height="36" fill="#4a3a2a"/>',
            f'<rect x="{x + 12}" y="{base - 40}" width="20" height="16" fill="#ffd26a" opacity="0.75"/>')
    for (x, h) in ((60, 50), (240, 40), (520, 46), (980, 52), (1100, 44)):
        s.a(f'<rect x="{x - 3}" y="{SURF - 12 - h * 0.4}" width="6" height="{h * 0.4}" fill="#4a3424"/>',
            f'<ellipse cx="{x}" cy="{SURF - 12 - h * 0.6}" rx="{h * 0.42}" ry="{h * 0.5}" fill="#2f5a3a"/>')

    # ---------- the screen: the reading over the months, then the quake's trace
    gx0, gy0, gx1, gy1 = 820, 60, 1150, 230
    s.a(f'<rect x="{gx0 - 8}" y="{gy0 - 8}" width="{gx1 - gx0 + 16}" height="{gy1 - gy0 + 16}" rx="14" fill="#2a3442"/>',
        f'<rect x="{gx0}" y="{gy0}" width="{gx1 - gx0}" height="{gy1 - gy0}" rx="8" fill="url(#screen)"/>')
    for k in range(1, 4):
        y = gy0 + k * (gy1 - gy0) / 4
        s.a(f'<line x1="{gx0 + 6}" y1="{f(y)}" x2="{gx1 - 6}" y2="{f(y)}" stroke="{COLOR}" stroke-width="1" opacity="0.15"/>')
    curve = [(gx0 + 14, gy1 - 22), (gx0 + 60, gy1 - 24), (gx0 + 100, gy1 - 34), (gx0 + 140, gy1 - 56), (gx0 + 180, gy1 - 92),
             (gx0 + 210, gy0 + 22), (gx0 + 236, gy1 - 70), (gx0 + 262, gy1 - 36)]
    s.a(f'<path d="{smooth(curve, closed=False)}" fill="none" stroke="{RN_GLOW}" stroke-width="5" stroke-linecap="round"/>')
    s.a(f'<circle cx="{gx0 + 210}" cy="{gy0 + 22}" r="6" fill="{RN_GLOW}"/>')
    # the quake: a dashed line and a jagged trace
    qx = gx0 + 288
    s.a(f'<line x1="{qx}" y1="{gy0 + 10}" x2="{qx}" y2="{gy1 - 10}" stroke="#ff6a5a" stroke-width="2" stroke-dasharray="5 5" opacity="0.8"/>')
    zig = [(qx - 6, gy1 - 50)]
    for j in range(9):
        zig.append((qx - 6 + j * 4 + 4, gy1 - 50 + (36 - j * 3) * (1 if j % 2 else -1)))
    s.a(f'<polyline points="{P(zig)}" fill="none" stroke="#ff6a5a" stroke-width="3" stroke-linejoin="round"/>')

    finish(s)
    s.save("quake")


if __name__ == "__main__":
    build()
