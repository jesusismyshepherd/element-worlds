"""Board 'space': a satellite over the curve of the Earth, the Sun beyond. Its two wings of solar cells are deep
blue-black, in a grid. Three rays from the Sun, blue, red and the dashed dark red of infrared, go into a
close-up of one cell cut through: a sandwich of three layers, a violet-blue top layer, a red-brown middle one
and a thick grey slice of germanium at the bottom on a metal back. The blue ray stops in the top layer, the red
one passes it and stops in the middle, the infrared passes both and stops in the germanium: each with a spark
and a freed electron."""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gekit import *  # noqa: E402,F401

COLOR = "#ffd24d"
SUN = (250, 70)


def earth(s):
    s.d(rad("earthG", [(0, "#3a7ad0"), (0.7, "#1a4a9a"), (0.92, "#123a7a"), (1, "#0a1e48")], cx=0.5, cy=0.0, r=0.62),
        lin("atmo", [(0, "#8ad0ff", 0.0), (1, "#8ad0ff", 0.55)], x1=0, y1=0, x2=0, y2=1))
    s.a('<ellipse cx="640" cy="1500" rx="1150" ry="1000" fill="#5aa8ff" opacity="0.18" filter="url(#s16)"/>',
        '<ellipse cx="640" cy="1500" rx="1120" ry="980" fill="url(#earthG)"/>')
    rnd = rng(4)
    for _ in range(10):
        x, y = rnd.uniform(-60, 1260), rnd.uniform(560, 640)
        s.a(f'<ellipse cx="{f(x)}" cy="{f(y)}" rx="{f(rnd.uniform(60, 160))}" ry="{f(rnd.uniform(8, 18))}" fill="#c8d8f0" opacity="0.28"/>')


def wing(s, x0, y0, x1, y1, h, cells=8):
    """A solar wing from (x0, y0) to (x1, y1), h tall, in a grid of cells."""
    pts = [(x0, y0 - h / 2), (x1, y1 - h / 2), (x1, y1 + h / 2), (x0, y0 + h / 2)]
    s.a(f'<polygon points="{P(pts)}" fill="url(#panel)" stroke="#8a7a4a" stroke-width="3"/>')
    for k in range(1, cells):
        t = k / cells
        x = x0 + (x1 - x0) * t
        y = y0 + (y1 - y0) * t
        s.a(f'<line x1="{f(x)}" y1="{f(y - h / 2)}" x2="{f(x)}" y2="{f(y + h / 2)}" stroke="#4a5a8a" stroke-width="2"/>')
    for j in (-1, 1):
        s.a(f'<line x1="{f(x0)}" y1="{f(y0 + j * h / 6)}" x2="{f(x1)}" y2="{f(y1 + j * h / 6)}" stroke="#4a5a8a" stroke-width="2"/>')
    # a glint along it
    s.a(f'<line x1="{f(x0 + (x1 - x0) * 0.2)}" y1="{f(y0 - h * 0.3)}" x2="{f(x0 + (x1 - x0) * 0.45)}" y2="{f(y0 + (y1 - y0) * 0.45 - h * 0.3)}" '
        'stroke="#9ab4ff" stroke-width="5" stroke-linecap="round" opacity="0.35"/>')


def satellite(s, cx, cy):
    s.d(lin("panel", [(0, "#1c2450"), (0.5, "#28306a"), (1, "#141a3a")], x1=0, y1=0, x2=1, y2=1),
        lin("mli", [(0, "#ffe08a"), (0.4, "#d8a030"), (0.7, "#ffd060"), (1, "#a87018")], x1=0, y1=0, x2=1, y2=1))
    wing(s, cx - 60, cy, cx - 380, cy + 30, 92)
    wing(s, cx + 60, cy, cx + 300, cy - 22, 92, cells=6)
    s.a(f'<rect x="{cx - 12}" y="{cy - 4}" width="24" height="8" fill="#8a8a90"/>',
        f'<rect x="{cx - 60}" y="{cy - 70}" width="120" height="130" rx="6" fill="url(#mli)" stroke="#8a6010" stroke-width="3"/>')
    for k in range(5):
        s.a(f'<path d="M{cx - 56},{cy - 50 + k * 26} q30,-8 60,4 t52,-4" fill="none" stroke="#fff0b0" stroke-width="2" opacity="0.4"/>')
    s.a(f'<ellipse cx="{cx}" cy="{cy + 82}" rx="40" ry="12" fill="#c8ccd4"/>',
        f'<path d="M{cx - 40},{cy + 82} Q{cx},{cy + 120} {cx + 40},{cy + 82}" fill="#a8acb4"/>',
        f'<line x1="{cx}" y1="{cy - 70}" x2="{cx + 20}" y2="{cy - 120}" stroke="#c8ccd4" stroke-width="3"/>',
        f'<circle cx="{cx + 20}" cy="{cy - 120}" r="5" fill="#ffd24d"/>')


def build():
    s = Svg("Ge", COLOR)
    gdefs(s)
    background(s, glows=[(SUN[0], SUN[1], 260, 0.6)], seed=1361, stars=110, star_box=(0, 0, 1200, 520), bokeh=2, tint=0.7)
    earth(s)
    # the Sun (its core small and warm, not white: a white disc blooms on the wall)
    s.a(glow(SUN[0], SUN[1], 90, "#ffd27a", 0.55, "s30"), glow(SUN[0], SUN[1], 50, "#ffe8a0", 0.8, "s8"),
        f'<circle cx="{SUN[0]}" cy="{SUN[1]}" r="30" fill="#fff0b8"/>')
    for k in range(12):
        a = k / 12 * math.tau
        s.a(f'<line x1="{f(SUN[0] + math.cos(a) * 42)}" y1="{f(SUN[1] + math.sin(a) * 42)}" x2="{f(SUN[0] + math.cos(a) * 70)}" '
            f'y2="{f(SUN[1] + math.sin(a) * 70)}" stroke="#ffd27a" stroke-width="4" stroke-linecap="round" opacity="0.5"/>')
    satellite(s, 900, 250)

    # the close-up: one cell cut through, a sandwich of three layers
    MX, MY, MR = 470, 330, 165
    o, c = magnifier(s, "cell", MX, MY, MR, COLOR, src=(680, 268, 34), inner="#10142e")
    s.a(o)
    L0 = 300   # top of the sandwich
    layers = [(300, 336, "#6a5ad0", "#3a2a8a"), (336, 380, "#b0503a", "#6a2418"), (380, 450, None, None)]
    s.d(lin("lTop", [(0, "#7a6ae0"), (1, "#3a2a8a")], x1=0, y1=0, x2=0, y2=1),
        lin("lMid", [(0, "#c0603a"), (1, "#6a2418")], x1=0, y1=0, x2=0, y2=1))
    s.a(f'<rect x="{MX - MR}" y="{L0 - 10}" width="{2 * MR}" height="10" fill="#c8ccd4"/>')
    for k in range(5):
        s.a(f'<rect x="{MX - MR + 30 + k * 70}" y="{L0 - 22}" width="12" height="22" fill="#d8dce4"/>')
    s.a(f'<rect x="{MX - MR}" y="300" width="{2 * MR}" height="36" fill="url(#lTop)"/>',
        f'<rect x="{MX - MR}" y="336" width="{2 * MR}" height="44" fill="url(#lMid)"/>',
        f'<rect x="{MX - MR}" y="380" width="{2 * MR}" height="76" fill="url(#geCut)"/>',
        f'<rect x="{MX - MR}" y="456" width="{2 * MR}" height="14" fill="#8a8e98"/>')
    for y in (336, 380):
        s.a(f'<line x1="{MX - MR}" y1="{y}" x2="{MX + MR}" y2="{y}" stroke="#ffffff" stroke-width="1.5" opacity="0.35"/>')
    # germanium atoms in the bottom slice
    for i in range(7):
        for j in range(2):
            s.a(gball(MX - 150 + i * 50 + j * 25, 400 + j * 30, 9, "Ge", op=0.85))
    # the three rays and where each stops
    rays = [(MX - 90, 318, "#6aa0ff", None), (MX, 356, "#ff5a4a", None), (MX + 90, 418, "#a8203a", "10 8")]
    for (x, stop, col, dash) in rays:
        da = f' stroke-dasharray="{dash}"' if dash else ""
        s.a(f'<line x1="{SUN[0]}" y1="{SUN[1]}" x2="{x}" y2="{stop}" stroke="{col}" stroke-width="7" stroke-linecap="round"{da}/>')
        s.a(star_burst(x, stop + 4, 14, 4, 4, "#fff0b0", 0.95, 20))
        s.a(gball(x + 22, stop - 6, 7, "e"))
    s.a(c)
    # the rays from the Sun to the close-up's edge (straight on with the ones inside it)
    for (x, stop, col, dash) in rays:
        dx, dy = x - SUN[0], stop - SUN[1]
        L = math.hypot(dx, dy)
        # where the line enters the circle
        fx, fy = SUN[0] - MX, SUN[1] - MY
        b = 2 * (fx * dx + fy * dy) / L
        cc = fx * fx + fy * fy - MR * MR
        tin = (-b - math.sqrt(b * b - 4 * cc)) / 2
        ex, ey = SUN[0] + dx / L * tin, SUN[1] + dy / L * tin
        da = f' stroke-dasharray="{dash}"' if dash else ""
        s.a(f'<line x1="{SUN[0] + dx / L * 36}" y1="{SUN[1] + dy / L * 36}" x2="{f(ex)}" y2="{f(ey)}" stroke="{col}" stroke-width="6" '
            f'stroke-linecap="round" opacity="0.8"{da}/>')
    finish(s)
    s.save("space")


if __name__ == "__main__":
    build()
