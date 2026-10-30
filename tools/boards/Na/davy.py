"""Board 'davy': Humphry Davy's experiment of 1807 on a lab bench by candlelight. A tall voltaic pile
(copper, zinc and damp cloth) sends its current through a lump of caustic soda on a platinum disc; the
positive wire fizzes on top, and at the negative side, round the foot of the lump, shiny beads of a new
metal appear, some bursting into flame. A close-up of one bead: sodium atoms packed in a metal."""
import math
import os
import random
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from lib.style import *  # noqa: E402,F401

VIOLET = "#b388ff"
BENCH = 540


def pile(s, cx, base, w=128):
    """The voltaic pile: discs of copper, zinc and damp cloth, stacked between glass rods."""
    out = []
    layers = []
    for i in range(13):
        layers += [("cu", 10), ("zn", 10), ("cloth", 6)]
    cols = {"cu": ("#b8582c", "#f2a06a"), "zn": ("#7d8a9e", "#d2dae6"), "cloth": ("#4a2e22", "#7a5442")}
    ry = 13
    y = base
    rods = []
    for side in (-1, 1):
        rods.append(f'<rect x="{f(cx + side * (w / 2 + 14) - 5)}" y="{f(base - 380)}" width="10" height="380" rx="5" '
                    f'fill="#cfe6ff" opacity="0.35"/>'
                    f'<rect x="{f(cx + side * (w / 2 + 14) - 2)}" y="{f(base - 376)}" width="3" height="372" rx="1.5" fill="#ffffff" opacity="0.6"/>')
    out.append(rods[0])
    for kind, h in layers:
        side, top = cols[kind]
        out.append(f'<ellipse cx="{f(cx)}" cy="{f(y)}" rx="{f(w / 2)}" ry="{ry}" fill="{side}"/>'
                   f'<rect x="{f(cx - w / 2)}" y="{f(y - h)}" width="{f(w)}" height="{f(h)}" fill="{side}"/>'
                   f'<ellipse cx="{f(cx)}" cy="{f(y - h)}" rx="{f(w / 2)}" ry="{ry}" fill="{top}"/>')
        y -= h
    # light down the left of the stack, shade down the right
    s.d(lin("pileShade", [(0, "#ffffff", 0.28), (0.25, "#ffffff", 0.05), (0.7, "#000000", 0.0), (1, "#000000", 0.45)],
            x1=0, y1=0, x2=1, y2=0))
    out.append(f'<rect x="{f(cx - w / 2)}" y="{f(y)}" width="{f(w)}" height="{f(base - y)}" fill="url(#pileShade)"/>')
    out.append(rods[1])
    # the top plate and the base
    out.append(f'<ellipse cx="{f(cx)}" cy="{f(y - 2)}" rx="{f(w / 2 + 26)}" ry="16" fill="#6b4630"/>'
               f'<ellipse cx="{f(cx)}" cy="{f(y - 6)}" rx="{f(w / 2 + 26)}" ry="16" fill="#8a5c3c"/>')
    out.append(f'<path d="M{f(cx - w / 2 - 40)},{f(base)} L{f(cx + w / 2 + 40)},{f(base)} L{f(cx + w / 2 + 40)},{f(base + 26)} '
               f'L{f(cx - w / 2 - 40)},{f(base + 26)}Z" fill="#6b4630"/>'
               f'<ellipse cx="{f(cx)}" cy="{f(base)}" rx="{f(w / 2 + 40)}" ry="16" fill="#8a5c3c"/>')
    s.a("".join(out))
    return y - 6


def build():
    s = Svg("Na", VIOLET)
    background(s, glows=[(270, 300, 380, 0.7), (760, 420, 340, 0.75)], seed=1807, stars=30,
               star_box=(0, 0, 1200, 260), bokeh=5)
    rnd = random.Random(1807)
    s.d(lin("bench", [(0, "#8a5a36"), (0.12, "#6b4428"), (1, "#2e1c12")], x1=0, y1=0, x2=0, y2=1),
        rad("candle", [(0, "#fff2c0", 0.8), (0.3, "#ffb84d", 0.3), (1, "#ff8a2a", 0)]),
        rad("plat", [(0, "#ffffff"), (0.5, "#d8dee8"), (1, "#8a94a6")], cx=0.4, cy=0.3, r=0.8),
        rad("soda", [(0, "#ffffff"), (0.55, "#eef0f2"), (1, "#b8bcc8")], cx=0.38, cy=0.3, r=0.75),
        rad("bead", [(0, "#ffffff"), (0.25, "#f2f5fa"), (0.6, "#a9b3c4"), (0.85, "#5a6478"), (1, "#c8d0dc")], cx=0.38, cy=0.34, r=0.7),
        rad("flame", [(0, "#ffffff"), (0.3, "#fff2a0"), (0.7, "#ffb21e"), (1, "#ff7a1a", 0)], cx=0.5, cy=0.7, r=0.6),
        rad("metal", [(0, "#efe6ff"), (1, "#3a2a6a")], cx=0.4, cy=0.35, r=0.8))

    # ---------- the back wall: a shelf with bottles and a candle
    s.a('<rect x="0" y="200" width="1200" height="14" fill="#3a2a40" opacity="0.8"/>')
    for (x, w, h, col) in ((470, 34, 70, "#6aa0c8"), (520, 26, 50, "#8ac87a"), (560, 40, 84, "#c88a5a"),
                           (1070, 30, 60, "#9a7ac8"), (1110, 40, 78, "#6aa0c8")):
        s.a(f'<rect x="{x}" y="{200 - h}" width="{w}" height="{h}" rx="7" fill="{col}" opacity="0.32"/>',
            f'<rect x="{x + w * 0.3}" y="{200 - h - 14}" width="{w * 0.4}" height="16" rx="3" fill="{col}" opacity="0.32"/>',
            f'<rect x="{x + 5}" y="{200 - h + 8}" width="4" height="{h - 16}" rx="2" fill="#ffffff" opacity="0.2"/>')
    cx0 = 655
    s.a(f'<circle cx="{cx0}" cy="130" r="120" fill="url(#candle)"/>',
        f'<rect x="{cx0 - 12}" y="140" width="24" height="60" rx="4" fill="#f4ead2"/>',
        f'<path d="M{cx0},{102} C{cx0 + 10},{118} {cx0 + 8},{134} {cx0},{140} C{cx0 - 8},{134} {cx0 - 10},{118} {cx0},{102}Z" '
        f'fill="url(#flame)" filter="url(#g1)"/>')

    # ---------- the bench
    s.a(f'<rect x="0" y="{BENCH}" width="1200" height="{800 - BENCH}" fill="url(#bench)"/>',
        f'<rect x="0" y="{BENCH}" width="1200" height="5" fill="#c08a5a" opacity="0.7"/>')
    for k in range(5):
        x = 150 + k * 240 + rnd.uniform(-30, 30)
        s.a(f'<path d="M{f(x)},{BENCH + 12} q40,6 90,2" fill="none" stroke="#4a2c18" stroke-width="2" opacity="0.6"/>')

    # ---------- the pile
    top = pile(s, 230, BENCH - 6)

    # ---------- the platinum disc and the lump of caustic soda on it
    dx, dy = 790, BENCH - 22
    s.a(f'<ellipse cx="{dx + 10}" cy="{dy + 18}" rx="190" ry="26" fill="#000" opacity="0.35" filter="url(#s4)"/>',
        f'<ellipse cx="{dx}" cy="{dy + 8}" rx="180" ry="30" fill="#7a8496"/>',
        f'<ellipse cx="{dx}" cy="{dy}" rx="180" ry="30" fill="url(#plat)"/>')
    lump = [(dx - 124, dy + 4), (dx - 118, dy - 52), (dx - 84, dy - 96), (dx - 30, dy - 122), (dx + 34, dy - 126), (dx + 92, dy - 94),
            (dx + 122, dy - 40), (dx + 120, dy + 6), (dx, dy + 14)]
    s.a(f'<polygon points="{P(lump)}" fill="#e4e7ee" stroke="#9aa0b0" stroke-width="2" stroke-linejoin="round"/>')
    # facets: a light top, a shaded right flank, a cool left
    s.a(f'<polygon points="{P([(dx - 84, dy - 96), (dx - 30, dy - 122), (dx + 34, dy - 126), (dx + 20, dy - 76), (dx - 46, dy - 62)])}" fill="#ffffff"/>',
        f'<polygon points="{P([(dx + 34, dy - 126), (dx + 92, dy - 94), (dx + 122, dy - 40), (dx + 120, dy + 6), (dx + 52, dy + 12), (dx + 20, dy - 76)])}" '
        f'fill="#c3c8d4"/>',
        f'<polygon points="{P([(dx - 124, dy + 4), (dx - 118, dy - 52), (dx - 84, dy - 96), (dx - 46, dy - 62), (dx - 60, dy + 12)])}" fill="#d6dbe6"/>',
        f'<polygon points="{P([(dx + 52, dy + 12), (dx + 120, dy + 6), (dx + 122, dy - 40)])}" fill="#aab0be"/>')
    # melting where the current runs: a glossy wet patch on top
    s.a(f'<ellipse cx="{dx + 12}" cy="{dy - 118}" rx="30" ry="9" fill="#dff2ff" opacity="0.9"/>')

    # ---------- the wires: the pile's top (+) to the top of the lump, its foot (-) to the disc
    wire_top = [(230, top - 4), (262, top - 70), (380, 66), (640, 56), (800, 92), (dx + 12, dy - 170), (dx + 12, dy - 116)]
    wire_low = [(300, BENCH + 2), (450, BENCH + 30), (620, BENCH + 26), (dx - 168, dy + 14)]
    for path in (wire_top, wire_low):
        d = smooth(path, closed=False)
        s.a(f'<path d="{d}" fill="none" stroke="#7a3a14" stroke-width="9" stroke-linecap="round"/>',
            f'<path d="{d}" fill="none" stroke="#e8955a" stroke-width="4" stroke-linecap="round"/>')
    # the current: bright sparks along the wires
    for path, n in ((wire_top, 9), (wire_low, 5)):
        for i in range(n):
            seg = min(len(path) - 2, int(i / n * (len(path) - 1)))
            t = (i / n * (len(path) - 1)) - seg
            p0, p1 = path[seg], path[seg + 1]
            x, y = p0[0] + (p1[0] - p0[0]) * t, p0[1] + (p1[1] - p0[1]) * t
            s.a(glow(x, y, 9, "#d9c2ff", 0.9, "s4"), f'<circle cx="{f(x)}" cy="{f(y)}" r="4" fill="#ffffff"/>')
    # fizzing at the positive wire on top
    for k in range(9):
        a = rnd.uniform(-2.6, -0.5)
        r = rnd.uniform(14, 46)
        bx, by = dx + 12 + math.cos(a) * r, dy - 118 + math.sin(a) * r * 0.8
        s.a(f'<circle cx="{f(bx)}" cy="{f(by)}" r="{f(rnd.uniform(3, 6.5))}" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.85"/>')

    # ---------- the beads of sodium round the foot of the lump, some bursting into flame
    beads = [(dx - 136, dy - 2, 14), (dx - 92, dy + 10, 19), (dx - 40, dy + 16, 12), (dx + 34, dy + 14, 17), (dx + 92, dy + 10, 13),
             (dx + 142, dy - 2, 18), (dx - 160, dy + 6, 9)]
    for (x, y, r) in beads:
        s.a(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r)}" fill="url(#bead)" stroke="#5a6478" stroke-width="1.2"/>',
            f'<circle cx="{f(x - r * 0.35)}" cy="{f(y - r * 0.38)}" r="{f(r * 0.24)}" fill="#ffffff"/>')
    for (x, y, h) in ((dx - 92, dy - 4, 74), (dx + 140, dy - 14, 60), (dx + 34, dy - 2, 46)):
        s.a(f'<ellipse cx="{x}" cy="{y - h * 0.4}" rx="{h * 0.5}" ry="{h * 0.6}" fill="#ffb21e" opacity="0.35" filter="url(#s8)"/>',
            f'<path d="M{x - h * 0.24},{y} C{x - h * 0.34},{y - h * 0.4} {x - h * 0.08},{y - h * 0.62} {x},{y - h} '
            f'C{x + h * 0.1},{y - h * 0.6} {x + h * 0.34},{y - h * 0.42} {x + h * 0.24},{y}Z" fill="url(#flame)"/>')
        for k in range(4):
            a = math.radians(-90 + rnd.uniform(-70, 70))
            rr = h * rnd.uniform(0.7, 1.1)
            s.a(f'<circle cx="{f(x + math.cos(a) * rr)}" cy="{f(y - h * 0.3 + math.sin(a) * rr * 0.7)}" r="2.6" fill="#fff2a0"/>')

    # ---------- a close-up of one bead: a metal made of sodium atoms
    bx, by, br = beads[3][0], beads[3][1], beads[3][2]
    cx, cy, r = 1010, 300, 128
    opening, closing = magnifier(s, "zoomBead", cx, cy, r, VIOLET, src=(bx, by, br + 10))
    s.a(opening)
    s.a(f'<rect x="{cx - r}" y="{cy - r}" width="{2 * r}" height="{2 * r}" fill="url(#metal)" opacity="0.5"/>')
    rows = []
    for j in range(-4, 5):
        for i in range(-4, 5):
            x = cx + i * 44 + (j % 2) * 22
            y = cy + j * 38
            rows.append((y, x))
    for (y, x) in sorted(rows):
        s.a(ball(x, y, 22, "Na"))
    # a sheen of metal over the atoms
    s.a(f'<path d="M{cx - r},{cy - 30} L{cx + r},{cy - 110} L{cx + r},{cy - 70} L{cx - r},{cy + 10}Z" fill="#ffffff" opacity="0.18"/>')
    s.a(closing)
    finish(s)
    s.save("davy")


if __name__ == "__main__":
    build()
