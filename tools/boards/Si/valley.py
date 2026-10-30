"""Board 'valley': a Californian valley at dusk. Behind its hills rises a giant silicon chip like the sun,
its golden pins for rays and its circuits glowing. On the near side of the valley the orchards of the old
days, rows of round fruit trees with apricots; on the far side the chip makers' buildings, windows lit,
and a road winding between them: the Santa Clara Valley becoming Silicon Valley."""
import math
import os
import random
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from lib.style import *  # noqa: E402,F401

VIOLET = "#a48cff"


def chip(s, cx, cy, size):
    """A chip seen face-on: a dark package with golden pins on all four sides and, in its middle, the
    silicon die with its circuits, glowing."""
    s.d(rad("chipGlow", [(0, "#ffd36a", 0.6), (0.4, "#ff9a5a", 0.25), (1, "#ff7a8a", 0)]),
        lin("pkg", [(0, "#3a3450"), (1, "#1c1830")], x1=0, y1=0, x2=1, y2=1),
        lin("die", [(0, "#c89a4a"), (0.5, "#a87a3a"), (1, "#7a5a2a")], x1=0, y1=0, x2=1, y2=1))
    h = size / 2
    out = [f'<circle cx="{f(cx)}" cy="{f(cy)}" r="{f(size * 2.1)}" fill="url(#chipGlow)"/>']
    # rays between the pins
    for k in range(24):
        a = k / 24 * math.tau
        out.append(f'<line x1="{f(cx + math.cos(a) * size * 0.85)}" y1="{f(cy + math.sin(a) * size * 0.85)}" '
                   f'x2="{f(cx + math.cos(a) * size * 1.25)}" y2="{f(cy + math.sin(a) * size * 1.25)}" stroke="#ffc86a" '
                   f'stroke-width="5" stroke-linecap="round" opacity="0.45"/>')
    # the pins
    n = 7
    for i in range(n):
        o = -h + size * (i + 0.5) / n
        pw, pl = size * 0.07, size * 0.16
        for (x, y, w, hh) in ((cx + o - pw / 2, cy - h - pl, pw, pl), (cx + o - pw / 2, cy + h, pw, pl),
                              (cx - h - pl, cy + o - pw / 2, pl, pw), (cx + h, cy + o - pw / 2, pl, pw)):
            out.append(f'<rect x="{f(x)}" y="{f(y)}" width="{f(w)}" height="{f(hh)}" rx="2" fill="#e8b84a" stroke="#a8782a" stroke-width="1.5"/>')
    out.append(glow(cx, cy, size * 0.78, "#ffb84d", 0.75, "s30"))
    out.append(f'<rect x="{f(cx - h)}" y="{f(cy - h)}" width="{f(size)}" height="{f(size)}" rx="{f(size * 0.06)}" fill="url(#pkg)" '
               f'stroke="#5a5070" stroke-width="3"/>')
    d = size * 0.56
    out.append(f'<rect x="{f(cx - d / 2)}" y="{f(cy - d / 2)}" width="{f(d)}" height="{f(d)}" rx="4" fill="url(#die)"/>')
    # circuits on the die: blocks and lines
    rnd = random.Random(4004)
    for _ in range(14):
        x = cx - d / 2 + rnd.uniform(0.06, 0.7) * d
        y = cy - d / 2 + rnd.uniform(0.06, 0.7) * d
        w = rnd.uniform(0.1, 0.26) * d
        hh = rnd.uniform(0.08, 0.2) * d
        out.append(f'<rect x="{f(x)}" y="{f(y)}" width="{f(w)}" height="{f(hh)}" fill="{rnd.choice(["#e8c070", "#8a6a2a", "#d8a850"])}" opacity="0.8"/>')
    for k in range(1, 6):
        y = cy - d / 2 + d * k / 6
        out.append(f'<line x1="{f(cx - d / 2 + 6)}" y1="{f(y)}" x2="{f(cx + d / 2 - 6)}" y2="{f(y)}" stroke="#f0d08a" stroke-width="1.6" opacity="0.6"/>')
    # wires from the die to the pins
    for i in range(n):
        o = -h + size * (i + 0.5) / n
        out.append(f'<line x1="{f(cx + o * 0.5)}" y1="{f(cy - d / 2)}" x2="{f(cx + o * 0.9)}" y2="{f(cy - h + 4)}" stroke="#e8b84a" stroke-width="1.5" opacity="0.8"/>')
    s.a("".join(out))


def tree(x, y, r, rnd):
    """A round fruit tree standing on the ground at y, with apricots."""
    cy = y - r * 1.25
    out = [f'<ellipse cx="{f(x + r * 0.2)}" cy="{f(y)}" rx="{f(r * 0.9)}" ry="{f(r * 0.22)}" fill="#0a0e20" opacity="0.5"/>',
           f'<rect x="{f(x - r * 0.13)}" y="{f(cy + r * 0.5)}" width="{f(r * 0.26)}" height="{f(y - cy - r * 0.5)}" fill="#5a3a26"/>',
           f'<circle cx="{f(x)}" cy="{f(cy)}" r="{f(r)}" fill="#24603a"/>',
           f'<circle cx="{f(x - r * 0.18)}" cy="{f(cy - r * 0.16)}" r="{f(r * 0.76)}" fill="#358446"/>']
    for _ in range(5):
        a = rnd.uniform(0, math.tau)
        q = rnd.uniform(0.2, 0.75) * r
        out.append(f'<circle cx="{f(x + math.cos(a) * q)}" cy="{f(cy + math.sin(a) * q)}" r="{f(max(2.5, r * 0.14))}" fill="#ffa84a"/>')
    return "".join(out)


def building(x, base, w, h, rnd, lit=0.6):
    """A low building of the chip makers, its windows lit."""
    out = [f'<rect x="{f(x)}" y="{f(base - h)}" width="{f(w)}" height="{f(h)}" fill="#2a2648"/>',
           f'<rect x="{f(x)}" y="{f(base - h)}" width="{f(w)}" height="5" fill="#5a5088"/>']
    rows = max(1, int(h / 22))
    cols = max(1, int(w / 22))
    for j in range(rows):
        for i in range(cols):
            if rnd.random() < lit:
                out.append(f'<rect x="{f(x + 6 + i * (w - 8) / cols)}" y="{f(base - h + 12 + j * (h - 14) / rows)}" '
                           f'width="{f((w - 8) / cols - 7)}" height="{f((h - 14) / rows - 8)}" fill="#ffd27a" opacity="0.8"/>')
    return "".join(out)


def build():
    s = Svg("Si", VIOLET)
    background(s, glows=[(600, 260, 420, 0.6)], seed=1971, stars=70, star_box=(0, 0, 1200, 220), bokeh=4, tint=0.55)
    rnd = random.Random(1956)
    # the dusk: a warm band low over the hills
    s.d(lin("dusk", [(0, "#ff9a7a", 0), (0.6, "#ff9a7a", 0.35), (1, "#ffb88a", 0.5)], x1=0, y1=0, x2=0, y2=1))
    s.a('<rect x="0" y="160" width="1200" height="240" fill="url(#dusk)"/>')

    # ---------- the chip rising behind the far hills
    chip(s, 600, 250, 200)

    # ---------- the hills: far, middle, and the valley floor
    far = [(-20, 330), (160, 270), (330, 310), (470, 290), (600, 330), (760, 280), (930, 300), (1080, 260), (1220, 300)]
    s.a(f'<path d="{smooth(far, closed=False)} L1220,800 L-20,800Z" fill="#3a2e6a"/>')
    mid = [(-20, 400), (200, 360), (420, 400), (600, 420), (800, 390), (1000, 350), (1220, 380)]
    s.a(f'<path d="{smooth(mid, closed=False)} L1220,800 L-20,800Z" fill="#2c2a58"/>')
    s.d(lin("valley", [(0, "#24305a"), (1, "#141a34")], x1=0, y1=0, x2=0, y2=1))
    s.a('<path d="M-20,450 Q600,420 1220,450 L1220,800 L-20,800Z" fill="url(#valley)"/>')

    # ---------- the far side: the chip makers' buildings along the middle hills
    for (x, w, h) in ((640, 70, 40), (720, 110, 56), (840, 80, 70), (930, 130, 48), (1070, 90, 62), (560, 60, 30)):
        s.a(building(x, 420 + (x - 560) * -0.05 + 8, w, h, rnd))
    # ---------- the road winding up the valley from the near side to the chip makers
    road = [(600, 700), (640, 590), (730, 520), (860, 472), (1000, 448), (1220, 432)]
    s.a(f'<path d="{smooth(road, closed=False)}" fill="none" stroke="#3a3a5a" stroke-width="34" stroke-linecap="round"/>',
        f'<path d="{smooth(road, closed=False)}" fill="none" stroke="#ffd27a" stroke-width="3" stroke-dasharray="16 16" opacity="0.7"/>')
    for (x, y) in ((652, 572), (760, 506), (930, 459), (1110, 439)):
        s.a(glow(x, y, 9, "#ffe0a0", 0.9, "s2"), f'<circle cx="{x}" cy="{y}" r="3.5" fill="#fff4d0"/>')
    # ---------- the near right: bigger buildings of the chip makers, lit late
    for (x, w, h, base) in ((780, 120, 70, 560), (920, 150, 92, 575), (1090, 120, 76, 560), (700, 70, 40, 610)):
        s.a(building(x, base, w, h, rnd, 0.75))

    # ---------- the near left: the old orchards, rows of trees
    for j, (y, r, x0, n, step) in enumerate(((478, 13, 30, 13, 40), (526, 17, 14, 11, 48), (590, 22, 0, 9, 60))):
        for i in range(n):
            x = x0 + i * step + (j % 2) * step / 2
            if x > 540 - j * 20:
                continue
            s.a(tree(x, y, r, rnd))
    finish(s)
    s.save("valley")


if __name__ == "__main__":
    build()
