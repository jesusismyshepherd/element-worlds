"""Board 'kitchen': a kitchen counter in warm light. In the middle a cake that has risen high over the
line where its batter began, cut open to show the bubbles inside, carbon dioxide in them and rising from
the top; on the left a spoon of baking soda with a molecule of it (sodium bicarbonate) floating over it;
on the right a glass of vinegar foaming over where the soda went in, a lemon beside it."""
import math
import os
import random
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from lib.style import *  # noqa: E402,F401

PEACH = "#ff9e5e"
TOP = 548  # the counter's top


def nahco3(cx, cy, k=1.0):
    """Sodium bicarbonate as balls and sticks: the hydrogencarbonate (C with three O, one O holding H)
    and the sodium ion beside it."""
    C = (cx, cy)
    d = 58 * k
    o_up = (cx, cy - d)
    o_r = (cx + d * math.cos(math.radians(30)), cy + d * math.sin(math.radians(30)))
    o_l = (cx - d * math.cos(math.radians(30)), cy + d * math.sin(math.radians(30)))
    h = (o_l[0] - 36 * k, o_l[1] + 26 * k)
    na = (o_r[0] + 62 * k, o_r[1] + 22 * k)
    out = []
    for a, b in ((C, o_up), (C, o_r), (C, o_l), (o_l, h)):
        out.append(bond(a[0], a[1], b[0], b[1], 11 * k, "#5a6070"))
        out.append(bond(a[0], a[1], b[0], b[1], 5 * k, "#cfd6e8"))
    # the double bond to the top oxygen
    out.append(bond(C[0] + 9 * k, C[1], o_up[0] + 9 * k, o_up[1], 5 * k, "#cfd6e8"))
    # the sodium ion held by attraction, not a stick: a dotted line
    out.append(f'<line x1="{f(o_r[0])}" y1="{f(o_r[1])}" x2="{f(na[0])}" y2="{f(na[1])}" stroke="#e6d6ff" stroke-width="{f(4 * k)}" '
               f'stroke-dasharray="{f(3 * k)} {f(9 * k)}" stroke-linecap="round"/>')
    out.append(ball(h[0], h[1], 13 * k, "H"))
    for p in (o_up, o_l, o_r):
        out.append(ball(p[0], p[1], 21 * k, "O"))
    out.append(ball(C[0], C[1], 21 * k, "C"))
    out.append(ion(na[0], na[1], 27 * k, "Na", "+"))
    return "".join(out)


def build():
    s = Svg("Na", PEACH)
    background(s, glows=[(600, 330, 380, 0.85), (230, 300, 260, 0.5), (980, 330, 260, 0.5)], seed=80, stars=26,
               star_box=(0, 0, 1200, 200), bokeh=4)
    rnd = random.Random(2)
    s.d(lin("counter", [(0, "#c98a5a"), (0.1, "#9a6038"), (1, "#3a2416")], x1=0, y1=0, x2=0, y2=1),
        lin("crust", [(0, "#e8a050"), (1, "#a8601e")], x1=0, y1=0, x2=0, y2=1),
        lin("crumb", [(0, "#fff6dc"), (1, "#f6d898")], x1=0, y1=0, x2=0, y2=1),
        lin("plate", [(0, "#ffffff"), (1, "#c8d0dc")], x1=0, y1=0, x2=0, y2=1),
        lin("glass", [(0, "#ffffff", 0.35), (0.2, "#dff2ff", 0.12), (0.8, "#dff2ff", 0.12), (1, "#ffffff", 0.4)], x1=0, y1=0, x2=1, y2=0),
        lin("vinegar", [(0, "#f6e6b0", 0.8), (1, "#e0c070", 0.85)], x1=0, y1=0, x2=0, y2=1),
        lin("spoon", [(0, "#ffffff"), (0.5, "#c8d0dc"), (1, "#8a94a6")], x1=0, y1=0, x2=0, y2=1),
        rad("lemon", [(0, "#fffbd0"), (0.7, "#ffe24a"), (1, "#e8b800")]))

    # tiles behind the counter, faint
    for j in range(5):
        for i in range(13):
            x, y = i * 96 - 20 + (j % 2) * 48, 210 + j * 70
            s.a(f'<rect x="{x}" y="{y}" width="90" height="64" rx="6" fill="#ffffff" opacity="0.035"/>')

    # ---------- the counter
    s.a(f'<rect x="0" y="{TOP}" width="1200" height="{800 - TOP}" fill="url(#counter)"/>',
        f'<rect x="0" y="{TOP}" width="1200" height="6" fill="#e8b080" opacity="0.6"/>')

    # ---------- the cake on its stand
    cx, base = 600, 480
    s.a(f'<ellipse cx="{cx}" cy="{TOP + 6}" rx="150" ry="14" fill="#000" opacity="0.3"/>',
        f'<path d="M{cx - 40},{TOP} L{cx - 22},{base + 30} L{cx + 22},{base + 30} L{cx + 40},{TOP}Z" fill="url(#plate)"/>',
        f'<ellipse cx="{cx}" cy="{TOP}" rx="70" ry="10" fill="#dfe6ee"/>',
        f'<ellipse cx="{cx}" cy="{base + 22}" rx="210" ry="24" fill="#b8c2d0"/>',
        f'<ellipse cx="{cx}" cy="{base + 16}" rx="210" ry="24" fill="url(#plate)"/>')
    w, h = 340, 150
    x0, x1 = cx - w / 2, cx + w / 2
    # the cake cut in half: its golden crust round a dome, the soft sponge of the cut face inside
    outer = (f"M{x0},{base} L{x0},{base - h + 30} Q{x0 + 6},{base - h - 26} {cx},{base - h - 40} "
             f"Q{x1 - 6},{base - h - 26} {x1},{base - h + 30} L{x1},{base} Q{cx},{base + 22} {x0},{base}Z")
    inner = (f"M{x0 + 14},{base - 4} L{x0 + 14},{base - h + 34} Q{x0 + 20},{base - h - 12} {cx},{base - h - 24} "
             f"Q{x1 - 20},{base - h - 12} {x1 - 14},{base - h + 34} L{x1 - 14},{base - 4} Q{cx},{base + 12} {x0 + 14},{base - 4}Z")
    s.a(f'<path d="{outer}" fill="url(#crust)" stroke="#8a4a14" stroke-width="3"/>',
        f'<path d="{inner}" fill="url(#crumb)"/>')
    s.d(f'<clipPath id="crumbClip"><path d="{inner}"/></clipPath>')
    holes = []
    for _ in range(170):
        x = rnd.uniform(x0 + 10, x1 - 10)
        y = rnd.uniform(base - h - 26, base + 4)
        r = rnd.uniform(2, 5.5)
        holes.append(f'<ellipse cx="{f(x)}" cy="{f(y)}" rx="{f(r)}" ry="{f(r * 0.75)}" fill="#e2b468" opacity="0.6"/>')
    s.a('<g clip-path="url(#crumbClip)">' + "".join(holes) + '</g>')
    # a few big bubbles with carbon dioxide in them
    for (x, y) in ((cx - 90, base - 70), (cx + 10, base - 112), (cx + 104, base - 52), (cx - 10, base - 34)):
        s.a(f'<ellipse cx="{x}" cy="{y}" rx="32" ry="24" fill="#d89a48" opacity="0.5"/>',
            f'<ellipse cx="{x}" cy="{y}" rx="32" ry="24" fill="none" stroke="#fff8e6" stroke-width="2.5" opacity="0.85"/>',
            co2(x, y, 8.5))
    # the line where the batter began, before the oven: the cake rose far over it
    s.a(f'<path d="M{x0 - 24},{base - 58} L{x1 + 6},{base - 58}" stroke="#ffffff" stroke-width="4" stroke-dasharray="12 10" opacity="0.9"/>',
        f'<path d="M{x0 - 24},{base - 58} L{x0 - 24},{base - h - 30}" stroke="#ffffff" stroke-width="5" stroke-linecap="round" opacity="0.9"/>',
        f'<path d="M{x0 - 40},{base - h - 10} L{x0 - 24},{base - h - 34} L{x0 - 8},{base - h - 10}" fill="none" stroke="#ffffff" '
        f'stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>')
    # a gloss on the crust's dome
    s.a(f'<path d="M{x0 + 4},{base - h + 20} Q{x0 + 14},{base - h - 20} {cx - 70},{base - h - 34}" fill="none" stroke="#ffd29a" '
        f'stroke-width="5" stroke-linecap="round" opacity="0.8"/>')
    # carbon dioxide and warm air rising from the cake
    for k, (x, y) in enumerate(((cx - 70, base - h - 80), (cx + 50, base - h - 110), (cx - 10, base - h - 170))):
        s.a(co2(x, y, 12, ang=rnd.uniform(-30, 30), op=0.95))
    for k in range(3):
        x = cx - 90 + k * 90
        pts = [(x + 8 * math.sin(i * 1.4 + k), base - h - 50 - i * 16) for i in range(6)]
        s.a(f'<path d="{smooth(pts, closed=False)}" fill="none" stroke="#ffe6c8" stroke-width="4" stroke-linecap="round" opacity="0.45"/>')

    # ---------- the spoon of baking soda, and a molecule of it
    sx, sy = 190, TOP - 22
    s.a(f'<path d="M{sx + 70},{sy + 2} L{sx + 250},{sy + 28} L{sx + 252},{sy + 40} L{sx + 68},{sy + 16}Z" fill="url(#spoon)" stroke="#6a7486" stroke-width="2"/>',
        f'<ellipse cx="{sx}" cy="{sy + 6}" rx="82" ry="30" fill="url(#spoon)" stroke="#6a7486" stroke-width="2"/>',
        f'<path d="M{sx - 72},{sy + 2} Q{sx - 30},{sy - 52} {sx + 6},{sy - 46} Q{sx + 52},{sy - 50} {sx + 74},{sy + 2}Z" fill="#ffffff"/>',
        f'<path d="M{sx - 40},{sy - 22} Q{sx - 10},{sy - 44} {sx + 24},{sy - 38}" fill="none" stroke="#e6ecf4" stroke-width="5" opacity="0.9"/>')
    for _ in range(14):
        x = sx + rnd.uniform(-90, 100)
        y = TOP + rnd.uniform(2, 14)
        s.a(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(rnd.uniform(1.5, 3))}" fill="#ffffff" opacity="0.8"/>')
    s.a(glow(sx + 20, 300, 120, "#ffffff", 0.12, "s16"), nahco3(sx + 6, 300, 1.0))
    for (x, y) in ((sx - 20, sy - 70), (sx + 20, sy - 96), (sx - 4, sy - 126)):
        s.a(f'<circle cx="{x}" cy="{y}" r="3" fill="#ffffff" opacity="0.7"/>')

    # ---------- the glass of vinegar foaming over, a lemon beside it
    gx, gw, gt = 960, 120, 330
    s.a(f'<ellipse cx="{gx}" cy="{TOP + 4}" rx="80" ry="10" fill="#000" opacity="0.3"/>',
        f'<path d="M{gx - gw / 2},{gt} L{gx - gw / 2 + 10},{TOP - 4} Q{gx},{TOP + 6} {gx + gw / 2 - 10},{TOP - 4} L{gx + gw / 2},{gt}Z" '
        f'fill="url(#vinegar)"/>')
    # bubbles in the liquid
    for _ in range(26):
        x = gx + rnd.uniform(-46, 46)
        y = rnd.uniform(gt + 30, TOP - 14)
        s.a(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(rnd.uniform(2.5, 6))}" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.8"/>')
    # foam rising out of the glass and running down its side
    foam = [(gx - 66, gt + 14), (gx - 80, gt - 10), (gx - 64, gt - 46), (gx - 30, gt - 66), (gx + 10, gt - 74), (gx + 50, gt - 60),
            (gx + 74, gt - 30), (gx + 70, gt + 4), (gx + 78, gt + 40), (gx + 70, gt + 70), (gx + 58, gt + 30), (gx + 40, gt + 16),
            (gx - 20, gt + 18)]
    s.a(f'<path d="{smooth(foam)}" fill="#fffaf0" stroke="#e8d8b8" stroke-width="2"/>')
    for _ in range(30):
        x = gx + rnd.uniform(-60, 60)
        y = gt + rnd.uniform(-60, 10)
        s.a(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(rnd.uniform(3, 8))}" fill="none" stroke="#e0ccaa" stroke-width="1.5" opacity="0.8"/>')
    s.a(f'<path d="M{gx - gw / 2},{gt} L{gx - gw / 2 + 10},{TOP - 4} Q{gx},{TOP + 6} {gx + gw / 2 - 10},{TOP - 4} L{gx + gw / 2},{gt}" '
        f'fill="url(#glass)" stroke="#ffffff" stroke-opacity="0.7" stroke-width="3"/>',
        f'<rect x="{gx - gw / 2 + 14}" y="{gt + 20}" width="9" height="{TOP - gt - 44}" rx="4" fill="#ffffff" opacity="0.45"/>')
    for (x, y, a) in ((gx - 20, gt - 120, 20), (gx + 40, gt - 170, -25), (gx - 50, gt - 210, 10)):
        s.a(co2(x, y, 12, ang=a, op=0.95))
    # half a lemon
    lx, ly = 1110, TOP - 28
    s.a(f'<ellipse cx="{lx}" cy="{ly + 4}" rx="56" ry="34" fill="#e8b800"/>',
        f'<ellipse cx="{lx}" cy="{ly}" rx="52" ry="30" fill="url(#lemon)"/>')
    for k in range(8):
        a = k / 8 * math.pi * 2
        s.a(f'<line x1="{lx}" y1="{ly}" x2="{f(lx + math.cos(a) * 42)}" y2="{f(ly + math.sin(a) * 24)}" stroke="#fff6c0" stroke-width="3"/>')
    finish(s)
    s.save("kitchen")


if __name__ == "__main__":
    build()
