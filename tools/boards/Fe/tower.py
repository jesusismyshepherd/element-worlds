"""Board 'tower': the Eiffel Tower on a warm evening, its iron lattice lit gold, Paris's roofs at its feet.
The low sun on the left warms its sunny side; a dashed ghost of the top leans away from the sun (much
exaggerated) and a small loop at the tip shows the path it traces over a day. A close-up of a joint: a
red-hot rivet hammered through two iron plates, arrows showing it shrink as it cools and clamp them."""
import math
import os
import random
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from lib.style import *  # noqa: E402,F401

GOLD = "#ffc83d"
BASE = 590
TOP = 70
CX = 600
# the tower's half-width against its height in metres (base 125 m square, 1st floor 57 m, 2nd 115 m,
# top platform 276 m, 300 m to the roof of the top)
PROFILE = [(0, 62.5), (20, 50), (57, 34), (90, 24), (115, 19), (160, 12), (210, 8), (276, 5), (300, 3)]
SCALE = (BASE - TOP) / 312  # pixels per metre, the antenna included


def half(h):
    for (h0, w0), (h1, w1) in zip(PROFILE, PROFILE[1:]):
        if h0 <= h <= h1:
            t = (h - h0) / (h1 - h0)
            return w0 + (w1 - w0) * t
    return PROFILE[-1][1]


def Y(h):
    return BASE - h * SCALE


def outline(dx=0.0, lean=0.0, h0=0, h1=300):
    """The tower's outline from h0 to h1 metres; lean bends it sideways, growing with the square of the
    height above h0 (a ghost of the top bent away from the sun)."""
    left, right = [], []
    for k in range(41):
        h = h0 + (h1 - h0) * k / 40
        off = dx + lean * ((h - h0) / (h1 - h0)) ** 2
        w = half(h) * SCALE
        left.append((CX - w + off, Y(h)))
        right.append((CX + w + off, Y(h)))
    return left, right


def tower(s):
    s.d(lin("iron", [(0, "#6a3a1e"), (0.5, "#8a5228"), (1, "#5a3018")], x1=0, y1=0, x2=1, y2=0))
    left, right = outline()
    body = left + list(reversed(right))
    s.d(f'<clipPath id="towerClip"><path d="{poly(body)}"/></clipPath>')
    out = [glow(CX, Y(120), 220, GOLD, 0.35, "s30"), f'<path d="{poly(body)}" fill="url(#iron)" opacity="0.92"/>']
    # the lattice: crossing diagonals in gold, finer higher up
    lat = []
    h = 0
    while h < 300:
        step = 14 if h < 115 else (10 if h < 200 else 8)
        y0, y1 = Y(h), Y(h + step)
        for side in (-1, 1):
            for frac in (0.15, 0.55, 0.95):
                xa = CX + side * half(h) * SCALE * frac
                xb = CX + side * half(h + step) * SCALE * (frac - 0.12)
                lat.append(f'<line x1="{f(xa)}" y1="{f(y0)}" x2="{f(xb)}" y2="{f(y1)}" stroke="{GOLD}" stroke-width="1.6" opacity="0.7"/>')
                xa2 = CX + side * half(h) * SCALE * (frac - 0.12)
                xb2 = CX + side * half(h + step) * SCALE * frac
                lat.append(f'<line x1="{f(xa2)}" y1="{f(y0)}" x2="{f(xb2)}" y2="{f(y1)}" stroke="{GOLD}" stroke-width="1.6" opacity="0.7"/>')
        lat.append(f'<line x1="{f(CX - half(h) * SCALE)}" y1="{f(y0)}" x2="{f(CX + half(h) * SCALE)}" y2="{f(y0)}" stroke="{GOLD}" stroke-width="1.2" opacity="0.5"/>')
        h += step
    out.append('<g clip-path="url(#towerClip)">' + "".join(lat) + "</g>")
    # the edges, bright
    out.append(f'<path d="{poly(left, closed=False)}" fill="none" stroke="#ffe08a" stroke-width="4" filter="url(#g1)"/>'
               f'<path d="{poly(right, closed=False)}" fill="none" stroke="#ffe08a" stroke-width="4" filter="url(#g1)"/>')
    # the great arch between the legs, under the first floor: dark sky shows through it
    aw, ah = half(0) * SCALE - 34, Y(0) - Y(50)
    out.append(f'<path d="M{f(CX - aw)},{f(BASE)} C{f(CX - aw)},{f(BASE - ah * 1.2)} {f(CX + aw)},{f(BASE - ah * 1.2)} {f(CX + aw)},{f(BASE)}Z" '
               f'fill="#241a2c"/>')
    out.append(f'<path d="M{f(CX - aw)},{f(BASE)} C{f(CX - aw)},{f(BASE - ah * 1.2)} {f(CX + aw)},{f(BASE - ah * 1.2)} {f(CX + aw)},{f(BASE)}" '
               f'fill="none" stroke="#ffe08a" stroke-width="3.5"/>')
    # between the legs up to the second floor, the sky shows through too (a narrow gap)
    gap = [(CX - half(57) * SCALE + 30, Y(60)), (CX - 6, Y(112)), (CX + 6, Y(112)), (CX + half(57) * SCALE - 30, Y(60))]
    out.append(f'<path d="{poly(gap)}" fill="#241a2c" opacity="0.85"/>')
    # the floors: the first wide with its gallery, the second, the top
    for (hf, th) in ((57, 12), (115, 9), (276, 7)):
        w = half(hf) * SCALE + 6
        out.append(f'<rect x="{f(CX - w)}" y="{f(Y(hf) - th / 2)}" width="{f(2 * w)}" height="{f(th)}" fill="#ffd25a" opacity="0.9"/>')
        out.append(f'<rect x="{f(CX - w)}" y="{f(Y(hf) - th / 2)}" width="{f(2 * w)}" height="{f(th)}" fill="none" stroke="#7a4a1e" stroke-width="1.5"/>')
    # the antenna and the beacon at the top
    out.append(f'<line x1="{CX}" y1="{f(Y(300))}" x2="{CX}" y2="{f(Y(330) - 6)}" stroke="#c8a060" stroke-width="4"/>')
    out.append(glow(CX, Y(300), 22, "#fff0b0", 0.8, "s4"))
    s.a("".join(out))


def sun(s, x, y):
    s.d(rad("sunG", [(0, "#fff4c8"), (0.5, "#ffc860"), (1, "#ff9a3a")]))
    out = [glow(x, y, 120, "#ffb84a", 0.55, "s30")]
    for k in range(12):
        a = k / 12 * math.tau
        out.append(f'<line x1="{f(x + math.cos(a) * 62)}" y1="{f(y + math.sin(a) * 62)}" x2="{f(x + math.cos(a) * 88)}" y2="{f(y + math.sin(a) * 88)}" '
                   f'stroke="#ffd27a" stroke-width="6" stroke-linecap="round" opacity="0.8"/>')
    out.append(f'<circle cx="{x}" cy="{y}" r="50" fill="url(#sunG)"/>')
    s.a("".join(out))


def roofs(s, rnd):
    out = []
    # the Champ de Mars in front of the tower: dark lawns and rows of trees, no houses
    out.append(f'<rect x="400" y="{BASE - 4}" width="400" height="40" fill="#1a2a24"/>')
    for k in range(9):
        for x0 in (410 + k * 18, 790 - k * 18):
            out.append(f'<circle cx="{f(x0)}" cy="{f(BASE - 2 - k * 1.5)}" r="13" fill="#1e3328"/>')
    x = -10
    while x < 1220:
        w = rnd.uniform(70, 130)
        h = rnd.uniform(40, 90)
        base = BASE + 6
        if x + w > 420 and x < 780:
            x = 780 + rnd.uniform(0, 10)
            continue
        out.append(f'<rect x="{f(x)}" y="{f(base - h)}" width="{f(w)}" height="{f(h + 30)}" fill="#1e1830"/>')
        # a mansard roof, slate grey, with dormers
        out.append(f'<path d="M{f(x - 4)},{f(base - h)} L{f(x + 10)},{f(base - h - 26)} L{f(x + w - 10)},{f(base - h - 26)} L{f(x + w + 4)},{f(base - h)}Z" fill="#2c2840"/>')
        for i in range(int(w // 34)):
            if rnd.random() < 0.6:
                out.append(f'<rect x="{f(x + 10 + i * 34)}" y="{f(base - h + 14)}" width="12" height="18" fill="#ffcf7a" opacity="0.7"/>')
        x += w + rnd.uniform(-6, 6)
    s.a("".join(out))


def build():
    s = Svg("Fe", GOLD)
    background(s, glows=[(170, 170, 320, 0.8), (600, 300, 320, 0.5)], seed=1889, stars=40, star_box=(0, 0, 1200, 360), bokeh=4, tint=0.45)
    rnd = random.Random(1887)
    s.d(lin("eve", [(0, "#ff9a5a", 0), (1, "#ff8a4a", 0.35)], x1=0, y1=0, x2=0, y2=1))
    s.a(f'<rect x="0" y="250" width="1200" height="{BASE - 250}" fill="url(#eve)"/>')
    sun(s, 150, 190)
    # warm rays striking the tower's sunny side
    for k in range(3):
        y0 = 230 + k * 70
        s.a(arrow([(230, y0 - 30 + k * 10), (CX - half((BASE - y0) / SCALE) * SCALE - 34, y0 + 26)], "#ffb84a", w=6, head=20, op=0.75, dash="14 10"))

    tower(s)
    # the ghost of the upper tower bent away from the sun, and the loop its tip traces over a day
    left, right = outline(lean=46, h0=115, h1=300)
    s.a(f'<path d="{poly(left, closed=False)}" fill="none" stroke="#fff0c0" stroke-width="3" stroke-dasharray="9 8" opacity="0.65"/>',
        f'<path d="{poly(right, closed=False)}" fill="none" stroke="#fff0c0" stroke-width="3" stroke-dasharray="9 8" opacity="0.65"/>')
    tx, ty = CX + 46, Y(300)
    s.a(f'<ellipse cx="{f(CX + 24)}" cy="{f(ty)}" rx="34" ry="12" fill="none" stroke="#fff0c0" stroke-width="3" opacity="0.8"/>',
        arrow([(CX + 4, ty - 26), (CX + 40, ty - 34), (tx + 26, ty - 22)], "#fff0c0", w=4, head=14, op=0.85))
    roofs(s, rnd)

    # the close-up of a joint: a hot rivet through two plates, hammered, shrinking as it cools
    src = (CX + half(30) * SCALE - 14, Y(30), 22)
    cx, cy, r = 1000, 380, 125
    opening, closing = magnifier(s, "zoomRivet", cx, cy, r, GOLD, src=src)
    s.a(opening)
    s.d(lin("plate", [(0, "#6a7280"), (1, "#3a404c")], x1=0, y1=0, x2=0, y2=1),
        rad("hot", [(0, "#fff0b0"), (0.4, "#ffa030"), (1, "#d8401a")], cx=0.45, cy=0.4, r=0.7))
    s.a(f'<rect x="{cx - r}" y="{cy - 40}" width="{2 * r}" height="38" fill="url(#plate)" stroke="#20242c" stroke-width="2"/>',
        f'<rect x="{cx - r}" y="{cy}" width="{2 * r}" height="38" fill="url(#plate)" stroke="#20242c" stroke-width="2"/>')
    s.a(glow(cx, cy, 70, "#ff8a2a", 0.5, "s16"),
        f'<rect x="{cx - 16}" y="{cy - 46}" width="32" height="90" fill="url(#hot)"/>',
        f'<path d="M{cx - 40},{cy - 40} A40,30 0 0 1 {cx + 40},{cy - 40}Z" fill="url(#hot)" stroke="#a83010" stroke-width="2"/>',
        f'<path d="M{cx - 40},{cy + 38} A40,30 0 0 0 {cx + 40},{cy + 38}Z" fill="url(#hot)" stroke="#a83010" stroke-width="2"/>')
    # the arrows: the rivet's heads pull together as it cools
    s.a(arrow([(cx - 80, cy - 95), (cx - 80, cy - 48)], "#ffe9b0", w=6, head=18, op=0.9),
        arrow([(cx - 80, cy + 95), (cx - 80, cy + 48)], "#ffe9b0", w=6, head=18, op=0.9),
        arrow([(cx + 80, cy - 95), (cx + 80, cy - 48)], "#ffe9b0", w=6, head=18, op=0.9),
        arrow([(cx + 80, cy + 95), (cx + 80, cy + 48)], "#ffe9b0", w=6, head=18, op=0.9))
    s.a(closing)
    finish(s)
    s.save("tower")


if __name__ == "__main__":
    build()
