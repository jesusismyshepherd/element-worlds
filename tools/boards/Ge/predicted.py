"""Board 'predicted': Mendeleev's table as a wall of cards by lamplight, each card with its element's ball,
no letters, only the elements known in 1871 (no noble gases; gallium's place a faint empty gap, eka-aluminium).
Under silicon one card is missing: a gap with a dashed glowing edge and a ghost of the ball
Mendeleev expected there, the neighbours above, below and beside it pointing into it (he worked out
eka-silicon from them). From the right, out of a dark lump of argyrodite (a close-up shows its silver,
sulfur and one germanium), a real germanium ball arcs into the gap: the prediction come true."""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gekit import *  # noqa: E402,F401

COLOR = "#ffb347"
X0, Y0, CW, RH, W_, H_ = 90, 64, 112, 104, 98, 88
CPK = {
    "H": "#e8ecf4", "He": "#c8f0f0", "Li": "#cc80ff", "Be": "#b0e000", "B": "#ffb5b5", "C": "#7a808c", "N": "#3050f8",
    "O": "#ff3030", "F": "#90e050", "Ne": "#a8dcef", "Na": "#ab5cf2", "Mg": "#8ae000", "Al": "#bfa6a6", "Si": "#f0c8a0",
    "P": "#ff8000", "S": "#f4e030", "Cl": "#1ff01f", "Ar": "#80d1e3", "K": "#8f40d4", "Ca": "#3ddc2a", "Ga": "#c28f8f",
    "As": "#bd80e3", "Se": "#ffa100", "Br": "#c03a3a", "Kr": "#5cb8d1", "Rb": "#702eb0", "Sr": "#00d000", "In": "#a67573",
    "Sn": "#8f9aa8", "Sb": "#9e63b5", "Te": "#d47a00", "I": "#a020a0", "Xe": "#429eb0",
}
ROWS = [
    ["H", None, None, None, None, None, None],
    ["Li", "Be", "B", "C", "N", "O", "F"],
    ["Na", "Mg", "Al", "Si", "P", "S", "Cl"],
    ["K", "Ca", "GAP2", "GAP", "As", "Se", "Br"],
    ["Rb", "Sr", "In", "Sn", "Sb", "Te", "I"],
]
GAP = (3, 3)


def cell(i, j):
    return X0 + i * CW, Y0 + j * RH


def centre(i, j):
    x, y = cell(i, j)
    return x + W_ / 2, y + H_ / 2


def card_defs(s):
    for el, c in CPK.items():
        s.d(rad(f"c{el}", [(0, mix(c, "#ffffff", 0.7)), (0.3, c), (0.8, mix(c, "#000000", 0.45)), (1, mix(c, "#000000", 0.65))],
                cx=0.36, cy=0.32, r=0.72, fx=0.32, fy=0.26))
    s.d(lin("card", [(0, "#3a3048"), (1, "#241e34")], x1=0, y1=0, x2=0, y2=1),
        lin("cardHi", [(0, "#5a4430"), (1, "#3a2c2a")], x1=0, y1=0, x2=0, y2=1))


def card(s, i, j, el, near):
    x, y = cell(i, j)
    edge = mix(COLOR, "#3a3048", 0.35 if near else 0.72)
    s.a(f'<rect x="{f(x + 4)}" y="{f(y + 6)}" width="{W_}" height="{H_}" rx="8" fill="#0a0c1a" opacity="0.5"/>',
        f'<rect x="{f(x)}" y="{f(y)}" width="{W_}" height="{H_}" rx="8" fill="url(#{"cardHi" if near else "card"})" '
        f'stroke="{edge}" stroke-width="{3 if near else 2}"/>')
    # two faint lines where a card would have its numbers (no letters)
    s.a(f'<rect x="{f(x + 10)}" y="{f(y + 10)}" width="22" height="5" rx="2.5" fill="{edge}" opacity="0.6"/>',
        f'<rect x="{f(x + W_ - 34)}" y="{f(y + H_ - 15)}" width="24" height="5" rx="2.5" fill="{edge}" opacity="0.45"/>')
    cx, cy = x + W_ / 2, y + H_ / 2 + 2
    r = 25 if el not in ("H", "He") else 19
    s.a(f'<circle cx="{f(cx)}" cy="{f(cy)}" r="{r}" fill="url(#c{el})" stroke="#000" stroke-opacity="0.25" stroke-width="1"/>',
        f'<ellipse cx="{f(cx - r * 0.34)}" cy="{f(cy - r * 0.42)}" rx="{f(r * 0.32)}" ry="{f(r * 0.19)}" '
        f'transform="rotate(-32 {f(cx - r * 0.34)} {f(cy - r * 0.42)})" fill="#fff" opacity="0.5"/>')


def argyrodite(s, cx, cy):
    """A dark lump of argyrodite: black-grey crystals with a steely sheen, on a bit of pale rock."""
    s.d(lin("argy", [(0, "#5a6070"), (0.5, "#2a2e3a"), (1, "#14161e")], x1=0, y1=0, x2=1, y2=1),
        lin("rockA", [(0, "#6a5a58"), (1, "#3a302e")], x1=0, y1=0, x2=0, y2=1))
    s.a(f'<path d="{smooth([(cx - 120, cy + 40), (cx - 90, cy - 10), (cx - 20, cy - 26), (cx + 70, cy - 18), (cx + 120, cy + 20), (cx + 100, cy + 56), (cx - 90, cy + 60)])}" '
        'fill="url(#rockA)"/>')
    rnd = rng(1886)
    for k in range(11):
        x = cx - 80 + k * 16 + rnd.uniform(-6, 6)
        h = rnd.uniform(40, 86)
        w = rnd.uniform(20, 30)
        top = cy + 8 - h
        lean = rnd.uniform(-10, 10)
        pts = [(x - w / 2, cy + 20), (x - w / 2 + lean * 0.5, top + 14), (x + lean, top), (x + w / 2 + lean * 0.5, top + 14), (x + w / 2, cy + 20)]
        s.a(f'<polygon points="{P(pts)}" fill="url(#argy)" stroke="#0a0c12" stroke-width="2"/>',
            f'<polygon points="{P([(x + lean, top), (x + w / 2 + lean * 0.5, top + 14), (x + w / 2, cy + 20), (x + 2, cy + 20)])}" fill="#8a94a8" opacity="0.22"/>')
    for (x, y) in ((cx - 40, cy - 46), (cx + 30, cy - 52), (cx + 66, cy - 20)):
        s.a(sparkle(x, y, 8, "#e8eef8", 0.8))


def build():
    s = Svg("Ge", COLOR)
    gdefs(s)
    card_defs(s)
    background(s, glows=[(445, 400, 330, 0.75), (160, 120, 260, 0.35)], seed=1871, stars=26, star_box=(0, 0, 1200, 600), bokeh=5, tint=0.58)
    # the lamp's warm pool over the table
    s.a(glow(300, 160, 300, "#ffb860", 0.16, "s30"))

    near = {(GAP[0], GAP[1] - 1), (GAP[0], GAP[1] + 1), (GAP[0] + 1, GAP[1])}
    for j, row in enumerate(ROWS):
        for i, el in enumerate(row):
            if el and not el.startswith("GAP"):
                card(s, i, j, el, (i, j) in near)

    # eka-aluminium's gap beside it (gallium, found in 1875): faint and empty
    ax, ay = cell(GAP[0] - 1, GAP[1])
    s.a(f'<rect x="{f(ax)}" y="{f(ay)}" width="{W_}" height="{H_}" rx="8" fill="#140e10" opacity="0.5"/>',
        f'<rect x="{f(ax)}" y="{f(ay)}" width="{W_}" height="{H_}" rx="8" fill="none" stroke="{mix(COLOR, "#3a3048", 0.5)}" '
        'stroke-width="3" stroke-dasharray="8 8"/>')
    # the gap: a dashed glowing edge and a ghost of the expected ball
    gx, gy = cell(*GAP)
    cx, cy = centre(*GAP)
    s.a(glow(cx, cy, 80, COLOR, 0.55, "s16"),
        f'<rect x="{f(gx)}" y="{f(gy)}" width="{W_}" height="{H_}" rx="8" fill="#140e10" opacity="0.7"/>',
        f'<rect x="{f(gx)}" y="{f(gy)}" width="{W_}" height="{H_}" rx="8" fill="none" stroke="{COLOR}" stroke-width="4" stroke-dasharray="10 8"/>',
        f'<circle cx="{f(cx)}" cy="{f(cy + 2)}" r="25" fill="none" stroke="{mix(COLOR, "#ffffff", 0.3)}" stroke-width="2.5" '
        f'stroke-dasharray="5 5" opacity="0.8"/>')
    # the neighbours point in
    for (i, j) in near:
        nx, ny = centre(i, j)
        dx, dy = cx - nx, cy - ny
        L = math.hypot(dx, dy)
        ux, uy = dx / L, dy / L
        a0 = (nx + ux * 40, ny + uy * 40)
        a1 = (cx - ux * 54, cy - uy * 52)
        s.a(arrow([a0, ((a0[0] + a1[0]) / 2, (a0[1] + a1[1]) / 2), a1], mix(COLOR, "#ffffff", 0.15), w=4, op=0.85))

    # the lump of argyrodite, and its close-up: silver, sulfur and one germanium
    argyrodite(s, 1080, 470)
    o, c = magnifier(s, "mag", 1060, 220, 102, COLOR, src=(1080, 440, 46))
    s.a(o)
    rnd = rng(8)
    pts = [(1060 + 64 * math.cos(a), 220 + 64 * math.sin(a)) for a in [k * math.tau / 8 + 0.3 for k in range(8)]]
    for k, (x, y) in enumerate(pts):
        s.a(gball(x, y, 20, "Ag"))
    for k in range(6):
        a = k * math.tau / 6
        s.a(ball(1060 + 34 * math.cos(a), 220 + 34 * math.sin(a), 14, "S"))
    s.a(gball(1060, 220, 22, "Ge"))
    s.a(c)

    # the germanium ball flying in along an arc from the lump to the gap
    path = [(1010, 420), (900, 250), (720, 210), (560, 300), (cx + 30, cy - 24)]
    s.a(f'<path d="{smooth(path, closed=False)}" fill="none" stroke="{COLOR}" stroke-width="10" stroke-linecap="round" opacity="0.18"/>',
        f'<path d="{smooth(path, closed=False)}" fill="none" stroke="{mix(COLOR, "#ffffff", 0.3)}" stroke-width="3" stroke-dasharray="3 12" '
        f'stroke-linecap="round" opacity="0.8"/>')
    for k, t in enumerate((0.25, 0.45, 0.62)):
        x, y = path[1][0] + (path[3][0] - path[1][0]) * t, 240 + 30 * t
        s.a(sparkle(x, y - 14, 5 + k * 2, "#ffe8b8", 0.6))
    bx, by = 582, 296
    s.a(glow(bx, by, 52, "#bff0e8", 0.5, "s16"), gball(bx, by, 34, "Ge"))

    finish(s)
    s.save("predicted")


if __name__ == "__main__":
    build()
