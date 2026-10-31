"""Board 'cereal': breakfast on a wooden table. A blue bowl of golden cereal flakes in milk; above it a red
horseshoe magnet held over the bowl, black specks of iron flying up and clinging to its poles. A close-up of
one pole: a cluster of iron atoms stuck to it. Beside the bowl, foods with iron (a glass of orange juice,
lentils, spinach leaves, an egg), a spoon."""
import math
import os
import random
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from lib.style import *  # noqa: E402,F401

GREEN = "#8bd65a"
TABLE = 520


def table(s):
    s.d(lin("tableTop", [(0, "#8a5a34"), (1, "#5a3a20")], x1=0, y1=0, x2=0, y2=1))
    s.a(f'<rect x="0" y="{TABLE}" width="1200" height="{800 - TABLE}" fill="url(#tableTop)"/>')
    for k in range(7):
        y = TABLE + 14 + k * 22
        s.a(f'<path d="M0,{y} C300,{y - 6} 600,{y + 8} 1200,{y - 2}" fill="none" stroke="#4a2e18" stroke-width="2" opacity="0.35"/>')
    s.a(f'<rect x="0" y="{TABLE}" width="1200" height="5" fill="#b07a4a" opacity="0.6"/>')


def bowl(s, cx, top, rnd):
    """A blue bowl seen a little from above, full of milk and golden flakes."""
    w, h = 190, 120
    s.d(lin("bowl", [(0, "#5aa0ff"), (0.5, "#2f6fd5"), (1, "#1a3c8a")], x1=0, y1=0, x2=1, y2=0),
        rad("milk", [(0, "#e2e0d6"), (1, "#c4c0b2")], cx=0.45, cy=0.4, r=0.7))
    out = [f'<ellipse cx="{f(cx)}" cy="{f(top + h + 6)}" rx="{f(w * 0.75)}" ry="14" fill="#000" opacity="0.35" filter="url(#s4)"/>',
           f'<path d="M{f(cx - w)},{f(top)} C{f(cx - w)},{f(top + h * 0.9)} {f(cx - w * 0.5)},{f(top + h)} {f(cx)},{f(top + h)} '
           f'C{f(cx + w * 0.5)},{f(top + h)} {f(cx + w)},{f(top + h * 0.9)} {f(cx + w)},{f(top)}Z" fill="url(#bowl)"/>',
           f'<ellipse cx="{f(cx)}" cy="{f(top)}" rx="{f(w)}" ry="36" fill="#7ab8ff"/>',
           f'<ellipse cx="{f(cx)}" cy="{f(top + 2)}" rx="{f(w - 10)}" ry="29" fill="url(#milk)"/>']
    # the flakes: golden, curled, overlapping
    s.d(f'<clipPath id="bowlTop"><ellipse cx="{f(cx)}" cy="{f(top + 2)}" rx="{f(w - 10)}" ry="29"/></clipPath>')
    flakes = []
    for _ in range(64):
        x = cx + rnd.uniform(-w + 24, w - 24)
        y = top + rnd.uniform(-26, 22) - 6
        r = rnd.uniform(15, 25)
        col = rnd.choice(["#e8a840", "#d8902a", "#f0b850", "#c47a20"])
        # a cornflake: a thin, wavy, irregular chip, seen at a slant
        pts = [(x + math.cos(k / 7 * math.tau) * r * rnd.uniform(0.65, 1.1), y + math.sin(k / 7 * math.tau) * r * rnd.uniform(0.35, 0.6))
               for k in range(7)]
        flakes.append(f'<path d="{smooth(pts)}" fill="{col}" stroke="#8a5210" stroke-width="1.5"/>'
                      f'<path d="M{f(x - r * 0.55)},{f(y - 1)} Q{f(x)},{f(y - r * 0.32)} {f(x + r * 0.5)},{f(y - 3)}" fill="none" stroke="#ffd98a" '
                      f'stroke-width="2" opacity="0.65"/>')
    out.append('<g>' + "".join(flakes) + "</g>")
    # the bowl's rim in front of the flakes
    out.append(f'<path d="M{f(cx - w)},{f(top)} A{f(w)},36 0 0 0 {f(cx + w)},{f(top)}" fill="none" stroke="#7ab8ff" stroke-width="8"/>')
    out.append(f'<path d="M{f(cx - w + 20)},{f(top + 30)} C{f(cx - w + 30)},{f(top + 80)} {f(cx - 60)},{f(top + 100)} {f(cx - 20)},{f(top + 104)}" '
               f'fill="none" stroke="#bfe0ff" stroke-width="6" stroke-linecap="round" opacity="0.4"/>')
    s.a("".join(out))


def magnet(s, cx, y, rnd):
    """A red horseshoe magnet, its silver poles down, with iron specks on them."""
    s.d(lin("red", [(0, "#ff6a6a"), (0.5, "#d8282e"), (1, "#8a1218")], x1=0, y1=0, x2=1, y2=0),
        lin("pole", [(0, "#e8ecf2"), (0.5, "#a8b0bc"), (1, "#6a7280")], x1=0, y1=0, x2=1, y2=0))
    R, t = 80, 50
    out = [f'<path d="M{f(cx - R)},{f(y)} A{f(R)},{f(R)} 0 0 1 {f(cx + R)},{f(y)}" fill="none" stroke="url(#red)" stroke-width="{t}"/>']
    for side in (-1, 1):
        x = cx + side * R
        out.append(f'<rect x="{f(x - t / 2)}" y="{f(y)}" width="{t}" height="70" fill="url(#red)"/>')
        out.append(f'<rect x="{f(x - t / 2)}" y="{f(y + 70)}" width="{t}" height="34" fill="url(#pole)"/>')
        # the specks clinging to the pole's end, in a beard
        for _ in range(40):
            px = x + rnd.uniform(-t / 2 - 2, t / 2 + 2)
            py = y + 104 + abs(rnd.gauss(0, 9))
            out.append(f'<circle cx="{f(px)}" cy="{f(py)}" r="{f(rnd.uniform(2.4, 4.4))}" fill="#16181e" stroke="#5a606c" stroke-width="0.8"/>')
    out.append(f'<path d="M{f(cx - R - 14)},{f(y - 6)} A{f(R + 14)},{f(R + 14)} 0 0 1 {f(cx - 20)},{f(y - R - 12)}" fill="none" stroke="#ffffff" '
               f'stroke-width="6" stroke-linecap="round" opacity="0.35"/>')
    s.a("".join(out))
    return cx - R, cx + R, y + 104


def specks_rising(s, x0, x1, ytop, ybowl, rnd):
    """Iron specks flying up from the flakes to the poles, with dotted trails."""
    out = []
    for x in (x0, x1):
        for k in range(4):
            sx = x + rnd.uniform(-40, 40)
            sy = ybowl - rnd.uniform(0, 10)
            ex = x + rnd.uniform(-10, 10)
            ey = ytop + 12 + k * 8
            mid = ((sx + ex) / 2 + rnd.uniform(-20, 20), (sy + ey) / 2)
            out.append(f'<path d="M{f(sx)},{f(sy)} Q{f(mid[0])},{f(mid[1])} {f(ex)},{f(ey)}" fill="none" stroke="#e8f0ff" stroke-width="2" '
                       f'stroke-dasharray="3 6" opacity="0.6"/>')
            t = rnd.uniform(0.3, 0.8)
            px = (1 - t) ** 2 * sx + 2 * (1 - t) * t * mid[0] + t * t * ex
            py = (1 - t) ** 2 * sy + 2 * (1 - t) * t * mid[1] + t * t * ey
            out.append(f'<circle cx="{f(px)}" cy="{f(py)}" r="3.2" fill="#16181e" stroke="#c8d0e0" stroke-width="1"/>')
    s.a("".join(out))


def foods(s, rnd):
    out = []
    # a glass of orange juice
    gx, gb = 150, TABLE + 70
    out.append(f'<ellipse cx="{gx}" cy="{gb + 4}" rx="56" ry="10" fill="#000" opacity="0.3"/>')
    out.append(f'<path d="M{gx - 50},{gb - 190} L{gx - 42},{gb} L{gx + 42},{gb} L{gx + 50},{gb - 190}Z" fill="#ff9a1e" opacity="0.92"/>')
    out.append(f'<path d="M{gx - 54},{gb - 236} L{gx - 50},{gb - 190} L{gx + 50},{gb - 190} L{gx + 54},{gb - 236}" fill="#cfe8ff" opacity="0.18"/>')
    out.append(f'<ellipse cx="{gx}" cy="{gb - 190}" rx="50" ry="9" fill="#ffc05a"/>')
    out.append(f'<path d="M{gx - 54},{gb - 236} L{gx - 42},{gb} L{gx + 42},{gb} L{gx + 54},{gb - 236}" fill="none" stroke="#e8f4ff" stroke-width="3" opacity="0.55"/>')
    out.append(f'<path d="M{gx - 36},{gb - 170} L{gx - 30},{gb - 20}" stroke="#ffffff" stroke-width="6" stroke-linecap="round" opacity="0.3"/>')
    # an orange slice on the rim
    out.append(f'<circle cx="{gx + 46}" cy="{gb - 236}" r="28" fill="#ffb02a" stroke="#e07a10" stroke-width="4"/>')
    for k in range(8):
        a = k / 8 * math.tau
        out.append(f'<line x1="{gx + 46}" y1="{gb - 236}" x2="{f(gx + 46 + math.cos(a) * 22)}" y2="{f(gb - 236 + math.sin(a) * 22)}" stroke="#ffe0a0" stroke-width="2"/>')
    # spinach leaves
    for (lx, ly, a, sz) in ((300, TABLE + 60, -30, 1.0), (340, TABLE + 70, 10, 0.9), (275, TABLE + 82, 40, 0.8)):
        out.append(f'<g transform="rotate({a} {lx} {ly})"><path d="M{lx - 50 * sz},{ly} C{lx - 30 * sz},{ly - 34 * sz} {lx + 30 * sz},{ly - 34 * sz} {lx + 50 * sz},{ly} '
                   f'C{lx + 30 * sz},{ly + 30 * sz} {lx - 30 * sz},{ly + 30 * sz} {lx - 50 * sz},{ly}Z" fill="#2f9a3a" stroke="#1a6a24" stroke-width="2"/>'
                   f'<path d="M{lx - 50 * sz},{ly} L{lx + 44 * sz},{ly}" stroke="#7ad06a" stroke-width="2.5"/></g>')
    # a small dish of lentils
    lx, ly = 960, TABLE + 70
    out.append(f'<ellipse cx="{lx}" cy="{ly + 6}" rx="92" ry="16" fill="#000" opacity="0.3"/>'
               f'<path d="M{lx - 88},{ly - 30} Q{lx},{ly + 34} {lx + 88},{ly - 30}Z" fill="#e8f0e0" opacity="0.85"/>'
               f'<ellipse cx="{lx}" cy="{ly - 30}" rx="88" ry="20" fill="#d8e2d0"/>')
    for _ in range(70):
        x = lx + rnd.uniform(-76, 76)
        y = ly - 30 + rnd.uniform(-14, 12) * (1 - abs(x - lx) / 110)
        out.append(f'<ellipse cx="{f(x)}" cy="{f(y)}" rx="5.5" ry="3.8" fill="{rnd.choice(["#a85a2a", "#c87a3a", "#8a4a20"])}"/>')
    # an egg
    out.append(f'<ellipse cx="1098" cy="{TABLE + 72}" rx="38" ry="12" fill="#000" opacity="0.3"/>'
               f'<ellipse cx="1098" cy="{TABLE + 30}" rx="36" ry="46" fill="#d8b890" stroke="#a8845a" stroke-width="2"/>'
               f'<ellipse cx="1086" cy="{TABLE + 12}" rx="10" ry="16" fill="#f0dcc0" opacity="0.6"/>')
    # a spoon
    out.append(f'<g transform="rotate(-8 640 {TABLE + 92})"><ellipse cx="560" cy="{TABLE + 92}" rx="34" ry="16" fill="#9aa4b4"/>'
               f'<rect x="590" y="{TABLE + 87}" width="140" height="10" rx="5" fill="#9aa4b4"/>'
               f'<ellipse cx="552" cy="{TABLE + 88}" rx="18" ry="6" fill="#d8e0ea" opacity="0.6"/></g>')
    s.a("".join(out))


def build():
    s = Svg("Fe", GREEN)
    background(s, glows=[(600, 260, 360, 0.7), (980, 180, 240, 0.5)], seed=8, stars=0, star_box=(0, 0, 1200, 480), bokeh=6, tint=0.55)
    rnd = random.Random(18)
    # the kitchen wall's tiles
    for j in range(9):
        for i in range(21):
            s.a(f'<rect x="{i * 60 + (j % 2) * 30 - 30}" y="{j * 60}" width="56" height="56" rx="4" fill="#ffffff" opacity="0.035"/>')
    # a kitchen window behind, soft morning light
    s.a('<rect x="60" y="60" width="300" height="220" rx="10" fill="#2a4a6a" opacity="0.5"/>',
        '<rect x="60" y="60" width="300" height="220" rx="10" fill="none" stroke="#c8d8a8" stroke-width="8" opacity="0.35"/>',
        '<line x1="210" y1="60" x2="210" y2="280" stroke="#c8d8a8" stroke-width="6" opacity="0.35"/>',
        '<line x1="60" y1="170" x2="360" y2="170" stroke="#c8d8a8" stroke-width="6" opacity="0.35"/>',
        glow(160, 120, 70, "#fff0c0", 0.25, "s30"))
    table(s)
    foods(s, rnd)
    bowl(s, 600, TABLE - 40, rnd)
    x0, x1, ytip = magnet(s, 600, 230, rnd)
    specks_rising(s, x0, x1, ytip, TABLE - 50, rnd)

    # the close-up of a pole: iron atoms stuck to it
    opening, closing = magnifier(s, "zoomSpecks", 1000, 220, 125, GREEN, src=(x1, ytip, 24))
    s.a(opening)
    cx, cy = 1000, 220
    s.a(f'<rect x="{cx - 125}" y="{cy - 125}" width="250" height="70" fill="#a8b0bc"/>',
        f'<rect x="{cx - 125}" y="{cy - 58}" width="250" height="6" fill="#6a7280"/>')
    # a speck of iron powder: a little crystal of iron atoms, clinging under the pole
    for j in range(4):
        for i in range(-3 + j // 2, 4 - (j + 1) // 2):
            s.a(ball(cx + i * 30 + (j % 2) * 15, cy - 34 + j * 27, 15, "Fe"))
    s.a(arrow([(cx - 80, cy + 90), (cx - 80, cy + 40)], "#e8f8d8", w=5, head=16, op=0.8),
        arrow([(cx + 82, cy + 90), (cx + 82, cy + 40)], "#e8f8d8", w=5, head=16, op=0.8))
    s.a(closing)
    finish(s)
    s.save("cereal")


if __name__ == "__main__":
    build()
