"""Board 'solar': the sun shines on a big solar panel of dark blue silicon cells; the electricity it makes
runs down a wire and lights a bulb. A close-up of the silicon: sunlight (a wavy golden ray) knocks an
electron out of its place among the silicon atoms. High in the corner, Vanguard 1, the little ball with
six antennas that ran on silicon solar cells in 1958 and is still in orbit."""
import math
import os
import random
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from lib.style import *  # noqa: E402,F401

GOLD = "#ffc23d"
FLOOR = 560


def bil(c, u, v):
    """A point inside the quadrilateral c (TL, TR, BR, BL) at (u, v) in 0..1."""
    (x0, y0), (x1, y1), (x2, y2), (x3, y3) = c
    top = (x0 + (x1 - x0) * u, y0 + (y1 - y0) * u)
    bot = (x3 + (x2 - x3) * u, y3 + (y2 - y3) * u)
    return (top[0] + (bot[0] - top[0]) * v, top[1] + (bot[1] - top[1]) * v)


def wave(x0, y0, x1, y1, amp=9, waves=5):
    """A wavy ray of light from (x0, y0) to (x1, y1)."""
    n = 60
    a = math.atan2(y1 - y0, x1 - x0)
    nx, ny = -math.sin(a), math.cos(a)
    pts = []
    for i in range(n + 1):
        t = i / n
        w = math.sin(t * waves * math.tau) * amp * min(1, t * 6, (1 - t) * 6)
        pts.append((x0 + (x1 - x0) * t + nx * w, y0 + (y1 - y0) * t + ny * w))
    return smooth(pts, closed=False)


def panel(s, c, cols=6, rows=4):
    """The solar panel: an aluminium frame round dark blue cells, each with its thin silver lines."""
    s.d(lin("cell", [(0, "#3a63c8"), (0.5, "#1d3a8c"), (1, "#142a66")], x1=0, y1=0, x2=1, y2=1))
    out = [f'<polygon points="{P([(x + 8, y + 10) for x, y in c])}" fill="#000" opacity="0.35" filter="url(#s8)"/>',
           f'<polygon points="{P(c)}" fill="#aab4c4" stroke="#6a7486" stroke-width="4" stroke-linejoin="round"/>']
    m = 0.02
    for j in range(rows):
        for i in range(cols):
            u0, u1 = m + (1 - 2 * m) * i / cols, m + (1 - 2 * m) * (i + 1) / cols
            v0, v1 = m + (1 - 2 * m) * j / rows, m + (1 - 2 * m) * (j + 1) / rows
            g = 0.012
            q = [bil(c, u0 + g, v0 + g), bil(c, u1 - g, v0 + g), bil(c, u1 - g, v1 - g), bil(c, u0 + g, v1 - g)]
            out.append(f'<polygon points="{P(q)}" fill="url(#cell)"/>')
            # the fingers: fine silver lines across each cell, and two bus bars along it
            for k in range(1, 6):
                v = v0 + (v1 - v0) * k / 6
                a, b = bil(c, u0 + g, v), bil(c, u1 - g, v)
                out.append(f'<line x1="{f(a[0])}" y1="{f(a[1])}" x2="{f(b[0])}" y2="{f(b[1])}" stroke="#8ea6dc" stroke-width="1.2" opacity="0.7"/>')
            for k in (1, 2):
                u = u0 + (u1 - u0) * k / 3
                a, b = bil(c, u, v0 + g), bil(c, u, v1 - g)
                out.append(f'<line x1="{f(a[0])}" y1="{f(a[1])}" x2="{f(b[0])}" y2="{f(b[1])}" stroke="#c8d2e6" stroke-width="2.6"/>')
    # the sky's reflection: a soft diagonal sheen
    s.d(f'<clipPath id="panelClip"><polygon points="{P(c)}"/></clipPath>')
    sheen = [bil(c, 0.15, -0.1), bil(c, 0.42, -0.1), bil(c, 0.2, 1.1), bil(c, -0.07, 1.1)]
    out.append(f'<g clip-path="url(#panelClip)"><polygon points="{P(sheen)}" fill="#ffffff" opacity="0.13"/>'
               f'<polygon points="{P([bil(c, 0.5, -0.1), bil(c, 0.56, -0.1), bil(c, 0.34, 1.1), bil(c, 0.28, 1.1)])}" fill="#ffffff" opacity="0.1"/></g>')
    s.a("".join(out))


def bulb(s, x, y, r):
    """A light bulb, lit."""
    s.d(rad("bulbGlow", [(0, "#fff2c0", 0.95), (0.3, "#ffd36a", 0.55), (1, "#ffb21e", 0)]),
        rad("bulbGlass", [(0, "#fff6d8"), (0.5, "#ffe08a"), (1, "#f0b84a")], cx=0.42, cy=0.38, r=0.7))
    s.a(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r * 2.6)}" fill="url(#bulbGlow)"/>',
        f'<path d="M{f(x - r * 0.42)},{f(y + r * 0.82)} C{f(x - r * 0.5)},{f(y + r * 0.5)} {f(x - r)},{f(y + r * 0.3)} {f(x - r)},{f(y - r * 0.1)} '
        f'A{f(r)},{f(r)} 0 1 1 {f(x + r)},{f(y - r * 0.1)} C{f(x + r)},{f(y + r * 0.3)} {f(x + r * 0.5)},{f(y + r * 0.5)} {f(x + r * 0.42)},{f(y + r * 0.82)}Z" '
        f'fill="url(#bulbGlass)"/>',
        f'<path d="M{f(x - r * 0.25)},{f(y + r * 0.6)} L{f(x - r * 0.2)},{f(y - r * 0.05)} Q{f(x)},{f(y - r * 0.3)} {f(x + r * 0.2)},{f(y - r * 0.05)} '
        f'L{f(x + r * 0.25)},{f(y + r * 0.6)}" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>')
    for k in range(3):
        yy = y + r * 0.86 + k * r * 0.17
        s.a(f'<rect x="{f(x - r * 0.44)}" y="{f(yy)}" width="{f(r * 0.88)}" height="{f(r * 0.14)}" rx="{f(r * 0.06)}" fill="{"#9aa4b4" if k % 2 == 0 else "#6a7486"}"/>')
    s.a(f'<path d="M{f(x - r * 0.3)},{f(y + r * 1.36)} L{f(x + r * 0.3)},{f(y + r * 1.36)} L{f(x + r * 0.12)},{f(y + r * 1.5)} L{f(x - r * 0.12)},{f(y + r * 1.5)}Z" fill="#3a4258"/>')


def vanguard(s, x, y, r):
    """Vanguard 1: a small shiny ball with six long thin antennas and little solar cells on it."""
    s.d(rad("vg", [(0, "#ffffff"), (0.3, "#d8dee8"), (0.8, "#8a94a8"), (1, "#5a6478")], cx=0.38, cy=0.34, r=0.72))
    out = [glow(x, y, r * 2.2, "#b8c8ff", 0.35, "s8")]
    for a in (200, 235, 270, 20, 55, 90):
        t = math.radians(a)
        out.append(f'<line x1="{f(x + math.cos(t) * r * 0.8)}" y1="{f(y + math.sin(t) * r * 0.8)}" x2="{f(x + math.cos(t) * r * 4)}" '
                   f'y2="{f(y + math.sin(t) * r * 4)}" stroke="#c8d0dc" stroke-width="2.4" stroke-linecap="round"/>')
    out.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r)}" fill="url(#vg)"/>')
    for (dx, dy) in ((-0.45, 0.1), (0.35, -0.35), (0.3, 0.45)):
        out.append(f'<rect x="{f(x + dx * r - r * 0.18)}" y="{f(y + dy * r - r * 0.13)}" width="{f(r * 0.36)}" height="{f(r * 0.26)}" fill="#1d3a8c"/>')
    s.a("".join(out))


def build():
    s = Svg("Si", GOLD)
    background(s, glows=[(170, 150, 360, 0.8), (980, 470, 260, 0.6)], seed=1954, stars=50, star_box=(0, 0, 1200, 300), bokeh=4)
    rnd = random.Random(1958)

    # ---------- the sun
    sx, sy = 150, 140
    s.d(rad("sun", [(0, "#ffe9a8"), (0.6, "#ffcf4a"), (1, "#ffb21e")]),
        rad("sunHalo", [(0, "#ffd36a", 0.55), (0.5, "#ffb21e", 0.18), (1, "#ffb21e", 0)]))
    s.a(f'<circle cx="{sx}" cy="{sy}" r="190" fill="url(#sunHalo)"/>')
    for k in range(14):
        a = k / 14 * math.tau + 0.1
        r0, r1 = 78, 112 if k % 2 == 0 else 98
        s.a(f'<line x1="{f(sx + math.cos(a) * r0)}" y1="{f(sy + math.sin(a) * r0)}" x2="{f(sx + math.cos(a) * r1)}" '
            f'y2="{f(sy + math.sin(a) * r1)}" stroke="#ffd36a" stroke-width="7" stroke-linecap="round"/>')
    s.a(f'<circle cx="{sx}" cy="{sy}" r="64" fill="url(#sun)"/>')

    # ---------- the ground
    s.d(lin("ground", [(0, "#2a3a2e"), (1, "#121a18")], x1=0, y1=0, x2=0, y2=1))
    s.a(f'<path d="M0,{FLOOR} Q600,{FLOOR - 26} 1200,{FLOOR} L1200,800 L0,800Z" fill="url(#ground)"/>')

    # ---------- the panel on its stand, facing the sun
    c = [(300, 270), (760, 300), (720, 520), (220, 480)]
    for (x0, y0, x1, y1) in ((300, 490, 290, FLOOR - 4), (660, 515, 680, FLOOR - 6), (480, 500, 470, FLOOR - 6)):
        s.a(f'<line x1="{x0}" y1="{y0}" x2="{x1}" y2="{y1}" stroke="#5a6478" stroke-width="12" stroke-linecap="round"/>')
    panel(s, c)
    # the sunlight arriving: wavy golden rays
    for (x1, y1) in ((360, 310), (520, 330), (650, 380), (430, 430), (300, 440)):
        a = math.atan2(y1 - sy, x1 - sx)
        x0, y0 = sx + math.cos(a) * 125, sy + math.sin(a) * 125
        d = wave(x0, y0, x1, y1, 6, max(3, int(math.hypot(x1 - x0, y1 - y0) / 70)))
        s.a(f'<path d="{d}" fill="none" stroke="#ffd36a" stroke-width="5" stroke-linecap="round" opacity="0.85"/>')
    # ---------- the wire to the bulb, electrons running along it
    wire = [(735, 470), (800, 520), (880, 548), (960, 545), (1010, 520), (1010, 470)]
    d = smooth(wire, closed=False)
    s.a(f'<path d="{d}" fill="none" stroke="#1a1e2a" stroke-width="10" stroke-linecap="round"/>',
        f'<path d="{d}" fill="none" stroke="#e05a3a" stroke-width="5" stroke-linecap="round"/>')
    for (x, y) in ((770, 498), (842, 538), (918, 550), (985, 536)):
        s.a(glow(x, y, 11, "#7fd0ff", 0.85, "s4"), f'<circle cx="{x}" cy="{y}" r="5" fill="#bfe6ff"/>')
    bulb(s, 1010, 380, 56)

    # ---------- a close-up of the silicon: light knocks an electron loose
    mx, my, mr = 850, 175, 128
    opening, closing = magnifier(s, "zoomCell", mx, my, mr, GOLD, src=(560, 330, 26))
    s.a(opening)
    grid = []
    for j in range(-3, 4):
        for i in range(-3, 4):
            grid.append((mx + i * 62 + (j % 2) * 0, my + j * 62))
    for (x, y) in grid:
        for (dx, dy) in ((62, 0), (0, 62)):
            s.a(bond(x, y, x + dx, y + dy, 8, "#8a7a6a"))
    for (x, y) in grid:
        s.a(ball(x, y, 19, "Si"))
    # the hole the electron left, and the electron flying out
    hx, hy = mx + 31, my
    s.a(f'<circle cx="{f(hx)}" cy="{f(hy)}" r="10" fill="none" stroke="#ffffff" stroke-width="3" stroke-dasharray="4 4"/>')
    ex, ey = mx + 82, my - 70
    s.a(f'<path d="M{f(hx + 8)},{f(hy - 8)} Q{f(hx + 30)},{f(hy - 50)} {f(ex - 12)},{f(ey + 10)}" fill="none" stroke="#7fd0ff" '
        f'stroke-width="4" stroke-dasharray="7 6" stroke-linecap="round"/>',
        glow(ex, ey, 20, "#7fd0ff", 0.9, "s4"), f'<circle cx="{f(ex)}" cy="{f(ey)}" r="12" fill="#5ab8ff" stroke="#e8f6ff" stroke-width="2"/>',
        charge(ex, ey, 12, "-", "#ffffff"))
    d = wave(mx - 120, my - 120, hx - 6, hy - 6, 8, 4)
    s.a(f'<path d="{d}" fill="none" stroke="#ffd36a" stroke-width="7" stroke-linecap="round"/>',
        arrow([(hx - 26, hy - 26), (hx - 8, hy - 8)], "#ffd36a", w=7, head=22))
    s.a(closing)

    # ---------- Vanguard 1, high up, on its orbit
    s.a(f'<path d="M770,70 Q1000,30 1200,96" fill="none" stroke="#b8c8ff" stroke-width="2" stroke-dasharray="6 8" opacity="0.6"/>')
    vanguard(s, 1095, 78, 16)
    finish(s)
    s.save("solar")


if __name__ == "__main__":
    build()
