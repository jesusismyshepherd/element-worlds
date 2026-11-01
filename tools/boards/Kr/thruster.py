"""Board 'thruster': in orbit over the Earth's night side, a flat internet satellite with one long solar wing
pushes itself along on a soft blue-violet plume of krypton. Far off, a fresh row of its sisters strings
across the sky like pearls. A close-up of the thruster cut through: krypton atoms drift in from the anode,
electrons caught circling by the magnets knock an electron off each, and the krypton ions race out of the
channel, a cathode beside the exit sending electrons after them."""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from krkit import *  # noqa: E402,F401

COLOR = "#4fa3ff"
PLUME = "#8f86ff"
ELEC = "#a8ecff"
NOZ = (640, 362)  # the thruster's exit on the satellite


def earth(s):
    """The night side's curve along the bottom, a thin blue rim of air, a few city lights."""
    cx, cy, r = 600, 2600, 2050
    s.d(rad("earthN", [(0.9, "#0c1a3a"), (0.985, "#1c3a6a"), (1, "#3a7ad0")], cx=cx, cy=cy, r=r, user=True))
    s.a(f'<circle cx="{cx}" cy="{cy}" r="{r + 26}" fill="#4f9cff" opacity="0.18" filter="url(#s16)"/>',
        f'<circle cx="{cx}" cy="{cy}" r="{r + 6}" fill="#7ab8ff" opacity="0.5" filter="url(#s2)"/>',
        f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="url(#earthN)"/>')
    rr = rng(550)
    for _ in range(90):
        a = math.radians(rr.uniform(-100, -80))
        d = r - rr.uniform(8, 90)
        x, y = cx + math.cos(a) * d, cy + math.sin(a) * d
        if 0 < x < 1200 and y < 640:
            s.a(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(rr.uniform(0.8, 2))}" fill="#ffd27a" opacity="{rr.uniform(0.4, 0.85):.2f}"/>')


def train(s):
    """A row of satellites just launched, strung across the sky."""
    for k in range(22):
        t = k / 21
        x = 640 + t * 540
        y = 56 + t * 150 + math.sin(t * 3) * 6
        s.a(glow(x, y, 6, "#dfe8ff", 0.5, "s2"), f'<circle cx="{f(x)}" cy="{f(y)}" r="2.6" fill="#eef4ff"/>')


def plume(s):
    """The thruster's glow: a fan of blue-violet light, with ions streaking out in it."""
    x0, y0 = NOZ
    s.d(lin("plumeG", [(0, "#d8d0ff", 0.9), (0.15, PLUME, 0.7), (0.6, "#5a4ad8", 0.25), (1, "#3a2aa8", 0)],
            x1=x0, y1=y0, x2=170, y2=y0, user=True))
    s.a(f'<path d="M{x0},{y0 - 16} L170,{y0 - 120} Q120,{y0} 170,{y0 + 110} L{x0},{y0 + 16} Z" fill="url(#plumeG)" filter="url(#s16)"/>',
        f'<path d="M{x0},{y0 - 8} L330,{y0 - 50} Q300,{y0} 330,{y0 + 46} L{x0},{y0 + 8} Z" fill="url(#plumeG)" filter="url(#s4)"/>',
        f'<path d="M{x0},{y0 - 4} L460,{y0 - 14} Q450,{y0} 460,{y0 + 14} L{x0},{y0 + 4} Z" fill="#c8c0ff" opacity="0.55" filter="url(#s4)"/>')
    r = rng(16)
    for _ in range(26):
        t = r.uniform(0.05, 0.9)
        x = x0 - t * 460
        spread = 14 + t * 90
        y = y0 + r.uniform(-spread, spread)
        rr = 3.2 - t * 1.2
        s.a(f'<line x1="{f(x)}" y1="{f(y)}" x2="{f(x + 26 + t * 20)}" y2="{f(y + (y - y0) * 0.05)}" stroke="#c8c0ff" stroke-width="1.6" '
            f'opacity="{0.6 - t * 0.4:.2f}" stroke-linecap="round"/>',
            f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(rr)}" fill="#cfefff" opacity="{0.9 - t * 0.5:.2f}"/>')


def satellite(s):
    """A flat box with one long solar wing."""
    s.d(lin("cells", [(0, "#1a3a8a"), (0.5, "#2a5ac0"), (1, "#14306a")], x1=0, y1=0, x2=1, y2=1),
        lin("chassisT", [(0, "#a8b0c4"), (1, "#6a7288")], x1=0, y1=0, x2=1, y2=0),
        lin("chassisF", [(0, "#4a5268"), (1, "#2a3044")], x1=0, y1=0, x2=0, y2=1))
    x0, x1, y0, y1 = 640, 840, 342, 382
    dx, dy = 44, -34
    # the wing: a boom from the top, then a long panel of cells leaning back
    s.a(f'<rect x="{x1 + 6}" y="{y0 - 18}" width="44" height="6" fill="#8a92a8"/>')
    A, B, C, D = (890, 300), (1188, 228), (1196, 300), (898, 370)
    s.a(f'<polygon points="{P([A, B, C, D])}" fill="url(#cells)" stroke="#8aa8e0" stroke-width="2"/>')
    for k in range(1, 12):
        t = k / 12
        p0 = (A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t)
        p1 = (D[0] + (C[0] - D[0]) * t, D[1] + (C[1] - D[1]) * t)
        s.a(f'<line x1="{f(p0[0])}" y1="{f(p0[1])}" x2="{f(p1[0])}" y2="{f(p1[1])}" stroke="#6a8ad0" stroke-width="1.4" opacity="0.7"/>')
    for t in (1 / 3, 2 / 3):
        p0 = (A[0] + (D[0] - A[0]) * t, A[1] + (D[1] - A[1]) * t)
        p1 = (B[0] + (C[0] - B[0]) * t, B[1] + (C[1] - B[1]) * t)
        s.a(f'<line x1="{f(p0[0])}" y1="{f(p0[1])}" x2="{f(p1[0])}" y2="{f(p1[1])}" stroke="#6a8ad0" stroke-width="1.4" opacity="0.7"/>')
    s.a(f'<polygon points="{P([A, B, (B[0], B[1] + 8), (A[0], A[1] + 8)])}" fill="#bcd4ff" opacity="0.25"/>')
    # the chassis: top face, front face, end face
    s.a(f'<polygon points="{P([(x0, y0), (x1, y0), (x1 + dx, y0 + dy), (x0 + dx, y0 + dy)])}" fill="url(#chassisT)"/>',
        f'<rect x="{x0}" y="{y0}" width="{x1 - x0}" height="{y1 - y0}" fill="url(#chassisF)"/>',
        f'<polygon points="{P([(x1, y0), (x1 + dx, y0 + dy), (x1 + dx, y1 + dy), (x1, y1)])}" fill="#3a4258"/>')
    # antennas on top, a thin edge light
    for k, ax in enumerate((690, 740, 790)):
        s.a(f'<ellipse cx="{ax + 18}" cy="{y0 - 14}" rx="16" ry="6" fill="#d8dce8" opacity="0.8"/>')
    s.a(f'<rect x="{x0}" y="{y0}" width="{x1 - x0}" height="2" fill="#e8ecf4" opacity="0.6"/>')
    # the thruster's ring at the left end, glowing
    nx, ny = NOZ
    s.a(glow(nx, ny, 26, PLUME, 0.8, "s4"),
        f'<ellipse cx="{nx}" cy="{ny}" rx="7" ry="17" fill="#2a2a4a" stroke="#c8c0ff" stroke-width="3"/>',
        f'<ellipse cx="{nx}" cy="{ny}" rx="4" ry="11" fill="#e0dcff"/>')


def closeup(s):
    """The thruster cut through: anode on the right, magnets in the walls, electrons circling, ions out left."""
    cx, cy, R = 262, 184, 146
    opening, closing = magnifier(s, "magT", cx, cy, R, COLOR, src=(NOZ[0] - 2, NOZ[1], 22), inner="#141a3a")
    body = []
    wall = 44
    ch0 = cx - 14  # the channel's exit
    # the channel's walls (ceramic) with magnets behind them, and the anode at the back
    for sgn in (-1, 1):
        y = cy + sgn * (wall + 20)
        body.append(f'<rect x="{ch0}" y="{y - 20}" width="{R + 60}" height="40" fill="#b8b0a4"/>')
        body.append(f'<rect x="{ch0 + 8}" y="{y + (8 if sgn > 0 else -26)}" width="{R + 60}" height="18" '
                    f'fill="{"#d84a4a" if sgn < 0 else "#4a6ad8"}" opacity="0.9"/>')
    body.append(f'<rect x="{cx + 88}" y="{cy - wall}" width="18" height="{2 * wall}" fill="#d8a84a"/>')
    # magnetic field lines across the channel
    for x in (ch0 + 14, ch0 + 44, ch0 + 74):
        body.append(f'<line x1="{x}" y1="{cy - wall}" x2="{x}" y2="{cy + wall}" stroke="#ff8aa0" stroke-width="2" stroke-dasharray="5 5" opacity="0.6"/>')
    # krypton atoms drifting in from the anode
    for (x, y) in ((cx + 70, cy - 20), (cx + 64, cy + 22), (cx + 44, cy)):
        body.append(kball(x, y, 13, "Kr"))
    # electrons caught circling near the exit (small loops seen side on)
    for (x, y) in ((ch0 + 12, cy - 24), (ch0 + 30, cy + 14), (ch0 + 50, cy - 6), (ch0 + 6, cy + 30)):
        body.append(f'<ellipse cx="{x}" cy="{y}" rx="13" ry="6" fill="none" stroke="{ELEC}" stroke-width="2" opacity="0.65"/>'
                    f'<circle cx="{x + 12}" cy="{y}" r="4.5" fill="{ELEC}"/>')
    # krypton ions racing out to the left, the + on each
    for (x, y, L) in ((ch0 - 22, cy - 14, 30), (ch0 - 52, cy + 16, 36), (ch0 - 80, cy - 26, 34), (ch0 - 74, cy + 46, 28)):
        body.append(streak(x, y, 13, 180, L, "#c8c0ff", 0.65, 3) + kball(x, y, 13, "Kr") + charge(x + 1, y + 1, 12, "+"))
    # the cathode below the exit, sending electrons into the beam
    body.append(f'<rect x="{ch0 - 20}" y="{cy + wall + 44}" width="70" height="16" rx="6" fill="#8a92a8"/>')
    for (x, y) in ((ch0 - 34, cy + wall + 30), (ch0 - 52, cy + wall + 6)):
        body.append(f'<circle cx="{x}" cy="{y}" r="4.5" fill="{ELEC}"/>')
    body.append(arrow([(ch0 - 22, cy + wall + 42), (ch0 - 40, cy + wall + 26), (ch0 - 62, cy + wall - 2)], ELEC, 2.5, op=0.7))
    zoom = f'<g transform="translate({cx} {cy}) scale(1.22) translate({-(cx + 6)} {-(cy + 10)})">'
    s.a(opening, zoom, "".join(body), "</g>", closing)


def build():
    s = Svg("Kr", COLOR)
    kdefs(s)
    background(s, glows=[(400, 360, 320, 0.45), (960, 300, 260, 0.3)], seed=2019, stars=110, star_box=(0, 0, 1200, 560), bokeh=0)
    earth(s)
    train(s)
    plume(s)
    satellite(s)
    closeup(s)
    finish(s)
    s.save("thruster")


if __name__ == "__main__":
    build()
