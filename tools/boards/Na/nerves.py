"""Board 'nerves': a nerve cell firing. The signal runs along its axon as a bright pulse; at the pulse,
sodium ions (violet) rush in through the gaps between the myelin. A close-up of the membrane there: an
open sodium channel letting Na+ in, and the sodium-potassium pump sending 3 Na+ out and 2 K+ in."""
import math
import os
import random
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from lib.style import *  # noqa: E402,F401

PINK = "#ff6fa8"
ELECTRIC = "#fff4a0"

# the axon: one cubic curve from the cell body to its endings
A0, A1, A2, A3 = (262, 352), (520, 372), (700, 600), (1060, 520)


def table(n=400):
    """Points along the axon by arc length (so the myelin's segments come out even)."""
    pts = [bez(A0, A1, A2, A3, i / n) for i in range(n + 1)]
    acc = [0.0]
    for i in range(1, len(pts)):
        acc.append(acc[-1] + math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
    return pts, acc


PTS, ACC = table()
LEN = ACC[-1]


def at(d):
    """The point (x, y, heading) at distance d along the axon."""
    d = max(0, min(LEN, d))
    for i in range(1, len(ACC)):
        if ACC[i] >= d:
            k = (d - ACC[i - 1]) / max(1e-6, ACC[i] - ACC[i - 1])
            p, q = PTS[i - 1], PTS[i]
            return p[0] + (q[0] - p[0]) * k, p[1] + (q[1] - p[1]) * k, q[2]
    return PTS[-1]


def piece(d0, d1, step=6):
    n = max(2, int((d1 - d0) / step))
    return [at(d0 + (d1 - d0) * i / n)[:2] for i in range(n + 1)]


def branch(out, x, y, ang, length, width, depth, rnd, col, hi):
    """A dendrite: a tapering curve that splits in two."""
    a = math.radians(ang)
    bend = rnd.uniform(-0.35, 0.35)
    mx, my = x + math.cos(a + bend) * length * 0.5, y + math.sin(a + bend) * length * 0.5
    ex, ey = x + math.cos(a) * length, y + math.sin(a) * length
    out.append(f'<path d="M{f(x)},{f(y)} Q{f(mx)},{f(my)} {f(ex)},{f(ey)}" fill="none" stroke="{col}" '
               f'stroke-width="{f(width)}" stroke-linecap="round"/>')
    out.append(f'<path d="M{f(x)},{f(y)} Q{f(mx)},{f(my)} {f(ex)},{f(ey)}" fill="none" stroke="{hi}" '
               f'stroke-width="{f(max(1.2, width * 0.35))}" stroke-linecap="round" opacity="0.55" transform="translate(-1.5,-2)"/>')
    if depth > 0:
        for s in (-1, 1):
            branch(out, ex, ey, ang + s * rnd.uniform(22, 38), length * rnd.uniform(0.58, 0.72), width * 0.62,
                   depth - 1, rnd, col, hi)
    else:
        out.append(f'<circle cx="{f(ex)}" cy="{f(ey)}" r="{f(width * 0.9)}" fill="{hi}" opacity="0.7"/>')


def build():
    s = Svg("Na", PINK)
    background(s, glows=[(220, 340, 360, 0.85), (560, 470, 300, 0.7), (870, 230, 330, 0.6)], seed=17, stars=55,
               star_box=(0, 0, 1200, 600), bokeh=7)
    rnd = random.Random(5)
    s.d(rad("soma", [(0, "#ffe6f1"), (0.45, "#ff8fbd"), (0.85, "#d83f82"), (1, "#a52463")], cx=0.42, cy=0.38, r=0.65),
        rad("nucl", [(0, "#d8a6ff"), (0.6, "#8a3fc8"), (1, "#56207f")], cx=0.4, cy=0.36, r=0.7),
        rad("pulse", [(0, "#ffffff"), (0.25, "#fffbd6"), (0.55, ELECTRIC, 0.7), (1, ELECTRIC, 0)]),
        lin("outside", [(0, "#3a2a78"), (1, "#2a2060")], x1=0, y1=0, x2=0, y2=1),
        lin("inside", [(0, "#5a2050"), (1, "#3a1238")], x1=0, y1=0, x2=0, y2=1))

    # ---------- dendrites (behind the cell body)
    den = []
    for ang, ln in ((-160, 105), (-118, 98), (-70, 90), (150, 100), (112, 92), (-200, 80), (70, 70)):
        a = math.radians(ang)
        x, y = 200 + math.cos(a) * 60, 340 + math.sin(a) * 52
        branch(den, x, y, ang, ln, 15, 2, rnd, "#e8478d", "#ffc2dc")
    s.a('<g>' + "".join(den) + '</g>')

    # ---------- the axon: a pink core, the myelin's segments over it, the nodes between
    core = piece(0, LEN)
    s.a(f'<path d="{smooth(core, closed=False)}" fill="none" stroke="#c43477" stroke-width="20" stroke-linecap="round"/>',
        f'<path d="{smooth(core, closed=False)}" fill="none" stroke="#ff9cc6" stroke-width="7" stroke-linecap="round" '
        f'opacity="0.7" transform="translate(-1,-3)"/>')
    seg, gap = 92, 22
    pulse_d = 2 * (seg + gap) + seg + gap / 2 + 120  # the node where the pulse is now
    nodes = []
    d = 70
    while d + seg < LEN - 40:
        pts = piece(d, d + seg)
        passed = d + seg < pulse_d
        # kept under the hall's bloom (it starts at a luminance of 0.78), or the whole nerve glows white
        body = "#f0c4d8" if not passed else "#f2dc96"
        edge = "#c87ea2" if not passed else "#d8a848"
        s.a(f'<path d="{smooth(pts, closed=False)}" fill="none" stroke="{edge}" stroke-width="46" stroke-linecap="round"/>',
            f'<path d="{smooth(pts, closed=False)}" fill="none" stroke="{body}" stroke-width="40" stroke-linecap="round"/>',
            f'<path d="{smooth(pts, closed=False)}" fill="none" stroke="#ffffff" stroke-width="8" stroke-linecap="round" '
            f'opacity="0.55" transform="translate(-2,-9)"/>')
        nodes.append(d + seg + gap / 2)
        d += seg + gap
    # the signal behind the pulse: the axon glows where it has passed, fading back
    for k in range(10):
        d0 = pulse_d - 260 + k * 26
        if d0 < 0:
            continue
        pts = piece(d0, d0 + 26)
        s.a(f'<path d="{smooth(pts, closed=False)}" fill="none" stroke="{ELECTRIC}" stroke-width="{f(14 + k * 1.2)}" '
            f'stroke-linecap="round" opacity="{0.06 + k * 0.05:.2f}" filter="url(#s4)"/>')

    # ---------- the endings: branches with round buttons, little sparks of the message passed on
    ex, ey, _ = at(LEN)
    for ang, ln in ((-48, 70), (-12, 84), (24, 74), (60, 62)):
        a = math.radians(ang)
        tx, ty = ex + math.cos(a) * ln, ey + math.sin(a) * ln
        s.a(f'<path d="M{f(ex)},{f(ey)} Q{f(ex + math.cos(a) * ln * 0.5)},{f(ey + math.sin(a) * ln * 0.5 - 12)} {f(tx)},{f(ty)}" '
            f'fill="none" stroke="#e8478d" stroke-width="10" stroke-linecap="round"/>',
            f'<circle cx="{f(tx)}" cy="{f(ty)}" r="15" fill="url(#soma)" stroke="#a52463" stroke-width="2"/>')
        for j in range(3):
            sx, sy = tx + math.cos(a) * (26 + j * 12) + rnd.uniform(-6, 6), ty + math.sin(a) * (26 + j * 12) + rnd.uniform(-6, 6)
            s.a(f'<circle cx="{f(sx)}" cy="{f(sy)}" r="{f(4 - j)}" fill="{ELECTRIC}" opacity="{0.9 - j * 0.25:.2f}"/>')

    # ---------- the cell body
    blob = []
    for i in range(10):
        a = i / 10 * math.pi * 2
        r = 78 + 9 * math.sin(i * 2.3) + rnd.uniform(-4, 4)
        blob.append((200 + math.cos(a) * r * 1.08, 340 + math.sin(a) * r * 0.92))
    s.a(f'<path d="{smooth(blob)}" fill="#e8478d" opacity="0.5" filter="url(#s8)" transform="translate(4,8)"/>',
        f'<path d="{smooth(blob)}" fill="url(#soma)" stroke="#a52463" stroke-width="3"/>',
        '<circle cx="188" cy="332" r="31" fill="url(#nucl)" stroke="#4a1a6a" stroke-width="2"/>',
        '<circle cx="180" cy="326" r="8" fill="#e9c8ff" opacity="0.8"/>')

    # ---------- the pulse at its node, sparks around it
    px, py, ph = at(pulse_d)
    s.a(f'<circle cx="{f(px)}" cy="{f(py)}" r="92" fill="url(#pulse)"/>',
        f'<circle cx="{f(px)}" cy="{f(py)}" r="24" fill="#ffffff" filter="url(#g2)"/>')
    for k in range(7):
        a = math.radians(k * 51 + 10)
        r0, r1 = 34, 62 + (k % 3) * 10
        mid = (px + math.cos(a + 0.25) * (r0 + r1) / 2, py + math.sin(a + 0.25) * (r0 + r1) / 2)
        s.a(f'<polyline points="{P([(px + math.cos(a) * r0, py + math.sin(a) * r0), mid, (px + math.cos(a) * r1, py + math.sin(a) * r1)])}" '
            f'fill="none" stroke="#fffbd6" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>')
    # sodium ions rushing in at the node, from above and below, with their trails
    nrm = math.radians(ph + 90)
    for side, k, off, dist in ((-1, 0, -34, 132), (-1, 1, 10, 150), (-1, 2, 52, 124), (1, 0, -50, 100), (1, 1, 0, 116), (1, 2, 50, 100)):
        tx = px + math.cos(math.radians(ph)) * off + math.cos(nrm) * side * dist
        ty = py + math.sin(math.radians(ph)) * off + math.sin(nrm) * side * dist
        hx = px + (tx - px) * 0.42
        hy = py + (ty - py) * 0.42
        s.a(f'<line x1="{f(tx)}" y1="{f(ty)}" x2="{f(hx)}" y2="{f(hy)}" stroke="#d6a8ff" stroke-width="5" '
            f'stroke-linecap="round" stroke-dasharray="2 10" opacity="0.85"/>',
            ion(tx, ty, 21, "Na", "+"))

    # ---------- the close-up of the membrane at the pulse
    cx, cy, r = 880, 222, 168
    opening, closing = magnifier(s, "zoom", cx, cy, r, PINK, src=(px, py, 50))
    s.a(opening)
    my = cy + 8  # the membrane's middle
    s.a(f'<rect x="{cx - r}" y="{cy - r}" width="{2 * r}" height="{my - (cy - r) - 30}" fill="url(#outside)"/>',
        f'<rect x="{cx - r}" y="{my + 30}" width="{2 * r}" height="{cy + r - my - 30}" fill="url(#inside)"/>')
    chan_x, pump_x = cx - 70, cx + 52

    def free(x):
        return abs(x - chan_x) > 34 and abs(x - pump_x) > 50

    # the lipid bilayer: two rows of heads, tails meeting in the middle
    heads = []
    x = cx - r - 10
    while x < cx + r + 10:
        if free(x):
            for sgn in (-1, 1):
                hy = my + sgn * 24
                heads.append(f'<line x1="{f(x - 3)}" y1="{f(hy - sgn * 8)}" x2="{f(x - 3)}" y2="{f(my + sgn * 3)}" stroke="#f3c26b" stroke-width="2.5"/>'
                             f'<line x1="{f(x + 3)}" y1="{f(hy - sgn * 8)}" x2="{f(x + 3)}" y2="{f(my + sgn * 3)}" stroke="#f3c26b" stroke-width="2.5"/>'
                             f'<circle cx="{f(x)}" cy="{f(hy)}" r="9" fill="#ffd1e4" stroke="#c4568a" stroke-width="2"/>')
        x += 19
    s.a("".join(heads))
    # the sodium channel: two halves of a blue protein held open, sodium passing through
    for sgn in (-1, 1):
        hx = chan_x + sgn * 24
        s.a(f'<rect x="{f(hx - 14)}" y="{f(my - 46)}" width="28" height="92" rx="14" fill="#4aa8ff" stroke="#1f5fb0" stroke-width="3"/>',
            f'<rect x="{f(hx - 8)}" y="{f(my - 38)}" width="8" height="70" rx="4" fill="#bfe2ff" opacity="0.6"/>')
    # sodium pouring in through the open channel: a line of ions, the arrow beside them pointing in
    for k, yy in enumerate((my - 112, my - 58, my, my + 62)):
        s.a(ion(chan_x, yy, 19, "Na", "+"))
    s.a(f'<path d="M{chan_x - 34},{my + 96} L{chan_x},{my + 126} L{chan_x + 34},{my + 96}" fill="none" stroke="#ffe36e" '
        f'stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>')
    # the pump: a golden protein through the membrane, 3 Na+ going out over it, 2 K+ coming in under it
    s.a(f'<path d="{smooth([(pump_x - 40, my - 36), (pump_x, my - 50), (pump_x + 40, my - 36), (pump_x + 44, my + 36), (pump_x, my + 52), (pump_x - 44, my + 36)])}" '
        f'fill="#ffb84d" stroke="#a8620c" stroke-width="3"/>',
        f'<path d="M{pump_x - 24},{my - 30} Q{pump_x},{my - 40} {pump_x + 20},{my - 32}" fill="none" stroke="#ffe2a8" stroke-width="6" '
        f'stroke-linecap="round" opacity="0.8"/>')
    for dx in (-38, 0, 38):
        s.a(ion(pump_x + dx, my - 80, 17, "Na", "+"))
    s.a(f'<path d="M{pump_x - 18},{my - 124} L{pump_x},{my - 144} L{pump_x + 18},{my - 124}" fill="none" stroke="#ffe36e" '
        f'stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>')
    for dx in (-25, 25):
        s.a(ion(pump_x + dx, my + 84, 21, "K", "+"))
    s.a(f'<path d="M{pump_x - 18},{my + 120} L{pump_x},{my + 140} L{pump_x + 18},{my + 120}" fill="none" stroke="#ffe36e" '
        f'stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>')
    # a few more ions where they belong: sodium crowded outside, potassium inside
    for (x, y) in ((cx - 136, cy - 64), (cx - 140, cy - 10), (cx + 136, cy - 40)):
        s.a(ion(x, y, 14, "Na", "+", op=0.85))
    for (x, y) in ((cx - 130, cy + 92), (cx + 128, cy + 76)):
        s.a(ion(x, y, 17, "K", "+", op=0.85))
    s.a(closing)
    finish(s)
    s.save("nerves")


if __name__ == "__main__":
    build()
