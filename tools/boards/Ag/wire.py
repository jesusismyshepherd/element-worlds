"""Board 'wire': a hillside at Kongsberg at dusk, cut open. On top, two children and their ox, the ox's horns
against a rock where something glints. Below, the rock in section: grey gneiss in bands, a pale vein crossing it;
on the left a mine gallery with smooth rounded walls, a fire burning against its far end to crack the rock; in the
vein on the right a black lump of silver sulfide with curls of silver wire growing out of it. A close-up: the
black crystal's sulfur and silver atoms, silver moving through it to the root of a wire, which grows from below."""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from agkit import *  # noqa: E402,F401

COLOR = "#ff9f43"
GROUND = 262


def hill(s, rnd):
    """The sunset behind the hills, the hill with spruces, the children and the ox."""
    s.d(lin("dusk", [(0, "#ff9f43", 0), (0.6, "#ff8a5a", 0.35), (1, "#ffb070", 0.55)], x1=0, y1=0, x2=0, y2=1))
    s.a(f'<rect x="0" y="80" width="1200" height="{GROUND - 80}" fill="url(#dusk)"/>')
    s.a(glow(820, 230, 120, "#ffd08a", 0.6, "s30"))
    # far ridge, near hill
    s.a(f'<path d="M0,{GROUND - 50} Q200,{GROUND - 110} 420,{GROUND - 70} Q640,{GROUND - 30} 860,{GROUND - 90} Q1040,{GROUND - 120} 1200,'
        f'{GROUND - 70} L1200,{GROUND} L0,{GROUND} Z" fill="#3a2a4a"/>')
    s.a(f'<path d="M0,{GROUND - 18} Q260,{GROUND - 64} 480,{GROUND - 46} Q700,{GROUND - 28} 900,{GROUND - 10} L1200,{GROUND - 4} '
        f'L1200,{GROUND + 6} L0,{GROUND + 6} Z" fill="#251c34"/>')
    for _ in range(30):
        x = rnd.uniform(0, 1200)
        if 250 < x < 520:
            continue
        base = GROUND - 14 - 40 * math.exp(-((x - 300) / 260) ** 2)
        h = rnd.uniform(26, 52)
        s.a(f'<polygon points="{P([(x, base - h), (x - h * 0.28, base), (x + h * 0.28, base)])}" fill="#1a1428"/>')
    # the rock outcrop the ox butted, glinting
    rx, ry = 400, GROUND - 58
    s.a(f'<path d="M{rx - 30},{ry + 18} Q{rx - 26},{ry - 14} {rx},{ry - 18} Q{rx + 30},{ry - 16} {rx + 34},{ry + 18} Z" fill="#4a4258"/>')
    s.a(glow(rx - 4, ry - 6, 22, "#fff2d0", 0.8, "s4"), sparkle(rx - 4, ry - 6, 16, "#ffffff", 0.95))
    # the ox, head down, horns to the rock
    ox = 320
    oy = GROUND - 56
    s.a(f'<path d="M{ox - 70},{oy - 10} Q{ox - 60},{oy - 40} {ox - 10},{oy - 38} Q{ox + 30},{oy - 38} {ox + 44},{oy - 22} '
        f'L{ox + 66},{oy - 4} Q{ox + 70},{oy + 6} {ox + 60},{oy + 8} L{ox + 40},{oy} Q{ox + 20},{oy + 4} {ox + 8},{oy + 4} '
        f'L{ox - 50},{oy + 6} Q{ox - 72},{oy + 6} {ox - 70},{oy - 10} Z" fill="#1c1420"/>')
    for (x0, x1) in ((ox - 58, ox - 54), (ox - 34, ox - 30), (ox + 2, ox + 6), (ox + 22, ox + 26)):
        s.a(f'<rect x="{x0}" y="{oy + 2}" width="{x1 - x0 + 3}" height="30" fill="#1c1420"/>')
    s.a(f'<path d="M{ox + 52},{oy - 12} Q{ox + 58},{oy - 34} {ox + 80},{oy - 30}" fill="none" stroke="#e0d0b0" stroke-width="6" '
        'stroke-linecap="round"/>',
        f'<path d="M{ox + 46},{oy - 16} Q{ox + 44},{oy - 40} {ox + 62},{oy - 46}" fill="none" stroke="#c8b898" stroke-width="5" '
        'stroke-linecap="round"/>',
        f'<path d="M{ox - 70},{oy - 6} Q{ox - 84},{oy + 4} {ox - 80},{oy + 22}" fill="none" stroke="#1c1420" stroke-width="3"/>')
    # the two children, a stick, a hand pointing at the glint
    for (x, h, hr) in ((222, 46, 9), (254, 38, 8)):
        top = GROUND - 30 - h
        s.a(f'<circle cx="{x}" cy="{top}" r="{hr}" fill="#1c1420"/>',
            f'<path d="M{x - 9},{top + hr + 2} L{x + 9},{top + hr + 2} L{x + 12},{top + h} L{x - 12},{top + h} Z" fill="#1c1420"/>',
            f'<rect x="{x - 7}" y="{top + h - 2}" width="5" height="16" fill="#1c1420"/>',
            f'<rect x="{x + 2}" y="{top + h - 2}" width="5" height="16" fill="#1c1420"/>')
    s.a(f'<line x1="214" y1="{GROUND - 64}" x2="194" y2="{GROUND - 16}" stroke="#1c1420" stroke-width="4" stroke-linecap="round"/>',
        f'<line x1="262" y1="{GROUND - 62}" x2="284" y2="{GROUND - 74}" stroke="#1c1420" stroke-width="5" stroke-linecap="round"/>')


def rock(s, rnd):
    """The rock in section: gneiss in wavy bands, and a pale vein crossing it."""
    s.d(lin("gneiss", [(0, "#4a3f4a"), (1, "#2a2232")], x1=0, y1=0, x2=0, y2=1))
    s.a(f'<rect x="0" y="{GROUND}" width="1200" height="{800 - GROUND}" fill="url(#gneiss)"/>',
        f'<rect x="0" y="{GROUND}" width="1200" height="8" fill="#5a4a3a"/>')
    for k in range(14):
        y0 = GROUND + 20 + k * 26
        pts = [(x, y0 + 10 * math.sin(x / 90 + k) + 6 * math.sin(x / 37 + k * 2)) for x in range(-20, 1240, 60)]
        s.a(f'<path d="{smooth(pts, closed=False)}" fill="none" stroke="{rnd.choice(["#5a4e5a", "#3a3040", "#64565e"])}" '
            f'stroke-width="{rnd.uniform(3, 9):.1f}" opacity="0.6"/>')
    # the vein: pale calcite in a crack, ragged at its edges, a little under the bloom
    left = [(560 + 8 * math.sin(k * 1.7), GROUND + k * 30) for k in range(13)]
    left = [(x + (y - GROUND) * 0.36, y) for x, y in left]
    right = [(x + 70 + 10 * math.sin(k * 2.3 + 1), y) for k, (x, y) in enumerate(left)]
    s.a(f'<path d="{poly(left + right[::-1])}" fill="#9a8c7c" opacity="0.8"/>')
    for k in range(18):
        t = rnd.uniform(0, 1)
        x = 590 + (624 - GROUND) * 0.36 * t + rnd.uniform(-10, 30)
        y = GROUND + (624 - GROUND) * t
        s.a(f'<polygon points="{P([(x, y - 7), (x + 5, y), (x, y + 7), (x - 5, y)])}" fill="#d6cbb8" opacity="0.6"/>')


def gallery(s):
    """The mine in section: a shaft with a ladder down from the hillside, a long gallery with smooth rounded walls
    running into the rock, rails and an ore cart, and at its end a fire burning against the rock face to crack it."""
    top, bot, x1 = 420, 540, 440
    s.d(lin("galleryAir", [(0, "#1a1018"), (0.7, "#4a2a1c"), (1, "#8a4a20")], x1=0, y1=0, x2=1, y2=0))
    # the shaft
    s.a(f'<rect x="56" y="{GROUND}" width="64" height="{top - GROUND + 20}" fill="#140e16"/>')
    for k in range(9):
        y = GROUND + 12 + k * 18
        s.a(f'<line x1="68" y1="{y}" x2="108" y2="{y}" stroke="#6a4a2a" stroke-width="4"/>')
    s.a(f'<line x1="68" y1="{GROUND}" x2="68" y2="{top + 20}" stroke="#6a4a2a" stroke-width="4"/>',
        f'<line x1="108" y1="{GROUND}" x2="108" y2="{top + 20}" stroke="#6a4a2a" stroke-width="4"/>',
        f'<path d="M48,{GROUND} L60,{GROUND - 30} L116,{GROUND - 30} L128,{GROUND}" fill="#2a1e2a"/>')
    # the gallery: rounded, smooth walls (fire-set), lit from its far end
    s.a(f'<path d="M40,{bot} L40,{top + 30} Q40,{top} 80,{top} L{x1 - 40},{top} Q{x1},{top} {x1},{top + 40} L{x1},{bot} Z" '
        'fill="url(#galleryAir)"/>')
    s.a(f'<path d="M40,{bot} L40,{top + 30} Q40,{top} 80,{top} L{x1 - 40},{top} Q{x1},{top} {x1},{top + 40} L{x1},{bot}" '
        'fill="none" stroke="#7a5a4a" stroke-width="5" opacity="0.7"/>')
    for k in range(4):
        x = 110 + k * 80
        s.a(f'<path d="M{x},{top + 6} Q{x + 30},{top + 40} {x + 10},{bot - 10}" fill="none" stroke="#000" stroke-width="10" opacity="0.15"/>')
    # rails and an ore cart full of dark ore
    s.a(f'<line x1="40" y1="{bot - 8}" x2="{x1 - 50}" y2="{bot - 8}" stroke="#8a8a96" stroke-width="4"/>')
    for k in range(10):
        s.a(f'<rect x="{48 + k * 36}" y="{bot - 6}" width="20" height="6" fill="#4a3020"/>')
    cxx = 180
    s.a(f'<path d="M{cxx - 50},{bot - 70} L{cxx + 50},{bot - 70} L{cxx + 40},{bot - 24} L{cxx - 40},{bot - 24} Z" fill="#3a2e2a" '
        'stroke="#1a1414" stroke-width="3"/>',
        f'<path d="M{cxx - 44},{bot - 70} Q{cxx - 20},{bot - 96} {cxx + 6},{bot - 84} Q{cxx + 30},{bot - 100} {cxx + 44},{bot - 70} Z" fill="#1c1a20"/>')
    for wx in (cxx - 26, cxx + 26):
        s.a(f'<circle cx="{wx}" cy="{bot - 18}" r="11" fill="#2a2228" stroke="#8a8a96" stroke-width="3"/>')
    s.a(sparkle(cxx + 4, bot - 90, 6, "#e8ecf4", 0.8))
    # the fire against the rock face at the gallery's end
    fx, fy = x1 - 34, bot - 4
    s.a(glow(fx, fy - 40, 90, "#ff8a3a", 0.55, "s30"))
    for ang in (-14, 12, -4):
        s.a(f'<rect x="{fx - 34}" y="{fy - 12}" width="68" height="10" rx="5" fill="#3a2010" transform="rotate({ang} {fx} {fy - 7})"/>')
    for (dx, h, col) in ((-16, 70, "#ff7a2a"), (10, 86, "#ffa83a"), (-2, 50, "#ffd27a")):
        s.a(f'<path d="M{fx + dx - 16},{fy - 10} Q{fx + dx - 18},{fy - 10 - h * 0.5} {fx + dx + 6},{fy - 10 - h} '
            f'Q{fx + dx + 18},{fy - 10 - h * 0.5} {fx + dx + 16},{fy - 10} Z" fill="{col}"/>')
    # the rock face, cracking in the heat
    for (y0, y1, dx) in ((top + 20, top + 60, -10), (top + 50, top + 96, -16)):
        s.a(f'<path d="M{x1 + 2},{y0} L{x1 + 18},{(y0 + y1) / 2} L{x1 + 8},{y1}" fill="none" stroke="#ffb070" stroke-width="3" opacity="0.7"/>')


def wires(s):
    """The black lump of silver sulfide in the vein, and the curls of silver growing out of it."""
    x, y = 676, 452
    s.a(f'<ellipse cx="{x + 6}" cy="{y + 30}" rx="74" ry="20" fill="#000" opacity="0.4" filter="url(#s8)"/>')
    lump = smooth([(x - 70, y + 22), (x - 76, y - 4), (x - 50, y - 30), (x - 6, y - 36), (x + 40, y - 30), (x + 70, y - 8), (x + 66, y + 22)])
    s.a(f'<path d="{lump}" fill="#1a1a20"/>')
    for (dx, dy) in ((-40, -16), (-8, -24), (30, -18), (52, 0)):
        s.a(f'<path d="M{x + dx - 10},{y + dy} L{x + dx + 4},{y + dy - 8}" stroke="#6a6e7a" stroke-width="3" stroke-linecap="round" opacity="0.7"/>')
    curls = [
        [(x - 46, y - 24), (x - 58, y - 70), (x - 40, y - 120)] + spiral(x - 60, y - 132, 22, 6, 1.4, a0=0.2, n=24),
        [(x - 14, y - 32), (x - 10, y - 90), (x + 6, y - 150), (x + 2, y - 196)] + spiral(x - 20, y - 204, 22, 7, 1.2, a0=0.1, n=22),
        [(x + 20, y - 30), (x + 44, y - 74), (x + 84, y - 104)] + spiral(x + 100, y - 86, 22, 6, -1.3, a0=-2.2, n=22),
        [(x + 50, y - 16), (x + 96, y - 30), (x + 130, y - 20), (x + 150, y - 46), (x + 138, y - 74)],
        [(x - 60, y - 6), (x - 104, y - 26), (x - 120, y - 62), (x - 96, y - 84)],
    ]
    for k, pts in enumerate(curls):
        s.a(curl(pts, w=9 if k < 3 else 7))
    s.a(sparkle(x - 4, y - 196, 12, "#ffffff", 0.9), sparkle(x + 102, y - 88, 9, "#ffffff", 0.8))
    return (x - 10, y - 40)


def closeup(s, src):
    """The black crystal magnified: sulfur (yellow) and silver atoms, silver moving to the root of a wire of
    silver atoms that rises out of it, built from below."""
    cx, cy, R = 1010, 190, 136
    opening, closing = magnifier(s, "magWire", cx, cy, R, COLOR, src=(src[0], src[1], 22), inner="#20161e")
    body = []
    r = 15
    cy -= 22  # the crystal's top a little above the middle, so three rows of it show
    # the crystal: rows of sulfur with silver between, filling the lower part
    for j in range(4):
        y = cy + 40 + j * 30
        for i in range(-5, 6):
            x = cx + i * 34 + (j % 2) * 17
            if abs(x - cx) < 20 and j == 0:
                continue
            body.append(aball(x, y, r * 0.95, "S" if (i + j) % 2 else "Ag", shine=True))
    # the wire: a column of silver atoms rising from the crystal
    for k in range(5):
        body.append(aball(cx + (k % 2) * 6 - 3, cy + 16 - k * 30, r, "Ag"))
    # silver moving through the crystal to the wire's root
    for (x0, y0) in ((cx - 130, cy + 96), (cx + 120, cy + 110)):
        body.append(arrow([(x0, y0), ((x0 + cx) / 2, cy + 70), (cx + (14 if x0 > cx else -14), cy + 40)], "#ffd27a", w=4, op=0.9,
                          dash="8 6"))
    body.append(arrow([(cx + 44, cy - 20), (cx + 44, cy - 96)], "#ffffff", w=4, op=0.75))
    s.a(opening, "".join(body), closing)


def build():
    s = Svg("Ag", COLOR)
    adefs(s)
    background(s, glows=[(820, 200, 320, 0.45)], seed=1623, stars=40, star_box=(0, 0, 1200, 160), bokeh=3)
    rnd = rng(1624)
    hill(s, rnd)
    rock(s, rnd)
    gallery(s)
    src = wires(s)
    closeup(s, src)
    finish(s)
    s.save("wire")


if __name__ == "__main__":
    build()
