"""Board 'deep': a mountain cut open like a cake under a starry sky. Particles from space rain down as thin
streaks and stop in the rock, each with a small spark. Deep under the peak, in a vaulted hall reached by a road
tunnel, stands a tall tank glowing faintly blue with liquid argon, and in it hang strings of germanium crystals,
grey cylinders stacked one under another. A close-up beside the mountain: a germanium-76 nucleus breaking,
two electrons flying out of it at once."""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gekit import *  # noqa: E402,F401

COLOR = "#8a8cff"
ARGON = "#5ab0ff"


def mountain(s):
    s.d(lin("rock", [(0, "#4e4258"), (0.4, "#33293e"), (1, "#18131f")], x1=0, y1=0, x2=0, y2=1),
        lin("snowM", [(0, "#a8b0d8"), (1, "#7a82b0")], x1=0, y1=0, x2=0, y2=1))
    ridge = [(-20, 430), (120, 360), (250, 250), (360, 170), (470, 92), (540, 120), (610, 150), (700, 210), (820, 290),
             (940, 360), (1060, 400), (1220, 420)]
    s.a(f'<path d="{smooth(ridge, closed=False)} L1220,800 L-20,800Z" fill="url(#rock)"/>',
        f'<path d="{smooth(ridge, closed=False)}" fill="none" stroke="#8a7aa0" stroke-width="3" opacity="0.6"/>')
    # the snow cap (mid-toned: white blooms on the wall)
    cap = [(360, 170), (470, 92), (540, 120), (610, 150), (640, 172), (600, 182), (560, 166), (520, 190), (470, 170), (420, 196), (380, 186)]
    s.a(f'<path d="{smooth(cap)}" fill="url(#snowM)"/>')
    # strata: faint bands following the slope
    rnd = rng(1400)
    for k in range(7):
        y = 260 + k * 52
        pts = [(x, y + 18 * math.sin(x / 140 + k) + rnd.uniform(-4, 4)) for x in range(-20, 1240, 80)]
        s.a(f'<path d="{smooth(pts, closed=False)}" fill="none" stroke="#5a4a68" stroke-width="3" opacity="0.4"/>')
    return ridge


def ridge_y(ridge, x):
    for (x0, y0), (x1, y1) in zip(ridge, ridge[1:]):
        if x0 <= x <= x1:
            return y0 + (y1 - y0) * (x - x0) / (x1 - x0)
    return ridge[-1][1]


def hall(s):
    """The vaulted hall under the peak, the road tunnel, the tank and its strings of crystals."""
    s.d(lin("hallW", [(0, "#262a42"), (1, "#14162a")], x1=0, y1=0, x2=0, y2=1),
        lin("tankG", [(0, ARGON, 0.18), (0.5, ARGON, 0.42), (1, ARGON, 0.18)], x1=0, y1=0, x2=1, y2=0),
        lin("tankS", [(0, "#5a6078"), (0.5, "#9aa2b8"), (1, "#4a5068")], x1=0, y1=0, x2=1, y2=0))
    # the road tunnel from the left, to the hall
    s.a('<path d="M-20,560 L360,560 L360,520 L-20,520Z" fill="#14162a"/>',
        '<path d="M-20,522 L360,522" stroke="#2a2e48" stroke-width="3"/>')
    for x in range(10, 360, 46):
        s.a(f'<circle cx="{x}" cy="528" r="3" fill="#ffd27a" opacity="0.8"/>')
    s.a('<path d="M330,580 L330,460 Q330,380 470,370 L650,370 Q790,380 790,460 L790,580Z" fill="url(#hallW)" stroke="#7a7ea8" stroke-width="5"/>',
        '<rect x="330" y="560" width="460" height="20" fill="#1a1c2c"/>')
    for x in range(360, 790, 60):
        s.a(f'<line x1="{x}" y1="560" x2="{x}" y2="410" stroke="#4a4e6a" stroke-width="2" opacity="0.4"/>')
    # lamps in the vault
    for x in (420, 560, 700):
        s.a(f'<circle cx="{x}" cy="396" r="5" fill="#ffe8b0"/>', glow(x, 400, 30, "#ffe8b0", 0.25, "s8"))
    # the tank: a steel cylinder with a window cut in its front, liquid argon glowing inside
    tx, top, bot, w = 560, 418, 560, 150
    s.a(f'<rect x="{tx - w / 2}" y="{top}" width="{w}" height="{bot - top}" rx="12" fill="url(#tankS)"/>',
        f'<ellipse cx="{tx}" cy="{top}" rx="{w / 2}" ry="14" fill="#b8c0d4"/>',
        f'<rect x="{tx - w / 2 + 16}" y="{top + 22}" width="{w - 32}" height="{bot - top - 36}" rx="8" fill="#0c1430"/>',
        f'<rect x="{tx - w / 2 + 16}" y="{top + 22}" width="{w - 32}" height="{bot - top - 36}" rx="8" fill="url(#tankG)"/>',
        glow(tx, (top + bot) / 2 + 10, 60, ARGON, 0.35, "s16"))
    # strings of germanium crystals
    for k, x in enumerate(range(tx - 44, tx + 45, 22)):
        s.a(f'<line x1="{x}" y1="{top + 22}" x2="{x}" y2="{bot - 20}" stroke="#c8d0e0" stroke-width="1.5" opacity="0.7"/>')
        for j in range(4):
            y = top + 36 + j * 24 + (k % 2) * 6
            s.a(f'<rect x="{x - 8}" y="{y}" width="16" height="17" rx="3" fill="url(#geCut)" stroke="#1a2030" stroke-width="1"/>',
                f'<rect x="{x - 6}" y="{y + 2}" width="4" height="13" fill="#d8e4f0" opacity="0.35"/>')
    # a little control desk
    s.a('<rect x="680" y="530" width="80" height="30" rx="4" fill="#2a2e44"/>',
        '<rect x="688" y="514" width="64" height="22" rx="3" fill="#1a2a4a" stroke="#4a5a8a" stroke-width="2"/>',
        f'<polyline points="{P([(692, 530), (704, 526), (712, 529), (720, 518), (728, 528), (748, 527)])}" fill="none" stroke="{ARGON}" stroke-width="2"/>')


def build():
    s = Svg("Ge", COLOR)
    gdefs(s)
    background(s, glows=[(560, 470, 260, 0.45), (1000, 200, 260, 0.4)], seed=76, stars=90, star_box=(0, 0, 1200, 300), bokeh=4, tint=0.6)
    ridge = mountain(s)
    # particles raining from space, stopped in the rock
    rnd = rng(2020)
    for k in range(14):
        x = rnd.uniform(140, 780)
        ang = math.radians(rnd.uniform(-14, 14))
        y_top = ridge_y(ridge, x)
        stop = y_top + rnd.uniform(20, 100)
        x0, y0 = x - math.tan(ang) * (stop - 10), 10
        s.a(f'<line x1="{f(x0)}" y1="{f(y0)}" x2="{f(x)}" y2="{f(stop)}" stroke="#d8dcff" stroke-width="2.4" opacity="0.55" '
            'stroke-linecap="round"/>',
            star_burst(x, stop, 9, 3, 4, "#ffe8a0", 0.85, rnd.uniform(0, 45)))
    hall(s)
    # the close-up: germanium-76 breaking, two electrons out at once
    o, c = magnifier(s, "nuc", 990, 200, 132, COLOR, src=(560, 470, 54))
    s.a(o)
    rnd = rng(76)
    nuc = []
    for i in range(30):
        a = i * 2.39996
        r = 9 * math.sqrt(i)
        nuc.append((990 + r * math.cos(a), 214 + r * math.sin(a), "p" if i % 7 in (0, 2, 5) else "n"))
    s.d(rad("gP", [(0, "#ffd0c8"), (0.3, "#ff5a4a"), (1, "#8a1a1a")], cx=0.36, cy=0.32, r=0.72, fx=0.32, fy=0.26),
        rad("gN", [(0, "#e8ecf4"), (0.3, "#a8b0c4"), (1, "#4a5060")], cx=0.36, cy=0.32, r=0.72, fx=0.32, fy=0.26))
    for (x, y, kind) in sorted(nuc, key=lambda p: p[1]):
        s.a(gball(x, y, 14, gid="gP" if kind == "p" else "gN"))
    s.a(glow(990, 214, 70, "#ffe8a0", 0.25, "s16"))
    for (ex, ey, ang) in ((1062, 138, -40), (1058, 292, 40)):
        a = math.radians(ang)
        for k in range(3):
            s.a(f'<line x1="{f(ex - math.cos(a) * (20 + k * 14))}" y1="{f(ey - math.sin(a) * (20 + k * 14))}" '
                f'x2="{f(ex - math.cos(a) * (40 + k * 14))}" y2="{f(ey - math.sin(a) * (40 + k * 14))}" stroke="#9ac8ff" '
                f'stroke-width="{4 - k}" stroke-linecap="round" opacity="{0.8 - k * 0.2:.2f}"/>')
        s.a(glow(ex, ey, 20, "#58a8ff", 0.6, "s4"), gball(ex, ey, 12, "e"))
    s.a(c)
    finish(s)
    s.save("deep")


if __name__ == "__main__":
    build()
