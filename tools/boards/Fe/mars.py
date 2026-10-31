"""Board 'mars': on Mars at sunset. A rusty red plain under a butterscotch sky, the small Sun low over a
crater's rim with a blue glow round it (Mars's sunsets are blue). On the left the rover Opportunity (solar
wings, a mast with its camera head, six wheels), its arm on a rock it has ground into: red outside, dark
grey inside. In front, little grey-blue hematite 'blueberries' on the dust. A close-up of the red dust:
iron and oxygen, rust. Far up, Earth as an evening star."""
import math
import os
import random
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from lib.style import *  # noqa: E402,F401

RUST = "#ff7a45"
HORIZON = 440


def sky(s):
    # butterscotch by day, darker overhead now the Sun is low; blue round the Sun itself
    s.d(lin("marsSky", [(0, "#3a2a3a"), (0.45, "#7a5040"), (0.85, "#a8704a"), (1, "#b07a52")], x1=0, y1=0, x2=0, y2=1),
        rad("blueSun", [(0, "#cfe4ff", 0.95), (0.2, "#8ab4ff", 0.6), (0.55, "#5a86d8", 0.25), (1, "#5a86d8", 0)]))
    s.a(f'<rect x="0" y="0" width="1200" height="{HORIZON + 20}" fill="url(#marsSky)"/>')
    s.a(starfield("#ffd8b0", seed=4, stars=30, box=(0, 0, 1200, 180), bokeh=0))
    # Earth, a small blue-white evening star
    s.a(glow(300, 92, 10, "#a8c8ff", 0.8, "s2"), '<circle cx="300" cy="92" r="3.2" fill="#e8f0ff"/>')
    sx, sy = 1010, HORIZON - 34
    s.a(f'<ellipse cx="{sx}" cy="{sy}" rx="230" ry="170" fill="url(#blueSun)"/>',
        glow(sx, sy, 26, "#e8f2ff", 0.9, "s4"), f'<circle cx="{sx}" cy="{sy}" r="15" fill="#f4f8ff"/>')


def ground(s, rnd):
    s.d(lin("dust", [(0, "#8a3a22"), (0.5, "#a8482a"), (1, "#6a2a18")], x1=0, y1=0, x2=0, y2=1))
    # the crater's far rim, low and hazy, catching the light
    s.a(f'<path d="M560,{HORIZON + 6} C680,{HORIZON - 40} 860,{HORIZON - 52} 1200,{HORIZON - 30} L1200,{HORIZON + 20} L560,{HORIZON + 20}Z" fill="#7a4a3a" opacity="0.8"/>',
        f'<path d="M0,{HORIZON} C200,{HORIZON - 12} 420,{HORIZON + 4} 640,{HORIZON - 2} C860,{HORIZON - 8} 1000,{HORIZON + 4} 1200,{HORIZON - 4} L1200,800 L0,800Z" fill="url(#dust)"/>')
    # ripples of dust and scattered red rocks
    for k in range(6):
        y = HORIZON + 30 + k * 30
        s.a(f'<path d="M0,{y} C300,{y - 8} 700,{y + 10} 1200,{y - 4}" fill="none" stroke="#c8603a" stroke-width="3" opacity="0.25"/>')
    for _ in range(26):
        x = rnd.uniform(0, 1200)
        y = rnd.uniform(HORIZON + 10, 610)
        r = rnd.uniform(4, 14) * (0.4 + (y - HORIZON) / 200)
        s.a(f'<ellipse cx="{f(x)}" cy="{f(y)}" rx="{f(r)}" ry="{f(r * 0.6)}" fill="#6a2c1c"/>'
            f'<ellipse cx="{f(x - r * 0.2)}" cy="{f(y - r * 0.2)}" rx="{f(r * 0.6)}" ry="{f(r * 0.3)}" fill="#b85a36" opacity="0.6"/>')


def rock(s, x, y):
    """The rock the rover has ground into: rusty outside, a round dark-grey hole showing the inside."""
    pts = [(x - 90, y + 20), (x - 80, y - 30), (x - 30, y - 56), (x + 40, y - 50), (x + 86, y - 16), (x + 92, y + 20)]
    s.a(f'<ellipse cx="{x}" cy="{y + 22}" rx="100" ry="14" fill="#000" opacity="0.3"/>',
        f'<path d="{smooth(pts, k=0.7)}" fill="#9a4026" stroke="#5a2214" stroke-width="3"/>',
        f'<path d="M{x - 70},{y - 30} C{x - 30},{y - 50} {x + 30},{y - 46} {x + 70},{y - 20}" fill="none" stroke="#d07048" stroke-width="5" opacity="0.5"/>',
        f'<circle cx="{x + 10}" cy="{y - 14}" r="24" fill="#4a4e58" stroke="#2a2c34" stroke-width="3"/>',
        f'<circle cx="{x + 10}" cy="{y - 14}" r="16" fill="#5e636e"/>')
    for k in range(4):
        a = k / 4 * math.tau + 0.4
        s.a(f'<path d="M{f(x + 10 + math.cos(a) * 5)},{f(y - 14 + math.sin(a) * 5)} A11,11 0 0 1 {f(x + 10 + math.cos(a + 1.2) * 11)},{f(y - 14 + math.sin(a + 1.2) * 11)}" '
            f'fill="none" stroke="#7a808c" stroke-width="2" opacity="0.7"/>')


def rover(s, x, y):
    """Opportunity seen from the side and a little in front: a box body, two solar wings, a mast and
    camera head, six wheels on rocker arms, the arm reaching to the rock."""
    s.d(lin("cells", [(0, "#2a3a7a"), (1, "#141c44")], x1=0, y1=0, x2=0, y2=1),
        lin("body", [(0, "#e2c890"), (1, "#a88a50")], x1=0, y1=0, x2=0, y2=1))
    out = [f'<ellipse cx="{x + 20}" cy="{y + 70}" rx="190" ry="16" fill="#000" opacity="0.35"/>']
    # wheels and rocker arms
    for wx in (x - 110, x + 10, x + 130):
        out.append(f'<circle cx="{wx}" cy="{y + 46}" r="24" fill="#2a2c34" stroke="#9aa0ac" stroke-width="3"/>'
                   f'<circle cx="{wx}" cy="{y + 46}" r="8" fill="#9aa0ac"/>')
    out.append(f'<path d="M{x - 110},{y + 46} L{x - 50},{y + 10} L{x + 10},{y + 46} M{x - 50},{y + 10} L{x + 70},{y + 8} L{x + 130},{y + 46}" '
               f'fill="none" stroke="#c8ccd6" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>')
    # the body
    out.append(f'<path d="M{x - 90},{y - 20} L{x + 110},{y - 20} L{x + 100},{y + 14} L{x - 80},{y + 14}Z" fill="url(#body)" stroke="#6a5430" stroke-width="2.5"/>')
    # the solar wings: a deck of blue cells, its edges catching light
    out.append(f'<path d="M{x - 160},{y - 34} L{x + 170},{y - 34} L{x + 190},{y - 22} L{x - 180},{y - 22}Z" fill="url(#cells)" stroke="#8a9ad8" stroke-width="2"/>')
    for k in range(1, 12):
        xx = x - 170 + k * 30
        out.append(f'<line x1="{xx}" y1="{y - 33}" x2="{xx + 2}" y2="{y - 23}" stroke="#5a6ab8" stroke-width="1.5"/>')
    # the mast and its camera head
    out.append(f'<rect x="{x + 66}" y="{y - 120}" width="9" height="88" fill="#c8ccd6"/>'
               f'<rect x="{x + 46}" y="{y - 142}" width="58" height="26" rx="5" fill="#d8dce4" stroke="#6a707c" stroke-width="2"/>'
               f'<circle cx="{x + 92}" cy="{y - 129}" r="7" fill="#1a2040"/><circle cx="{x + 70}" cy="{y - 129}" r="7" fill="#1a2040"/>')
    # the high-gain antenna (a dish) and a thin low-gain mast
    out.append(f'<line x1="{x - 60}" y1="{y - 34}" x2="{x - 60}" y2="{y - 64}" stroke="#c8ccd6" stroke-width="5"/>'
               f'<ellipse cx="{x - 60}" cy="{y - 72}" rx="26" ry="10" fill="#e2e6ee" stroke="#6a707c" stroke-width="2"/>'
               f'<line x1="{x - 120}" y1="{y - 34}" x2="{x - 120}" y2="{y - 100}" stroke="#c8ccd6" stroke-width="3"/>')
    s.a("".join(out))


def arm(s, x0, y0, x1, y1):
    mx, my = (x0 + x1) / 2 + 20, min(y0, y1) - 40
    s.a(f'<path d="M{x0},{y0} L{f(mx)},{f(my)} L{x1},{y1 - 16}" fill="none" stroke="#c8ccd6" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"/>',
        f'<rect x="{x1 - 14}" y="{y1 - 22}" width="28" height="14" rx="3" fill="#9aa0ac" stroke="#4a4e58" stroke-width="2"/>')


def blueberries(s, rnd):
    for _ in range(30):
        x = rnd.uniform(520, 940)
        y = rnd.uniform(560, 615)
        r = rnd.uniform(4.5, 8)
        s.a(f'<ellipse cx="{f(x + 2)}" cy="{f(y + r * 0.7)}" rx="{f(r)}" ry="{f(r * 0.35)}" fill="#000" opacity="0.3"/>',
            f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r)}" fill="#5a6478"/>',
            f'<circle cx="{f(x - r * 0.3)}" cy="{f(y - r * 0.3)}" r="{f(r * 0.4)}" fill="#a8b4cc" opacity="0.8"/>')


def build():
    s = Svg("Fe", RUST)
    background(s, glows=[(600, 400, 380, 0.6)], seed=2004, stars=0, bokeh=3)
    rnd = random.Random(2004)
    sky(s)
    ground(s, rnd)
    rover(s, 230, 500)
    rock(s, 470, 580)
    arm(s, 330, 490, 536, 548)
    blueberries(s, rnd)

    # the close-up of the red dust: iron and oxygen, rust (an iron oxide)
    cx, cy, r = 770, 190, 118
    opening, closing = magnifier(s, "zoomRust", cx, cy, r, RUST, src=(700, 590, 22))
    s.a(opening)
    s.a(f'<rect x="{cx - r}" y="{cy - r}" width="{2 * r}" height="{2 * r}" fill="#a8482a" opacity="0.35"/>')
    for j in range(-3, 4):
        for i in range(-3, 4):
            x = cx + i * 36 + (j % 2) * 18
            y = cy + j * 32
            el = "Fe" if (i + 2 * j) % 5 in (0, 2) else "O"
            s.a(ball(x, y, 16 if el == "Fe" else 14, el))
    s.a(closing)
    finish(s)
    s.save("mars")


if __name__ == "__main__":
    build()
