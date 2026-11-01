"""Board 'hidden': London, May 1898, by gaslight. A silvered flask of liquid air boils away on the bench, its
nitrogen (blue pairs), oxygen (red pairs) and argon escaping in curling vapour; through the flask's clear
strip, the last drops. A close-up of those drops: a few heavy krypton atoms left behind while the last
nitrogen flies off. On the right the residue sealed in a little glass tube glows white-lilac, and a prism
spreads its light into a dark band with two lines nobody had seen: a yellow and a green."""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from krkit import *  # noqa: E402,F401

COLOR = "#a58cff"
BENCH = 560
FX, TOP, BOT, FW = 330, 262, 548, 92  # the flask: centre x, rim, bottom, half width


def flask(s):
    s.d(lin("silver", [(0, "#4a4670"), (0.18, "#a9a3cc"), (0.32, "#d6d0ee"), (0.5, "#8c86b4"), (0.78, "#5a5584"),
                       (1, "#2e2b4c")], x1=0, y1=0, x2=1, y2=0),
        lin("lair", [(0, "#b4d2ff"), (1, "#6f98e8")], x1=0, y1=0, x2=0, y2=1),
        lin("woodB", [(0, "#5a3a26"), (1, "#2c1b12")], x1=0, y1=0, x2=0, y2=1))
    x0, x1 = FX - FW, FX + FW
    body = (f"M{x0},{TOP} L{x0},{BOT - 60} Q{x0},{BOT} {FX},{BOT} Q{x1},{BOT} {x1},{BOT - 60} L{x1},{TOP} Z")
    out = [f'<ellipse cx="{FX}" cy="{BOT + 6}" rx="{FW + 30}" ry="12" fill="#000" opacity="0.35"/>',
           f'<path d="{body}" fill="url(#silver)"/>']
    # the clear strip down the front: inside it, the liquid at the bottom and its bubbles
    sx0, sx1 = FX - 20, FX + 20
    out.append(f'<rect x="{sx0}" y="{TOP + 14}" width="{sx1 - sx0}" height="{BOT - TOP - 40}" rx="8" fill="#141634"/>')
    lv = BOT - 92
    out.append(f'<rect x="{sx0 + 2}" y="{lv}" width="{sx1 - sx0 - 4}" height="{BOT - 28 - lv}" rx="6" fill="url(#lair)" opacity="0.9"/>')
    r = rng(18)
    for _ in range(9):
        bx, by = r.uniform(sx0 + 6, sx1 - 6), r.uniform(lv + 6, BOT - 34)
        out.append(f'<circle cx="{f(bx)}" cy="{f(by)}" r="{f(r.uniform(2, 4))}" fill="none" stroke="#e6f0ff" stroke-width="1.4" opacity="0.8"/>')
    out.append(f'<rect x="{sx0}" y="{TOP + 14}" width="{sx1 - sx0}" height="{BOT - TOP - 40}" rx="8" fill="none" stroke="#c9c2ee" '
               'stroke-width="2" opacity="0.6"/>')
    # the rim: the inner wall's mouth, dark inside, frost on the lip
    out.append(f'<ellipse cx="{FX}" cy="{TOP}" rx="{FW}" ry="18" fill="#c4bde4"/>'
               f'<ellipse cx="{FX}" cy="{TOP + 2}" rx="{FW - 12}" ry="12" fill="#1a1a3c"/>'
               f'<ellipse cx="{FX}" cy="{TOP + 6}" rx="{FW - 22}" ry="7" fill="#7aa2ee" opacity="0.5"/>')
    # a cork ring stand and the wooden block it sits on
    out.append(f'<rect x="{FX - FW - 26}" y="{BOT - 4}" width="{2 * FW + 52}" height="16" rx="4" fill="url(#woodB)"/>')
    # a long shine down the silver
    out.append(f'<rect x="{x0 + 22}" y="{TOP + 26}" width="10" height="{BOT - TOP - 110}" rx="5" fill="#ffffff" opacity="0.28"/>')
    s.a("".join(out))


def stand(s):
    """A retort stand behind the flask with a clamp round its neck."""
    rx = FX - FW - 70
    s.a(f'<rect x="{rx - 50}" y="{BENCH - 14}" width="120" height="14" rx="3" fill="#2a2440"/>',
        f'<rect x="{rx - 5}" y="{150}" width="10" height="{BENCH - 160}" fill="#6a6290"/>',
        f'<rect x="{rx}" y="{TOP + 40}" width="{FW + 70 - 12}" height="9" fill="#6a6290"/>',
        f'<rect x="{FX - FW - 16}" y="{TOP + 30}" width="20" height="30" rx="4" fill="#4a4268"/>')


def vapour(s):
    """Curling vapour from the mouth, and the gases of the air leaving in it."""
    r = rng(1898)
    s.d(lin("fog", [(0, "#e6e2ff", 0), (0.3, "#d8d0ff", 0.35), (1, "#d8d0ff", 0)], x1=0, y1=1, x2=0, y2=0))
    for k in range(6):
        x = FX - 50 + k * 22
        pts = [(x, TOP - 4)]
        for j in range(1, 7):
            pts.append((x - j * 26 + math.sin(j * 1.3 + k) * 26, TOP - j * 34))
        s.a(f'<path d="{smooth(pts, closed=False)}" fill="none" stroke="#d6ccff" stroke-width="{18 - k}" '
            f'stroke-linecap="round" opacity="0.2" filter="url(#s8)"/>')
    # the molecules flying up and away, most of them nitrogen
    mols = []
    for i in range(30):
        t = i / 29
        a = math.radians(-132 + t * 80 + r.uniform(-6, 6))
        d = 40 + (i * 37) % 290 + r.uniform(0, 20)
        x = FX + math.cos(a) * d * 1.05
        y = TOP - 26 + math.sin(a) * d * 0.78
        if y < 34 or x < 175 or x > 600:
            continue
        kind = "N" if r.random() < 0.7 else ("O" if r.random() < 0.8 else "Ar")
        mols.append((x, y, kind, math.degrees(a), r.uniform(0, 180)))
    for (x, y, kind, ang, rot) in mols:
        if kind == "Ar":
            s.a(streak(x, y, 9, ang, 30, "#e6dcff", 0.35), kball(x, y, 9, "Ar"))
        else:
            s.a(streak(x, y, 13, ang, 36, "#e6dcff", 0.35), diatomic(x, y, 14, kind, rot))


def closeup(s):
    """The last drops, magnified: krypton atoms left behind, the last nitrogen leaving."""
    cx, cy, R = 800, 300, 172
    opening, closing = magnifier(s, "mag", cx, cy, R, COLOR, src=(FX, BOT - 50, 26), inner="#151837")
    s.d(lin("pool", [(0, "#8fb4ff", 0.85), (1, "#4a62b8", 0.9)], x1=0, y1=0, x2=0, y2=1))
    body = [f'<path d="M{cx - R},{cy + 40} Q{cx - 90},{cy + 22} {cx},{cy + 34} T{cx + R},{cy + 30} L{cx + R},{cy + R} L{cx - R},{cy + R} Z" '
            'fill="url(#pool)"/>',
            f'<path d="M{cx - R},{cy + 40} Q{cx - 90},{cy + 22} {cx},{cy + 34} T{cx + R},{cy + 30}" fill="none" stroke="#dfe8ff" '
            'stroke-width="3" opacity="0.6"/>']
    # krypton atoms gathered in the last of the liquid, one just peeking above the surface
    for (x, y, rr) in [(cx - 70, cy + 92, 30), (cx - 8, cy + 112, 32), (cx + 60, cy + 86, 29), (cx + 18, cy + 60, 27),
                       (cx - 48, cy + 50, 26), (cx + 96, cy + 128, 24)]:
        body.append(glow(x, y, rr * 1.5, KR, 0.35, "s8"))
        body.append(kball(x, y, rr, "Kr"))
    # the last nitrogen and oxygen boiling off
    body.append(streak(cx - 70, cy - 70, 16, -110, 40, "#ffffff", 0.45) + diatomic(cx - 70, cy - 70, 17, "N", 30))
    body.append(streak(cx + 40, cy - 112, 16, -80, 40, "#ffffff", 0.45) + diatomic(cx + 40, cy - 112, 17, "N", 120))
    body.append(streak(cx + 104, cy - 34, 16, -60, 36, "#ffffff", 0.45) + diatomic(cx + 104, cy - 34, 16, "O", 70))
    for (bx, by, br) in [(cx - 110, cy + 70, 5), (cx + 130, cy + 70, 4), (cx - 20, cy + 150, 4)]:
        body.append(f'<circle cx="{bx}" cy="{by}" r="{br}" fill="none" stroke="#e6f0ff" stroke-width="1.6" opacity="0.7"/>')
    s.a(opening, "".join(body), closing)


def tube(s):
    """The residue in a little discharge tube, glowing white-lilac, and its light split by a prism."""
    tx, ty0, ty1 = 1080, 330, 520
    out = [f'<rect x="{tx - 54}" y="{BENCH - 16}" width="108" height="16" rx="3" fill="#2a2440"/>',
           f'<rect x="{tx - 4}" y="{ty1 + 8}" width="8" height="{BENCH - ty1 - 22}" fill="#6a6290"/>']
    # the glow behind
    out.append(glow(tx, (ty0 + ty1) / 2, 60, "#9c80ff", 0.32, "s16"))
    # bulbs and capillary
    for y in (ty0, ty1):
        out.append(f'<ellipse cx="{tx}" cy="{y}" rx="18" ry="26" fill="#d4c8ff" opacity="0.18"/>'
                   f'<ellipse cx="{tx}" cy="{y}" rx="18" ry="26" fill="none" stroke="#d8d0ff" stroke-width="2.4" opacity="0.8"/>')
    out.append(f'<rect x="{tx - 5}" y="{ty0 + 22}" width="10" height="{ty1 - ty0 - 44}" rx="5" fill="#e4d8ff" filter="url(#g2)"/>'
               f'<rect x="{tx - 2.5}" y="{ty0 + 24}" width="5" height="{ty1 - ty0 - 48}" rx="2.5" fill="#f0e8ff"/>')
    # electrodes and their wires
    for (y, d) in ((ty0 - 26, -1), (ty1 + 26, 1)):
        out.append(f'<rect x="{tx - 6}" y="{y - (10 if d < 0 else 0)}" width="12" height="10" fill="#b0a8c8"/>')
    out.append(f'<path d="M{tx},{ty0 - 36} Q{tx + 40},{ty0 - 70} {tx + 80},{ty0 - 40}" fill="none" stroke="#c87a3a" stroke-width="3"/>')
    # the prism above and the band of colour: dark, with a faint rainbow and two sharp lines
    px, py = 1010, 196
    out.append(f'<path d="M{tx - 20},{ty0 - 20} L{px + 10},{py + 18}" stroke="#e6dcff" stroke-width="5" opacity="0.35" '
               'stroke-linecap="round"/>')
    out.append(f'<polygon points="{P([(px - 30, py + 26), (px + 30, py + 26), (px, py - 26)])}" fill="#b8c8ff" opacity="0.28" '
               'stroke="#dfe6ff" stroke-width="2.5"/>')
    bx0, bx1, by0, by1 = 930, 1170, 66, 116
    s.d(lin("rain", [(0, "#5a1a8a"), (0.18, "#2a3ab8"), (0.38, "#1a8a8a"), (0.55, "#3a9a2a"), (0.7, "#a8a020"), (0.85, "#b05a1a"),
                     (1, "#7a1a1a")], x1=0, y1=0, x2=1, y2=0))
    out.append(f'<path d="M{px - 8},{py - 10} L{bx0 + 20},{by1} L{bx1 - 20},{by1} L{px + 8},{py - 10} Z" fill="#c8b4ff" opacity="0.08"/>')
    out.append(f'<rect x="{bx0}" y="{by0}" width="{bx1 - bx0}" height="{by1 - by0}" rx="6" fill="#0c0e22" stroke="#6a6290" stroke-width="3"/>'
               f'<rect x="{bx0 + 6}" y="{by0 + 6}" width="{bx1 - bx0 - 12}" height="{by1 - by0 - 12}" rx="3" fill="url(#rain)" opacity="0.22"/>')
    # krypton's bright green (557 nm) and yellow (587 nm) lines, where a rainbow from violet to red puts them
    for (t, col) in ((0.52, "#7dff6a"), (0.623, "#ffe34a")):
        x = bx0 + 6 + (bx1 - bx0 - 12) * t
        out.append(f'<rect x="{f(x - 3)}" y="{by0 + 4}" width="6" height="{by1 - by0 - 8}" fill="{col}" filter="url(#g2)"/>')
        out.append(sparkle(x, by0 - 10, 9, col, 0.9))
    s.a("".join(out))


def lab(s):
    """The bench and a gas lamp's warm light on the wall."""
    s.d(lin("bench", [(0, "#4a2f22"), (0.12, "#3a2418"), (1, "#1a0f0a")], x1=0, y1=0, x2=0, y2=1))
    s.a(glow(70, 150, 110, "#ffb86a", 0.35, "s30"))
    # a gas mantle on a wall bracket, top left
    s.a(f'<path d="M24,90 L24,130 L70,130" fill="none" stroke="#6a5a4a" stroke-width="7"/>',
        f'<path d="M58,132 Q70,170 82,132 Z" fill="#ffd8a0" opacity="0.9"/>',
        glow(70, 148, 26, "#ffcf8a", 0.8, "s8"))
    # shelves with bottles, faint, along the back wall on the right
    for (y, x0, x1) in ((150, 470, 640),):
        s.a(f'<rect x="{x0}" y="{y}" width="{x1 - x0}" height="8" fill="#2a2244" opacity="0.8"/>')
        for k, x in enumerate(range(x0 + 12, x1 - 10, 30)):
            h = 34 + (k * 13) % 22
            s.a(f'<rect x="{x}" y="{y - h}" width="20" height="{h}" rx="4" fill="#3a3466" opacity="0.8"/>',
                f'<rect x="{x + 5}" y="{y - h - 8}" width="10" height="9" fill="#2c2850" opacity="0.8"/>')
    s.a(f'<rect x="0" y="{BENCH}" width="1200" height="{800 - BENCH}" fill="url(#bench)"/>',
        f'<rect x="0" y="{BENCH}" width="1200" height="5" fill="#7a5238" opacity="0.7"/>')


def build():
    s = Svg("Kr", COLOR)
    kdefs(s)
    background(s, glows=[(FX - 60, 140, 300, 0.5), (800, 300, 260, 0.45)], seed=36, stars=40, star_box=(0, 0, 1200, 520), bokeh=5)
    lab(s)
    stand(s)
    vapour(s)
    flask(s)
    closeup(s)
    tube(s)
    finish(s)
    s.save("hidden")


if __name__ == "__main__":
    build()
