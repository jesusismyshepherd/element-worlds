"""Board 'metre': the metre, twice. On the left a krypton-86 lamp glows orange-red in its frosty cold bath and
sends its light across the picture as one long wave, every crest marked on a ruler beneath it like the
ticks of a tape measure. Below, the old metre: the X-shaped bar of platinum-iridium lying on its rollers in a
velvet case, its two fine lines lined up with two of the light's ticks. A close-up of the bar's end shows its
X-shaped section and one of the engraved lines."""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from krkit import *  # noqa: E402,F401

COLOR = "#ff7a3c"
ORANGE = "#ff6a2a"
WY = 196            # the wave's axis
WX0, WX1 = 236, 1180
LAMBDA = 46         # one wave, drawn
RULER = 252
BX0, BX1, BY = 300, 898, 446  # the bar: left and right ends, its top face's middle
# the bar's X-shaped section (Tresca's), 20 x 20 units about its centre: the top groove reaches down to the
# neutral plane (y = 0), where the lines are engraved; a shallower groove below, a notch in each side
TRESCA = [(-10, -10), (-4.5, -10), (-1.5, 0), (1.5, 0), (4.5, -10), (10, -10), (10, -5), (6, 0), (10, 5), (10, 10), (4.5, 10),
          (1.5, 4), (-1.5, 4), (-4.5, 10), (-10, 10), (-10, 5), (-6, 0), (-10, -5)]


def lamp(s):
    """A tall cold bath (a dewar of liquid nitrogen) with the lamp's capillary glowing in a window."""
    s.d(lin("steel", [(0, "#2a3048"), (0.25, "#6a7494"), (0.42, "#9aa4c0"), (0.6, "#5a6482"), (1, "#22283c")], x1=0, y1=0, x2=1, y2=0))
    x0, x1, y0, y1 = 70, 196, 84, 540
    out = [f'<ellipse cx="{(x0 + x1) / 2}" cy="{y1 + 6}" rx="80" ry="10" fill="#000" opacity="0.35"/>',
           f'<rect x="{x0}" y="{y0}" width="{x1 - x0}" height="{y1 - y0}" rx="18" fill="url(#steel)"/>',
           f'<ellipse cx="{(x0 + x1) / 2}" cy="{y0 + 2}" rx="{(x1 - x0) / 2}" ry="12" fill="#8a94b4"/>',
           f'<ellipse cx="{(x0 + x1) / 2}" cy="{y0 + 2}" rx="{(x1 - x0) / 2 - 12}" ry="7" fill="#20263a"/>']
    # frost on the cold steel
    r = rng(63)
    for _ in range(40):
        fx, fy = r.uniform(x0 + 8, x1 - 8), r.uniform(y0 + 160, y1 - 20)
        out.append(f'<circle cx="{f(fx)}" cy="{f(fy)}" r="{f(r.uniform(1.5, 4))}" fill="#dfe8ff" opacity="{r.uniform(0.2, 0.55):.2f}"/>')
    out.append(f'<path d="M{x0 + 4},{y1 - 120} Q{x0 + 60},{y1 - 150} {x1 - 4},{y1 - 118} L{x1 - 4},{y1 - 20} L{x0 + 4},{y1 - 20} Z" fill="#c8d6f0" opacity="0.18"/>')
    # the window and the glowing capillary inside
    wx, wy = (x0 + x1) / 2, WY
    out.append(glow(wx, wy, 70, ORANGE, 0.5, "s16"))
    out.append(f'<rect x="{wx - 32}" y="{wy - 44}" width="64" height="88" rx="10" fill="#1a1020" stroke="#b8c0d8" stroke-width="4"/>')
    out.append(f'<rect x="{wx - 6}" y="{wy - 36}" width="12" height="72" rx="6" fill="{ORANGE}" filter="url(#g2)"/>'
               f'<rect x="{wx - 2.5}" y="{wy - 32}" width="5" height="64" rx="2.5" fill="#ffc08a"/>')
    # a short tube carrying the light out to the right
    out.append(f'<rect x="{x1 - 6}" y="{wy - 14}" width="{WX0 - x1 + 6}" height="28" rx="4" fill="#4a5270"/>'
               f'<rect x="{WX0 - 8}" y="{wy - 18}" width="10" height="36" rx="3" fill="#6a7494"/>')
    # cold mist curling over the rim
    for k in range(4):
        out.append(f'<ellipse cx="{x0 + 30 + k * 26}" cy="{y0 - 10 - k * 6}" rx="{30 + k * 4}" ry="12" fill="#dfe8ff" opacity="0.1" filter="url(#s4)"/>')
    s.a("".join(out))


def light(s):
    """The wave of krypton-86's orange-red light, and a ruler of its crests underneath."""
    n = (WX1 - WX0) / LAMBDA
    d = wave(WX0, WY, WX1, WY, 30, n, n=int(n * 20))
    s.a(f'<path d="{d}" fill="none" stroke="{ORANGE}" stroke-width="22" opacity="0.25" filter="url(#s8)"/>',
        f'<path d="{d}" fill="none" stroke="{ORANGE}" stroke-width="8" stroke-linecap="round"/>',
        f'<path d="{d}" fill="none" stroke="#ffc49a" stroke-width="2.5" stroke-linecap="round" opacity="0.85"/>')
    # the ruler: a line with a tick under every crest (crests where sin = 1, a quarter wave in)
    out = [f'<rect x="{WX0}" y="{RULER - 3}" width="{WX1 - WX0}" height="6" rx="3" fill="#ffb07a" opacity="0.7"/>']
    k = 0
    x = WX0 + LAMBDA * 0.75
    while x < WX1 - 4:
        big = k % 5 == 0
        out.append(f'<rect x="{f(x - 2)}" y="{RULER - (22 if big else 12)}" width="4" height="{22 if big else 12}" fill="#ffd2b0" '
                   f'opacity="{0.95 if big else 0.7}"/>')
        out.append(f'<line x1="{f(x)}" y1="{WY - 30}" x2="{f(x)}" y2="{RULER - (24 if big else 14)}" stroke="#ffb07a" stroke-width="1.5" '
                   'stroke-dasharray="2 5" opacity="0.4"/>')
        k += 1
        x += LAMBDA
    s.a("".join(out))


def bar_case(s):
    """The old metre: an X-section bar on two rollers in a velvet-lined case, seen a little from above."""
    s.d(lin("velvet", [(0, "#6a1a2a"), (1, "#2a0812")], x1=0, y1=0, x2=0, y2=1),
        lin("pt", [(0, "#d4d8e4"), (0.35, "#a4aabc"), (0.7, "#6a7086"), (1, "#3c4054")], x1=0, y1=0, x2=0, y2=1),
        lin("caseW", [(0, "#4a2c1c"), (1, "#22140c")], x1=0, y1=0, x2=0, y2=1))
    cx0, cx1, cy0, cy1 = BX0 - 60, BX1 + 60, BY - 70, BY + 110
    out = [f'<ellipse cx="{(cx0 + cx1) / 2}" cy="{cy1 + 8}" rx="{(cx1 - cx0) / 2 + 20}" ry="14" fill="#000" opacity="0.4"/>',
           # the case's open lid behind, then its box with velvet inside
           f'<path d="M{cx0 + 10},{cy0} L{cx0 + 40},{cy0 - 120} L{cx1 - 40},{cy0 - 120} L{cx1 - 10},{cy0} Z" fill="url(#caseW)"/>',
           f'<path d="M{cx0 + 24},{cy0 - 6} L{cx0 + 50},{cy0 - 106} L{cx1 - 50},{cy0 - 106} L{cx1 - 24},{cy0 - 6} Z" fill="url(#velvet)" opacity="0.9"/>',
           f'<rect x="{cx0}" y="{cy0}" width="{cx1 - cx0}" height="{cy1 - cy0}" rx="10" fill="url(#caseW)"/>',
           f'<rect x="{cx0 + 14}" y="{cy0 + 10}" width="{cx1 - cx0 - 28}" height="{cy1 - cy0 - 50}" rx="6" fill="url(#velvet)"/>',
           f'<rect x="{cx0}" y="{cy0}" width="{cx1 - cx0}" height="6" rx="3" fill="#8a5a3a" opacity="0.7"/>']
    # two rollers across the case (the bar rests on them at its Airy points)
    for rx in (BX0 + 0.21 * (BX1 - BX0), BX0 + 0.79 * (BX1 - BX0)):
        out.append(f'<rect x="{f(rx - 12)}" y="{BY + 14}" width="24" height="44" rx="12" fill="#8a8ea0"/>'
                   f'<rect x="{f(rx - 6)}" y="{BY + 18}" width="6" height="36" rx="3" fill="#d8dce8" opacity="0.5"/>')
    # the bar: a top face, a front face, its X-shaped end on the right
    h = 30
    out.append(f'<rect x="{BX0}" y="{BY - 12}" width="{BX1 - BX0}" height="24" fill="url(#pt)"/>')
    out.append(f'<rect x="{BX0}" y="{BY + 12}" width="{BX1 - BX0}" height="{h - 8}" fill="#4a4e62"/>')
    out.append(f'<rect x="{BX0}" y="{BY - 12}" width="{BX1 - BX0}" height="4" fill="#e8ecf4" opacity="0.5"/>')
    # the groove along the top (the X's upper notch), where the lines are engraved on the neutral plane
    out.append(f'<rect x="{BX0}" y="{BY - 4}" width="{BX1 - BX0}" height="8" fill="#5a6076"/>')
    # the end: an X-section (Tresca's shape)
    ex, ey, k = BX1 + 15, BY + 6, 1.5
    xs = TRESCA
    out.append(f'<polygon points="{P([(ex + x * k, ey + y * k) for x, y in xs])}" fill="#9aa0b4" stroke="#3c4054" stroke-width="1.5"/>')
    # the two fine lines a metre apart, glowing so they read
    for x in (BX0 + 18, BX1 - 18):
        out.append(f'<rect x="{x - 1.5}" y="{BY - 4}" width="3" height="8" fill="#fff0e0"/>' + glow(x, BY, 9, ORANGE, 0.8, "s2"))
    s.a("".join(out))
    # dashed guides from two ticks of the light down to the bar's lines
    for x in (BX0 + 18, BX1 - 18):
        s.a(f'<line x1="{x}" y1="{RULER + 6}" x2="{x}" y2="{BY - 10}" stroke="#ffd2b0" stroke-width="3" stroke-dasharray="8 7" opacity="0.8"/>',
            f'<circle cx="{x}" cy="{RULER}" r="7" fill="none" stroke="#ffe8d4" stroke-width="3"/>')


def closeup(s):
    """The bar's end, magnified: the X-shaped section and a fine line on the middle of the groove."""
    cx, cy, R = 1052, 452, 116
    opening, closing = magnifier(s, "magB", cx, cy, R, COLOR, src=(BX1 + 6, BY + 4, 30), inner="#171a34")
    body = []
    k = 8.2
    ox, oy = cx, cy + 6
    xs = TRESCA
    body.append(f'<polygon points="{P([(ox + x * k, oy + y * k) for x, y in xs])}" fill="url(#pt)" stroke="#e0e4ee" stroke-width="3"/>')
    # the groove's floor with its line, at the bar's mid-height (its neutral plane)
    body.append(f'<rect x="{f(ox - 1.5 * k)}" y="{f(oy - 3)}" width="{f(3 * k)}" height="6" fill="#fff0e0"/>'
                + glow(ox, oy, 14, ORANGE, 0.9, "s4"))
    s.a(opening, "".join(body), closing)


def build():
    s = Svg("Kr", COLOR)
    kdefs(s)
    background(s, glows=[(140, WY, 260, 0.6), (700, WY, 420, 0.35)], seed=1960, stars=55, star_box=(0, 0, 1200, 560), bokeh=4)
    lamp(s)
    light(s)
    bar_case(s)
    closeup(s)
    finish(s)
    s.save("metre")


if __name__ == "__main__":
    build()
