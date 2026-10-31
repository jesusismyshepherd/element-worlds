"""Board 'cellar': a granite house in the north of Portugal at night, cut open. Under it the granite with its
pink, grey and black grains, then soil; radon rises out of the rock as teal atoms, seeps up through the
soil and in at the cracks of the cellar floor. Upstairs the lamp is on, a little detector sits on the
sideboard, the window stands open and radon drifts out into the night; a pipe from under the cellar floor
climbs the outside wall to a small fan, which blows the air from under the house away above the roof.
Granite boulders on the hills behind."""
import math
import os
import random
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from rnkit import *  # noqa: E402,F401,F403

COLOR = "#ffd25e"
GROUND = 382
SLAB = 500
X0, X1 = 330, 820  # the house's outer walls
WALL = 30
EAVES, PEAK = 222, 112


def stones(x, y, w, h, seed, base="#6c717c"):
    """A wall of granite blocks, mortar showing between them."""
    rnd = random.Random(seed)
    out = [f'<rect x="{f(x)}" y="{f(y)}" width="{f(w)}" height="{f(h)}" fill="#3a3c44"/>']
    yy = y
    row = 0
    while yy < y + h - 1:
        bh = min(rnd.uniform(22, 30), y + h - yy)
        xx = x - (rnd.uniform(0, 14) if row % 2 else 0)
        while xx < x + w - 1:
            bw = rnd.uniform(26, 44)
            a, b = max(xx, x), min(xx + bw, x + w)
            if b - a > 3:
                col = mix(base, rnd.choice(["#8a8f9a", "#5a5e68", "#7b7f8a", "#9a8e8e"]), rnd.uniform(0.2, 0.6))
                out.append(f'<rect x="{f(a + 1.2)}" y="{f(yy + 1.2)}" width="{f(b - a - 2.4)}" height="{f(bh - 2.4)}" rx="3" fill="{col}"/>')
            xx += bw
        yy += bh
        row += 1
    return "".join(out)


def build():
    s = Svg("Rn", COLOR)
    setup(s)
    background(s, glows=[(575, 300, 380, 0.55), (560, 560, 300, 0.35)], seed=300, stars=60,
               star_box=(0, 0, 1200, 290), bokeh=5)
    rnd = random.Random(108)
    s.d(lin("soil", [(0, "#4f3a2c"), (1, "#2c2019")], x1=0, y1=0, x2=0, y2=1),
        lin("room", [(0, "#8a6a44"), (1, "#5c4630")], x1=0, y1=0, x2=0, y2=1),
        lin("cellarIn", [(0, "#3c3036"), (1, "#2a2228")], x1=0, y1=0, x2=0, y2=1),
        rad("lamp", [(0, "#ffe7a6", 0.75), (0.35, "#ffc95e", 0.3), (1, "#ffb84d", 0)]),
        lin("roof", [(0, "#c0604a"), (1, "#7c3324")], x1=0, y1=0, x2=0, y2=1),
        lin("hill", [(0, "#24305e"), (1, "#151b3c")], x1=0, y1=0, x2=0, y2=1),
        lin("grass", [(0, "#3d5a3a"), (1, "#26381f")], x1=0, y1=0, x2=0, y2=1))

    # ---------- a crescent moon and the hills with their granite boulders
    s.a(glow(1040, 110, 70, "#fff2c0", 0.25, "s16"),
        '<circle cx="1040" cy="110" r="34" fill="#f2e2b0"/><circle cx="1056" cy="100" r="30" fill="#2b2f52"/>')
    s.a(f'<path d="{smooth([(-40, 330), (120, 280), (260, 300), (420, 262), (600, 292), (780, 250), (960, 286), (1120, 262), (1260, 300), (1260, 420), (-40, 420)])}" fill="url(#hill)"/>')

    # ---------- underground: soil, then granite
    s.a(f'<rect x="0" y="{GROUND}" width="1200" height="{800 - GROUND}" fill="url(#soil)"/>')
    rock_top = SLAB + 30
    edge = [(0, rock_top + 8), (200, rock_top - 6), (420, rock_top + 10), (640, rock_top - 4), (900, rock_top + 12), (1200, rock_top)]
    clip = smooth(edge + [(1200, 800), (0, 800)][::-1][::-1], closed=False)
    clip = "M0,800 " + "L" + " L".join(f"{f(x)},{f(y)}" for x, y in edge) + " L1200,800 Z"
    s.a(granite(s, "gr", clip, (0, rock_top - 20, 1200, 800), seed=11, dim=0.45, scale=1.5, mica=0.35))
    s.d(lin("deep", [(0, NAVY_DEEP, 0), (0.45, NAVY_DEEP, 0.7), (1, NAVY_DEEP, 0.92)], x1=0, y1=0, x2=0, y2=1))
    s.a(f'<rect x="0" y="{rock_top + 10}" width="1200" height="{800 - rock_top - 10}" fill="url(#deep)"/>')
    # grass along the surface outside the house
    for xa, xb in ((0, X0 - 4), (X1 + 4, 1200)):
        s.a(f'<rect x="{xa}" y="{GROUND - 6}" width="{xb - xa}" height="14" fill="url(#grass)"/>')

    # ---------- the house: the back walls inside, lit upstairs, dim in the cellar
    s.a(f'<rect x="{X0}" y="{EAVES}" width="{X1 - X0}" height="{GROUND - EAVES}" fill="url(#room)"/>',
        f'<rect x="{X0}" y="{GROUND}" width="{X1 - X0}" height="{SLAB - GROUND}" fill="url(#cellarIn)"/>')
    s.a(f'<circle cx="560" cy="270" r="190" fill="url(#lamp)"/>')
    # upstairs: a framed picture, a table, the lamp hanging over it, a sideboard with the detector
    s.a('<rect x="640" y="250" width="70" height="52" rx="4" fill="#3b2a1e"/><rect x="648" y="258" width="54" height="36" fill="#5a7aa0"/>'
        '<path d="M648,294 L668,272 L684,286 L702,266 L702,294Z" fill="#3e6a4a"/>')
    s.a('<line x1="560" y1="222" x2="560" y2="262" stroke="#2a1d14" stroke-width="3"/>'
        '<path d="M536,284 L584,284 L572,262 L548,262Z" fill="#e8b85a"/>',
        glow(560, 292, 26, "#ffe7a6", 0.7, "s8"))
    s.a('<rect x="490" y="330" width="150" height="12" rx="3" fill="#6b4630"/>'
        '<rect x="500" y="342" width="10" height="38" fill="#5a3a26"/><rect x="620" y="342" width="10" height="38" fill="#5a3a26"/>')
    s.a('<rect x="380" y="320" width="90" height="60" rx="4" fill="#5a3a26"/><rect x="380" y="316" width="90" height="8" rx="3" fill="#7a5238"/>')
    # the detector: a small round box on the sideboard, a soft ring round it
    s.a(glow(425, 306, 26, COLOR, 0.35, "s8"),
        '<ellipse cx="425" cy="314" rx="22" ry="7" fill="#1e2230"/>'
        '<rect x="403" y="300" width="44" height="14" fill="#2c3242"/>'
        '<ellipse cx="425" cy="300" rx="22" ry="7" fill="#e7e2d6" opacity="0.9"/>'
        '<ellipse cx="425" cy="300" rx="9" ry="3" fill="#2c3242"/>')
    # the cellar: barrels, a shelf of jars, steps up
    for bx in (690, 742):
        s.a(f'<ellipse cx="{bx}" cy="{SLAB - 4}" rx="24" ry="6" fill="#000" opacity="0.3"/>'
            f'<path d="M{bx - 22},{SLAB - 4} Q{bx - 28},{SLAB - 36} {bx - 22},{SLAB - 68} L{bx + 22},{SLAB - 68} '
            f'Q{bx + 28},{SLAB - 36} {bx + 22},{SLAB - 4}Z" fill="#6b4630"/>'
            f'<rect x="{bx - 25}" y="{SLAB - 54}" width="50" height="5" fill="#3a3c44"/>'
            f'<rect x="{bx - 25}" y="{SLAB - 22}" width="50" height="5" fill="#3a3c44"/>')
    s.a(f'<rect x="560" y="420" width="90" height="6" fill="#5a3a26"/>')
    for jx, jc in ((570, "#c87a3a"), (592, "#8ab04a"), (614, "#c84a3a"), (634, "#c8a43a")):
        s.a(f'<rect x="{jx}" y="402" width="14" height="18" rx="3" fill="{jc}" opacity="0.75"/>')
    for k in range(5):
        sx = X0 + WALL + 8 + k * 22
        sy = SLAB - k * 24
        s.a(f'<rect x="{sx}" y="{sy - 6}" width="34" height="6" fill="#5a3a26"/>')

    # ---------- floors: the wooden floor upstairs, the cellar's concrete slab with its cracks
    s.a(f'<rect x="{X0}" y="{GROUND - 4}" width="{X1 - X0}" height="12" fill="#5a3a26"/>',
        f'<rect x="{X0}" y="{GROUND - 4}" width="{X1 - X0}" height="3" fill="#8a5c3c"/>')
    s.a(f'<rect x="{X0}" y="{SLAB}" width="{X1 - X0}" height="16" fill="#6d6a6a"/>',
        f'<rect x="{X0}" y="{SLAB}" width="{X1 - X0}" height="3" fill="#8e8a88"/>')
    cracks = [470, 600, 720]
    for cx in cracks:
        s.a(f'<path d="M{cx - 3},{SLAB} L{cx + 2},{SLAB + 6} L{cx - 2},{SLAB + 10} L{cx + 3},{SLAB + 16}" fill="none" '
            f'stroke="#1a1418" stroke-width="3"/>')

    # ---------- the walls, cut through: granite blocks
    s.a(stones(X0, EAVES, WALL, SLAB + 16 - EAVES, 1), stones(X1 - WALL, EAVES, WALL, SLAB + 16 - EAVES, 2))
    # the window in the right wall, open: shutters swung out, the night beyond
    wy0, wy1 = 262, 336
    s.a(f'<rect x="{X1 - WALL - 2}" y="{wy0}" width="{WALL + 4}" height="{wy1 - wy0}" fill="#1d2448"/>',
        f'<path d="M{X1 + 2},{wy0} L{X1 + 46},{wy0 - 10} L{X1 + 46},{wy1 + 10} L{X1 + 2},{wy1}Z" fill="#4a7a5a"/>',
        f'<path d="M{X1 + 8},{wy0 + 8} L{X1 + 40},{wy0 + 2} M{X1 + 8},{wy1 - 8} L{X1 + 40},{wy1 - 2}" stroke="#2f5040" stroke-width="3"/>')
    # ---------- the roof: terracotta tiles, a chimney
    s.a(f'<path d="M{X0 - 40},{EAVES + 6} L575,{PEAK} L{X1 + 40},{EAVES + 6} L{X1 + 40},{EAVES + 20} L575,{PEAK + 16} '
        f'L{X0 - 40},{EAVES + 20}Z" fill="url(#roof)"/>')
    for k in range(1, 9):
        t = k / 9
        xa, ya = X0 - 40 + (575 - X0 + 40) * t, EAVES + 13 - (EAVES - PEAK) * t
        xb, yb = X1 + 40 - (X1 + 40 - 575) * t, ya
        s.a(f'<line x1="{f(xa)}" y1="{f(ya)}" x2="{f(xa + 14)}" y2="{f(ya + 10)}" stroke="#7c3324" stroke-width="2" opacity="0.6"/>',
            f'<line x1="{f(xb)}" y1="{f(yb)}" x2="{f(xb - 14)}" y2="{f(yb + 10)}" stroke="#7c3324" stroke-width="2" opacity="0.6"/>')
    s.a(f'<rect x="690" y="120" width="40" height="80" fill="#6c717c"/><rect x="684" y="114" width="52" height="10" fill="#555963"/>')

    # ---------- the fan's pipe: from under the slab, through the cellar, up the outside of the left wall
    px = X0 - 26
    pipe = (f'M{X0 + 70},{SLAB + 24} L{X0 + 70},{SLAB - 40} Q{X0 + 70},{SLAB - 58} {X0 + 52},{SLAB - 58} '
            f'L{px + 18},{SLAB - 58} Q{px},{SLAB - 58} {px},{SLAB - 76} L{px},{PEAK + 40}')
    s.a(f'<path d="{pipe}" fill="none" stroke="#2a2d36" stroke-width="20" stroke-linejoin="round"/>',
        f'<path d="{pipe}" fill="none" stroke="#8e96a6" stroke-width="14" stroke-linejoin="round"/>',
        f'<path d="{pipe}" fill="none" stroke="#c3cad6" stroke-width="3" stroke-linejoin="round" transform="translate(-4,0)" opacity="0.6"/>')
    # the fan box on the pipe, outside, its blades
    fy = 300
    s.a(f'<rect x="{px - 24}" y="{fy - 24}" width="48" height="48" rx="8" fill="#3f4656"/>',
        f'<circle cx="{px}" cy="{fy}" r="17" fill="#232836"/>')
    for k in range(4):
        a = math.radians(20 + k * 90)
        s.a(f'<ellipse cx="{f(px + math.cos(a) * 9)}" cy="{f(fy + math.sin(a) * 9)}" rx="9" ry="4" fill="#9aa3b8" '
            f'transform="rotate({f(math.degrees(a))} {f(px + math.cos(a) * 9)} {f(fy + math.sin(a) * 9)})"/>')
    # the sump under the slab: a little pit in the soil
    s.a(f'<ellipse cx="{X0 + 70}" cy="{SLAB + 28}" rx="34" ry="12" fill="#1c1418"/>')

    # ---------- radon: out of the granite, up through the soil, in at the cracks
    starts = [(150, 600), (300, 590), (470, 610), (600, 596), (720, 606), (880, 600), (1020, 612), (1140, 596)]
    for (x, y) in starts:
        top = GROUND + 30 if (x < X0 or x > X1) else SLAB + 20
        tx = min(cracks + [X0 + 70], key=lambda c: abs(c - x)) if X0 < x < X1 else x + rnd.uniform(-30, 30)
        pts = [(x, y), (x + rnd.uniform(-18, 18), (y + top) / 2 + 10), (tx, top)]
        s.a(wisp(pts, w=9, op=0.3))
        s.a(radon(x + rnd.uniform(-8, 8), y - 30, 7, 0.9))
        s.a(radon(pts[1][0], pts[1][1], 6.5, 0.85))
    # inside the cellar: radon that came in through the cracks
    for (x, y) in ((470, 478), (600, 470), (722, 446), (520, 436), (660, 412), (440, 404)):
        s.a(radon(x, y, 8, 0.95))
    # outdoors, on the right: the wind thins it out
    for (x, y, r, o) in ((900, 360, 6, 0.8), (960, 330, 5, 0.6), (1040, 300, 4.5, 0.45), (1120, 280, 4, 0.3)):
        s.a(radon(x, y, r, o))
    s.a(arrow([(880, 352), (980, 318), (1100, 284)], "#b8d4ff", w=4, op=0.35, dash="10 9"))
    # upstairs: a little radon leaving by the open window, fresh air coming in
    for (x, y, r, o) in ((760, 300, 7, 0.9), (830, 288, 6.5, 0.8), (880, 270, 6, 0.6)):
        s.a(radon(x, y, r, o))
    s.a(arrow([(744, 312), (820, 296), (906, 262)], RN_GLOW, w=4, op=0.55),
        arrow([(908, 336), (850, 324), (770, 330)], "#b8d4ff", w=4, op=0.55))
    # out of the fan's pipe above the eaves, blown away
    for (x, y, r, o) in ((px - 4, PEAK + 18, 7, 0.9), (px - 26, PEAK - 12, 6, 0.75), (px - 60, PEAK - 30, 5, 0.55), (px - 104, PEAK - 40, 4.5, 0.4)):
        s.a(radon(x, y, r, o))
    s.a(wisp([(px, PEAK + 40), (px - 10, PEAK + 4), (px - 50, PEAK - 26), (px - 120, PEAK - 44)], w=8, op=0.3))

    finish(s)
    s.save("cellar")


if __name__ == "__main__":
    build()
