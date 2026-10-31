"""Board 'rails': a railway line at night running away to the horizon, floodlit. Over a gap in the near
rail a crucible on its stand pours a dazzling stream of liquid iron down into a mould round the gap, sparks
fountaining out. A close-up of the reaction: aluminium takes the oxygen from rust (iron oxide), leaving iron
atoms free."""
import math
import os
import random
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from lib.style import *  # noqa: E402,F401

BLUE = "#5aa9ff"
HORIZON = 330
VX = 470  # the vanishing point
AL = ("#ffeef0", "#c8a8ac", "#6e5a5e")  # aluminium's CPK pink-grey, deepened so it shades


def track(s):
    """Sleepers and two rails in perspective, from below the frame to the vanishing point."""
    out = []
    # the ballast bed: a grey wedge
    s.d(lin("ballast", [(0, "#2a2e3a"), (1, "#3e4250")], x1=0, y1=0, x2=0, y2=1))
    out.append(f'<path d="M{VX - 8},{HORIZON} L{VX + 8},{HORIZON} L1200,800 L-300,800Z" fill="url(#ballast)"/>')

    def at(u, t):
        """A point on the track: u across (-1 left rail, 1 right rail), t from 0 (far) to 1 (near, y = 800)."""
        y = HORIZON + (800 - HORIZON) * t
        half = 6 + 420 * t
        cx = VX + 250 * t
        return cx + u * half, y

    # sleepers, closer together far away
    k = 0
    while True:
        t = (k / 26) ** 1.6
        if t > 1.02:
            break
        th = 3 + 26 * t
        a, b = at(-1.35, t), at(1.35, t)
        out.append(f'<path d="M{f(a[0])},{f(a[1])} L{f(b[0])},{f(b[1])} L{f(b[0])},{f(b[1] + th)} L{f(a[0])},{f(a[1] + th)}Z" fill="#4a3a30" opacity="0.95"/>')
        k += 1
    # the rails: a dark side and a bright top
    for u in (-1, 1):
        pts = [at(u, t / 40) for t in range(41)]
        out.append(f'<path d="{poly(pts, closed=False)}" fill="none" stroke="#5a606c" stroke-width="14"/>')
        out.append(f'<path d="{poly(pts, closed=False)}" fill="none" stroke="#c8d2e2" stroke-width="4" opacity="0.85"/>')
    s.a("".join(out))
    return at


def crucible(s, x, y, ground):
    """A cone-shaped crucible on a three-legged stand, pouring liquid iron down to the mould at `ground`."""
    s.d(lin("ref", [(0, "#8a8e98"), (0.5, "#b8bcc6"), (1, "#5a5e68")], x1=0, y1=0, x2=1, y2=0),
        lin("pour", [(0, "#fff6d0"), (0.5, "#ffd27a"), (1, "#ff9a3a")], x1=0, y1=0, x2=0, y2=1),
        rad("mould", [(0, "#ffe9a0"), (0.4, "#ff8a2a"), (1, "#8a2a0a")]))
    out = []
    # the stand's legs
    for dx in (-70, 0, 70):
        out.append(f'<line x1="{f(x + dx * 0.3)}" y1="{f(y + 40)}" x2="{f(x + dx * 1.3)}" y2="{f(ground + 20)}" stroke="#3a3e48" stroke-width="7"/>')
    # the mould round the gap: a grey sand box glowing at its seams
    out.append(glow(x, ground - 20, 70, "#ff8a2a", 0.45, "s16"))
    out.append(f'<path d="M{f(x - 62)},{f(ground - 30)} L{f(x + 62)},{f(ground - 30)} L{f(x + 70)},{f(ground + 26)} L{f(x - 70)},{f(ground + 26)}Z" '
               f'fill="#8a7a64" stroke="#4a3e30" stroke-width="3"/>')
    out.append(f'<path d="M{f(x - 62)},{f(ground - 30)} L{f(x + 62)},{f(ground - 30)}" stroke="#ff9a3a" stroke-width="3" opacity="0.8"/>')
    out.append(f'<ellipse cx="{f(x)}" cy="{f(ground - 30)}" rx="22" ry="8" fill="url(#mould)"/>')
    # the crucible: a cone, wide at the top, its lid off, flames over it
    out.append(f'<path d="M{f(x - 62)},{f(y - 70)} L{f(x + 62)},{f(y - 70)} L{f(x + 16)},{f(y + 40)} L{f(x - 16)},{f(y + 40)}Z" fill="url(#ref)" stroke="#2a2e36" stroke-width="3"/>')
    out.append(f'<rect x="{f(x - 70)}" y="{f(y - 30)}" width="140" height="10" fill="#4a4e58"/>')
    out.append(f'<ellipse cx="{f(x)}" cy="{f(y - 70)}" rx="62" ry="12" fill="#ffb84a" filter="url(#g1)"/>')
    for (dx, h) in ((-26, 70), (8, 96), (34, 60)):
        out.append(f'<path d="M{f(x + dx - 18)},{f(y - 72)} Q{f(x + dx - 4)},{f(y - 72 - h * 0.6)} {f(x + dx + 2)},{f(y - 72 - h)} '
                   f'Q{f(x + dx + 10)},{f(y - 72 - h * 0.5)} {f(x + dx + 18)},{f(y - 72)}Z" fill="#ffd27a" opacity="0.7" filter="url(#s2)"/>')
    # the stream of liquid iron, white-hot, narrow
    out.append(glow(x, (y + 40 + ground) / 2, 46, "#ffb84a", 0.6, "s16"))
    out.append(f'<path d="M{f(x - 7)},{f(y + 40)} C{f(x - 5)},{f(y + 80)} {f(x - 4)},{f(ground - 56)} {f(x - 4)},{f(ground - 32)} '
               f'L{f(x + 4)},{f(ground - 32)} C{f(x + 4)},{f(ground - 56)} {f(x + 5)},{f(y + 80)} {f(x + 7)},{f(y + 40)}Z" fill="url(#pour)"/>')
    s.a("".join(out))


def sparks(s, x, y, rnd, n=60):
    out = []
    for _ in range(n):
        a = rnd.uniform(-math.pi * 0.98, -math.pi * 0.02)
        v = rnd.uniform(60, 210)
        # a short arc falling back under gravity
        pts = []
        for i in range(5):
            t = i / 4 * rnd.uniform(0.5, 1)
            pts.append((x + math.cos(a) * v * t, y + math.sin(a) * v * t + 110 * t * t))
        out.append(f'<path d="{smooth(pts, closed=False)}" fill="none" stroke="{rnd.choice(["#ffd27a", "#ffb030", "#fff0c0"])}" '
                   f'stroke-width="{f(rnd.uniform(1.4, 2.6))}" stroke-linecap="round" opacity="{rnd.uniform(0.55, 1):.2f}"/>')
    s.a("".join(out))


def floodlight(s, x, y):
    s.d(lin("beam", [(0, "#e8f2ff", 0.3), (1, "#e8f2ff", 0)], x1=0, y1=0, x2=0, y2=1))
    s.a(f'<line x1="{x}" y1="{y}" x2="{x}" y2="{HORIZON + 140}" stroke="#2a2e3c" stroke-width="8"/>',
        f'<rect x="{x - 34}" y="{y - 14}" width="68" height="22" rx="4" fill="#3a3e4a"/>',
        f'<rect x="{x - 30}" y="{y + 2}" width="60" height="6" rx="3" fill="#f0f6ff"/>',
        f'<polygon points="{P([(x - 30, y + 6), (x + 30, y + 6), (x + 230, y + 330), (x - 120, y + 330)])}" fill="url(#beam)"/>')


def build():
    s = Svg("Fe", BLUE)
    background(s, glows=[(760, 380, 300, 0.6), (1000, 170, 240, 0.5)], seed=1899, stars=90, star_box=(0, 0, 1200, HORIZON - 10), bokeh=4)
    rnd = random.Random(1893)
    # far hills, a line of poles along the track
    s.a(f'<path d="M0,{HORIZON + 6} C200,{HORIZON - 30} 360,{HORIZON - 10} 520,{HORIZON - 4} C700,{HORIZON - 34} 900,{HORIZON - 8} 1200,{HORIZON - 24} '
        f'L1200,{HORIZON + 40} L0,{HORIZON + 40}Z" fill="#161c34"/>')
    s.a(f'<rect x="0" y="{HORIZON}" width="1200" height="{800 - HORIZON}" fill="#121630"/>')
    for k in range(6):
        t = (k / 6) ** 1.5
        x = VX - 30 - 560 * t
        y = HORIZON + (800 - HORIZON) * t
        h = 20 + 300 * t
        s.a(f'<line x1="{f(x)}" y1="{f(y)}" x2="{f(x)}" y2="{f(y - h)}" stroke="#2a3048" stroke-width="{f(2 + 7 * t)}"/>')
    floodlight(s, 1080, 150)
    at = track(s)

    # the weld on the near right rail
    gx, gy = at(1, 0.42)
    crucible(s, gx, gy - 230, gy)
    sparks(s, gx, gy - 34, rnd, n=50)

    # the reaction up close: aluminium takes rust's oxygen, iron is left
    s.d(rad("bAl", [(0, AL[0]), (0.28, AL[1]), (0.78, mix(AL[1], AL[2], 0.55)), (1, AL[2])], cx=0.36, cy=0.32, r=0.72, fx=0.32, fy=0.26))
    cx, cy, r = 1000, 175, 130
    opening, closing = magnifier(s, "zoomThermite", cx, cy, r, BLUE, src=(gx + 6, gy - 236, 26))
    s.a(opening)
    s.a(f'<rect x="{cx - r}" y="{cy - r}" width="{2 * r}" height="{2 * r}" fill="#ff8a2a" opacity="0.12"/>')
    # top: rust (Fe2O3) and two aluminium atoms coming for its oxygen
    for (x, y, el) in ((cx - 66, cy - 66, "O"), (cx - 40, cy - 46, "Fe"), (cx - 14, cy - 66, "O"), (cx + 12, cy - 46, "Fe"), (cx + 38, cy - 66, "O")):
        s.a(ball(x, y, 15, el))
    s.a(ball(cx + 80, cy - 74, 15, "Al"), ball(cx + 90, cy - 40, 15, "Al"))
    s.a(arrow([(cx, cy - 14), (cx, cy + 22)], "#e8f2ff", w=6, head=18, op=0.9))
    # below: aluminium oxide (Al2O3), and two iron atoms, glowing hot and free
    for (x, y, el) in ((cx - 92, cy + 66, "O"), (cx - 68, cy + 46, "Al"), (cx - 44, cy + 66, "O"), (cx - 20, cy + 46, "Al"), (cx + 4, cy + 66, "O")):
        s.a(ball(x, y, 15, el))
    for (x, y) in ((cx + 56, cy + 58), (cx + 92, cy + 50)):
        s.a(glow(x, y, 24, "#ffb84a", 0.6, "s4"), ball(x, y, 16, "Fe"))
    s.a(closing)
    finish(s)
    s.save("rails")


if __name__ == "__main__":
    build()
