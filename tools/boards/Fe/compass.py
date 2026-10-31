"""Board 'compass': the Earth as a giant magnet. Its magnetic field's lines loop out of one end and into the
other, little arrows on them pointing north. A close-up of the outer core: liquid iron swirling round in
columns (curling arrows through glowing orange metal, iron atoms tumbling along). In front, a big brass
compass on a ship's chart, its red needle pointing north like the field."""
import math
import os
import random
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from lib.style import *  # noqa: E402,F401

TEAL = "#3fd6c6"


def field_lines(s, cx, cy, R):
    """A dipole's field lines, r = L sin^2(theta), each side, with arrows pointing north (up) outside."""
    out = []
    # squeezed sideways (as a book draws a magnet's field), so the loops leave near the poles and still fit
    sx = 0.6
    for k, L in enumerate((1.9, 2.7, 3.9, 5.6)):
        for side in (-1, 1):
            pts = []
            for i in range(0, 181, 2):
                th = math.radians(i)
                r = L * R * math.sin(th) ** 2
                if r < R * 0.99:
                    continue
                pts.append((cx + side * r * math.sin(th) * sx, cy - r * math.cos(th)))
            if len(pts) < 3:
                continue
            op = 0.8 - k * 0.12
            out.append(f'<path d="{smooth(pts, closed=False)}" fill="none" stroke="{TEAL}" stroke-width="{f(5 - k * 0.6)}" '
                       f'stroke-linecap="round" opacity="{op:.2f}" filter="url(#g1)"/>')
            # an arrow at the line's widest point (the equator), pointing up: the field outside runs from
            # the south up to the north
            x = cx + side * L * R * sx
            out.append(arrow([(x, cy + 14), (x, cy - 14)], mix(TEAL, "#ffffff", 0.35), w=5, head=18, op=min(1, op + 0.15)))
    s.a("".join(out))


def earth(s, cx, cy, R, rnd):
    s.d(rad("ocean", [(0, "#3a8ae0"), (0.7, "#1f5aa8"), (1, "#123a78")], cx=0.38, cy=0.35, r=0.75),
        f'<clipPath id="earthClip"><circle cx="{f(cx)}" cy="{f(cy)}" r="{f(R)}"/></clipPath>',
        rad("night", [(0.5, "#000814", 0), (1, "#000814", 0.62)], cx=0.32, cy=0.3, r=0.9))
    out = [glow(cx, cy, R * 1.08, "#7fe0ff", 0.4, "s16"), f'<circle cx="{f(cx)}" cy="{f(cy)}" r="{f(R)}" fill="url(#ocean)"/>']
    land = []
    for (dx, dy, rr, col) in ((-0.35, -0.42, 0.34, "#4a9a3a"), (0.3, -0.2, 0.3, "#5aaa42"), (-0.2, 0.3, 0.28, "#8a7a3a"),
                              (0.42, 0.42, 0.2, "#4a9a3a")):
        pts = []
        for k in range(10):
            a = k / 10 * math.tau
            q = rr * R * rnd.uniform(0.7, 1.15)
            pts.append((cx + dx * R + math.cos(a) * q, cy + dy * R + math.sin(a) * q * 0.8))
        land.append(f'<path d="{smooth(pts)}" fill="{col}"/>')
    # the ice caps
    land.append(f'<ellipse cx="{f(cx)}" cy="{f(cy - R * 0.98)}" rx="{f(R * 0.45)}" ry="{f(R * 0.14)}" fill="#c8dcef"/>')
    land.append(f'<ellipse cx="{f(cx)}" cy="{f(cy + R * 0.98)}" rx="{f(R * 0.5)}" ry="{f(R * 0.16)}" fill="#c8dcef"/>')
    for (dx, dy, w) in ((-0.5, -0.1, 0.32), (0.2, 0.1, 0.28), (-0.1, 0.62, 0.3)):
        land.append(f'<ellipse cx="{f(cx + dx * R)}" cy="{f(cy + dy * R)}" rx="{f(w * R)}" ry="{f(w * R * 0.16)}" fill="#e8f0ff" opacity="0.45"/>')
    out.append('<g clip-path="url(#earthClip)">' + "".join(land) + "</g>")
    out.append(f'<circle cx="{f(cx)}" cy="{f(cy)}" r="{f(R)}" fill="url(#night)"/>')
    s.a("".join(out))


def core_closeup(s, cx, cy, r, rnd):
    """The outer core up close: glowing orange liquid iron, curling columns of flow, iron atoms swept along."""
    s.d(rad("liquidFe", [(0, "#ffb347"), (0.55, "#e8641c"), (1, "#8a2a0c")], cx=0.45, cy=0.45, r=0.7))
    out = [f'<rect x="{f(cx - r)}" y="{f(cy - r)}" width="{f(2 * r)}" height="{f(2 * r)}" fill="url(#liquidFe)"/>']
    # two columns of swirling metal, side by side, turning opposite ways
    for (ox, sense) in ((-0.42, 1), (0.42, -1)):
        x0 = cx + ox * r
        for k in range(3):
            rr = r * (0.18 + k * 0.11)
            a0, a1 = (20 + k * 40) * sense, (290 + k * 40) * sense
            pts = []
            for i in range(25):
                a = math.radians(a0 + (a1 - a0) * i / 24)
                pts.append((x0 + math.cos(a) * rr, cy + math.sin(a) * rr * 1.35))
            out.append(arrow(pts, "#ffe1a0", w=5, head=16, op=0.8))
    # iron atoms tumbling along in the flow
    for _ in range(16):
        a = rnd.uniform(0, math.tau)
        q = rnd.uniform(0.1, 0.95) * r
        x, y = cx + math.cos(a) * q, cy + math.sin(a) * q
        out.append(ball(x, y, rnd.uniform(9, 13), "Fe"))
    s.a("".join(out))


def compass(s, cx, cy, R):
    """A brass compass seen from above, tilted a little: a dark dial, a star of points, the red north end of
    the needle pointing up."""
    s.d(rad("brass", [(0, "#ffe7a0"), (0.5, "#d0a040"), (1, "#7a5418")], cx=0.35, cy=0.3, r=0.8),
        rad("dial", [(0, "#24305a"), (1, "#121a38")], cx=0.45, cy=0.4, r=0.7))
    sy = 0.62  # seen from above at a slant: squashed vertically
    out = [f'<ellipse cx="{f(cx + 8)}" cy="{f(cy + R * sy + 16)}" rx="{f(R * 1.02)}" ry="{f(R * sy * 0.5)}" fill="#000" opacity="0.4" filter="url(#s8)"/>',
           # the case's side, then its rim and dial
           f'<ellipse cx="{f(cx)}" cy="{f(cy + 18)}" rx="{f(R)}" ry="{f(R * sy)}" fill="#6a4a14"/>',
           f'<ellipse cx="{f(cx)}" cy="{f(cy)}" rx="{f(R)}" ry="{f(R * sy)}" fill="url(#brass)" stroke="#5a3c10" stroke-width="2"/>',
           f'<ellipse cx="{f(cx)}" cy="{f(cy)}" rx="{f(R * 0.86)}" ry="{f(R * 0.86 * sy)}" fill="url(#dial)"/>']
    # ticks round the dial
    for k in range(32):
        a = k / 32 * math.tau
        r0, r1 = R * (0.74 if k % 8 == 0 else 0.79), R * 0.84
        out.append(f'<line x1="{f(cx + math.cos(a) * r0)}" y1="{f(cy + math.sin(a) * r0 * sy)}" x2="{f(cx + math.cos(a) * r1)}" '
                   f'y2="{f(cy + math.sin(a) * r1 * sy)}" stroke="#e8d49a" stroke-width="{3 if k % 8 == 0 else 1.5}" opacity="0.8"/>')
    # the compass rose: four long points and four short
    for k in range(8):
        a = k / 8 * math.tau - math.pi / 2
        L = R * (0.66 if k % 2 == 0 else 0.4)
        w = R * 0.1
        tip = (cx + math.cos(a) * L, cy + math.sin(a) * L * sy)
        l = (cx + math.cos(a + math.pi / 2) * w, cy + math.sin(a + math.pi / 2) * w * sy)
        rr = (cx + math.cos(a - math.pi / 2) * w, cy + math.sin(a - math.pi / 2) * w * sy)
        out.append(f'<polygon points="{P([tip, l, (cx, cy)])}" fill="#3a4a7a"/><polygon points="{P([tip, rr, (cx, cy)])}" fill="#5a6ca8"/>')
    # the needle: red north end pointing up the board (north), pale south end
    nw = R * 0.075
    nN = (cx, cy - R * 0.7 * sy)
    nS = (cx, cy + R * 0.7 * sy)
    out.append(f'<polygon points="{P([nN, (cx - nw, cy), (cx + nw, cy)])}" fill="#ff3b3b" filter="url(#g1)"/>')
    out.append(f'<polygon points="{P([nS, (cx - nw, cy), (cx + nw, cy)])}" fill="#b8c2d6"/>')
    out.append(f'<circle cx="{f(cx)}" cy="{f(cy)}" r="{f(R * 0.06)}" fill="url(#brass)" stroke="#5a3c10" stroke-width="1.5"/>')
    # the glass's shine
    out.append(f'<path d="M{f(cx - R * 0.6)},{f(cy - R * 0.25 * sy)} A{f(R * 0.75)},{f(R * 0.75 * sy)} 0 0 1 {f(cx + R * 0.1)},{f(cy - R * 0.72 * sy)}" '
               f'fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" opacity="0.35"/>')
    # the ring on top for a lanyard
    out.append(f'<ellipse cx="{f(cx)}" cy="{f(cy - R * sy - 8)}" rx="16" ry="10" fill="none" stroke="url(#brass)" stroke-width="6"/>')
    s.a("".join(out))


def build():
    s = Svg("Fe", TEAL)
    background(s, glows=[(380, 300, 380, 0.7), (980, 200, 260, 0.5)], seed=1600, stars=110, star_box=(0, 0, 1200, 620), bokeh=4)
    rnd = random.Random(1088)

    ex, ey, er = 360, 300, 135
    field_lines(s, ex, ey, er)
    earth(s, ex, ey, er, rnd)

    # the close-up of the outer core, from a spot inside the Earth
    opening, closing = magnifier(s, "zoomCore", 960, 190, 135, "#ff9a3c", src=(ex + er * 0.25, ey + er * 0.05, 26))
    s.a(opening)
    core_closeup(s, 960, 190, 135, rnd)
    s.a(closing)

    # a ship's chart on a table, and the compass on it
    s.a('<path d="M560,470 L1180,452 L1200,640 L540,660Z" fill="#a8885a" opacity="0.38"/>')
    for k in range(1, 6):
        x0, x1 = 560 + k * 103, 540 + k * 110
        s.a(f'<line x1="{x0}" y1="{470 - k * 3}" x2="{x1}" y2="{660 - k * 4}" stroke="#e8d4a8" stroke-width="1.5" opacity="0.25"/>')
    s.a('<path d="M560,560 C620,540 640,600 700,590 C760,580 740,620 800,640" fill="#5aa86a" opacity="0.3"/>',
        '<path d="M600,520 C700,500 760,560 880,530 C980,505 1060,560 1150,520" fill="none" stroke="#8ad8ff" stroke-width="3" '
        'stroke-dasharray="10 8" opacity="0.55"/>')
    compass(s, 860, 470, 150)
    finish(s)
    s.save("compass")


if __name__ == "__main__":
    build()
