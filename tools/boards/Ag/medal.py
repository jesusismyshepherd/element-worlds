"""Board 'medal': a stadium at night, floodlights and a crowd sparkling with camera flashes. Over the podium hangs
a big Olympic gold medal, the Eiffel Tower's iron hexagon in its middle and lines radiating from it, its gold
skin peeled back at one corner like a page: underneath, silver. On the left, the winner's medal of 1896, silver,
with an olive branch. A close-up of the peeled edge: a thin skin of gold atoms over silver atoms, a few copper
atoms among them (sterling silver)."""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from agkit import *  # noqa: E402,F401

COLOR = "#ffcf4d"
C = (600, 292)
R = 150


def floodlight(s, x, top, side):
    """A floodlight tower: a lattice mast, a head of lamps, a soft cone of light towards the middle."""
    out = []
    tip = x + side * 40
    out.append(f'<polygon points="{P([(tip - 26, top + 30), (tip + 26, top + 30), (600 + side * 60, 560), (600 - side * 330, 560)])}" '
               f'fill="#fff4d0" opacity="0.045"/>')
    out.append(f'<path d="M{x - 14},624 L{x - 6},{top + 40} L{x + 6},{top + 40} L{x + 14},624" fill="#151a3a"/>')
    for k in range(9):
        y = top + 60 + k * 58
        out.append(f'<line x1="{x - 12}" y1="{y}" x2="{x + 12}" y2="{y + 29}" stroke="#2a3160" stroke-width="2"/>'
                   f'<line x1="{x + 12}" y1="{y}" x2="{x - 12}" y2="{y + 29}" stroke="#2a3160" stroke-width="2"/>')
    out.append(f'<path d="M{x},{top + 44} L{tip},{top + 30}" stroke="#151a3a" stroke-width="8"/>')
    out.append(glow(tip, top + 12, 70, "#fff0c0", 0.5, "s16"))
    hx, hy = tip - 40, top - 10
    out.append(f'<rect x="{hx}" y="{hy}" width="80" height="48" rx="5" fill="#1d2244"/>')
    for i in range(4):
        for j in range(2):
            out.append(f'<circle cx="{hx + 12 + i * 19}" cy="{hy + 13 + j * 22}" r="7" fill="#ffe9b0"/>')
    s.a("".join(out))


def stands(s, rnd):
    """The stands: a dark bowl across the bottom, rows of people as dots, a few camera flashes."""
    s.d(lin("stand", [(0, "#232a58"), (1, "#121638")], x1=0, y1=0, x2=0, y2=1))
    s.a(f'<path d="M0,452 Q600,388 1200,452 L1200,800 L0,800 Z" fill="url(#stand)"/>',
        f'<path d="M0,452 Q600,388 1200,452" fill="none" stroke="{mix(COLOR, NAVY, 0.5)}" stroke-width="3" opacity="0.6"/>')
    cols = ["#ff6f7d", "#6fa8ff", "#ffd76a", "#ffffff", "#7fe0b0", "#c89aff"]
    for row in range(7):
        y0 = 462 + row * 22
        for i in range(70):
            x = i * 17.4 + (row % 2) * 8 + rnd.uniform(-3, 3)
            y = y0 - 64 * (1 - ((x - 600) / 600) ** 2) * (1 - row * 0.1) + rnd.uniform(-2, 2)
            s.a(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(rnd.uniform(2.2, 3.4))}" fill="{rnd.choice(cols)}" '
                f'opacity="{rnd.uniform(0.25, 0.55):.2f}"/>')
    for _ in range(9):
        x, y = rnd.uniform(40, 1160), rnd.uniform(400, 540)
        s.a(sparkle(x, y, rnd.uniform(7, 12), "#ffffff", 0.85))


def podium(s):
    """The three steps, dark, their tops lit in the board's colour."""
    edge = mix(COLOR, "#ffffff", 0.2)
    for (x0, x1, top) in ((400, 520, 566), (680, 800, 580), (520, 680, 536)):
        s.a(f'<rect x="{x0}" y="{top}" width="{x1 - x0}" height="{800 - top}" fill="#1c2250"/>',
            f'<rect x="{x0}" y="{top}" width="{x1 - x0}" height="6" fill="{edge}" opacity="0.7"/>',
            f'<rect x="{x0}" y="{top + 6}" width="8" height="{800 - top}" fill="#2c3470"/>')


def ribbon(s, x0, x1, cx, cy, cols):
    """Two straps from above the picture down to the medal's top."""
    a, b = cols
    s.a(f'<polygon points="{P([(x0 - 34, -10), (x0 + 6, -10), (cx + 4, cy + 4), (cx - 18, cy - 8)])}" fill="{a}"/>',
        f'<polygon points="{P([(x1 - 6, -10), (x1 + 34, -10), (cx + 18, cy - 8), (cx - 4, cy + 4)])}" fill="{mix(a, "#000000", 0.25)}"/>',
        f'<line x1="{x0 - 14}" y1="-10" x2="{cx - 7}" y2="{cy - 2}" stroke="{b}" stroke-width="5" opacity="0.8"/>',
        f'<line x1="{x1 + 14}" y1="-10" x2="{cx + 7}" y2="{cy - 2}" stroke="{b}" stroke-width="5" opacity="0.6"/>')


def gold_medal(s):
    """The Paris 2024 gold medal: gold face, radiating lines, the iron hexagon, its gold peeled at one corner."""
    cx, cy = C
    s.d(rad("iron", [(0, "#8a8178"), (0.6, "#5e5650"), (1, "#3a3430")], cx=0.4, cy=0.35, r=0.8),
        lin("goldBack", [(0, "#ffe7a0"), (0.5, "#e8b84a"), (1, "#a2700e")], x1=0, y1=0, x2=1, y2=1),
        f'<clipPath id="medalFace"><circle cx="{cx}" cy="{cy}" r="{R}"/></clipPath>')
    ribbon(s, 520, 680, cx, cy - R + 6, ("#1d3a8a", "#ffcf4d"))
    s.a(glow(cx, cy, R * 1.15, COLOR, 0.35, "s30"))
    # the thickness, a little below and to the right
    s.a(f'<circle cx="{cx + 5}" cy="{cy + 8}" r="{R}" fill="#6a4406"/>')
    s.a(f'<circle cx="{cx}" cy="{cy}" r="{R}" fill="url(#auBand)" stroke="#5a3a06" stroke-width="4"/>')
    s.a(f'<circle cx="{cx}" cy="{cy}" r="{R - 14}" fill="none" stroke="#8a5a0c" stroke-width="3" opacity="0.5"/>')
    # the radiance: fine embossed lines from the hexagon to the rim
    lines = []
    for k in range(48):
        a = k / 48 * math.tau + 0.03
        r0, r1 = 56, R - 20 - (k % 3) * 8
        lines.append(f'<line x1="{f(cx + math.cos(a) * r0)}" y1="{f(cy + math.sin(a) * r0)}" x2="{f(cx + math.cos(a) * r1)}" '
                     f'y2="{f(cy + math.sin(a) * r1)}" stroke="{"#fff0b8" if k % 2 else "#8a5a0c"}" stroke-width="2.4" '
                     f'opacity="{0.55 if k % 2 else 0.4}"/>')
    s.a('<g clip-path="url(#medalFace)">' + "".join(lines) + "</g>")
    # the iron hexagon from the Eiffel Tower, held by six little claws
    hexp = [(cx + math.cos(math.radians(30 + 60 * k)) * 50, cy + math.sin(math.radians(30 + 60 * k)) * 50) for k in range(6)]
    s.a(f'<polygon points="{P(hexp)}" fill="url(#iron)" stroke="#2a2420" stroke-width="3"/>')
    for (x, y) in hexp:
        s.a(f'<circle cx="{f(x)}" cy="{f(y)}" r="6" fill="url(#auBand)" stroke="#5a3a06" stroke-width="1.5"/>')
    s.a(f'<path d="M{cx - 18},{cy - 22} L{cx + 2},{cy - 30}" stroke="#b0a89e" stroke-width="3" stroke-linecap="round" opacity="0.6"/>')

    # the peel: the gold skin lifted along the chord between two rim points and folded back over the face,
    # its pale underside up; under it, the medal is silver
    a1, a2 = math.radians(-10), math.radians(100)
    A = (cx + math.cos(a1) * R, cy + math.sin(a1) * R)
    B = (cx + math.cos(a2) * R, cy + math.sin(a2) * R)
    arc = [(cx + math.cos(a1 + (a2 - a1) * t / 24) * R, cy + math.sin(a1 + (a2 - a1) * t / 24) * R) for t in range(25)]
    # the bare silver: the segment between the chord and the rim (with a thin gold rim line left at the very edge)
    s.a(f'<path d="M{f(A[0])},{f(A[1])} ' + " ".join(f"L{f(x)},{f(y)}" for x, y in arc) + ' Z" fill="url(#agBand)"/>')
    s.a(f'<path d="M{f(arc[0][0])},{f(arc[0][1])} ' + " ".join(f"L{f(x)},{f(y)}" for x, y in arc[1:]) +
        '" fill="none" stroke="#3c434f" stroke-width="4"/>')
    for t in (0.3, 0.55, 0.8):
        p = (A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t)
        s.a(f'<line x1="{f(p[0])}" y1="{f(p[1])}" x2="{f(p[0] + 26)}" y2="{f(p[1] + 26)}" stroke="#eef1f6" stroke-width="2.5" '
            'opacity="0.5" stroke-linecap="round"/>')
    # the flap: the same segment mirrored across the chord, curling up at its far edge
    ux, uy = B[0] - A[0], B[1] - A[1]
    L = math.hypot(ux, uy)
    ux, uy = ux / L, uy / L

    def mirror(p):
        vx, vy = p[0] - A[0], p[1] - A[1]
        d = vx * ux + vy * uy
        px, py = A[0] + ux * d, A[1] + uy * d
        return (2 * px - p[0], 2 * py - p[1])

    flap = [mirror(p) for p in arc]
    # the flap rolls up as it lifts: seen from the front it is narrower than the bare patch (pressed towards the
    # chord), its middle lifted a little towards the viewer
    curled = []
    for i, p in enumerate(flap):
        t = i / (len(flap) - 1)
        lift = math.sin(t * math.pi) * 10
        vx, vy = p[0] - A[0], p[1] - A[1]
        d = vx * ux + vy * uy
        foot = (A[0] + ux * d, A[1] + uy * d)
        curled.append((foot[0] + (p[0] - foot[0]) * 0.45 + lift * 0.3, foot[1] + (p[1] - foot[1]) * 0.45 - lift * 0.4))
    # its shadow on the bare silver, just beyond the fold (kept inside the medal)
    s.a(f'<g clip-path="url(#medalFace)"><path d="M{f(A[0])},{f(A[1])} L{f(B[0])},{f(B[1])}" stroke="#14171d" stroke-width="16" '
        'opacity="0.35" filter="url(#s4)" transform="translate(9,9)"/></g>')
    s.a(f'<path d="M{f(A[0])},{f(A[1])} ' + " ".join(f"L{f(x)},{f(y)}" for x, y in curled) + ' Z" fill="#000" opacity="0.35" '
        'transform="translate(6,8)" filter="url(#s4)"/>')
    s.a(f'<path d="M{f(A[0])},{f(A[1])} ' + " ".join(f"L{f(x)},{f(y)}" for x, y in curled) + ' Z" fill="url(#goldBack)" '
        'stroke="#8a5a0c" stroke-width="2.5"/>')
    s.a(f'<line x1="{f(A[0])}" y1="{f(A[1])}" x2="{f(B[0])}" y2="{f(B[1])}" stroke="#fff2c0" stroke-width="3" opacity="0.8"/>')
    s.a(sparkle(A[0] + 8, A[1] - 4, 12, "#ffffff", 0.9), sparkle(cx - 92, cy - 96, 16, "#ffffff", 0.8))
    # where the close-up looks: the bare silver near the fold
    return ((A[0] + B[0]) / 2 + 22, (A[1] + B[1]) / 2 + 22)


def silver_1896(s):
    """The winners' medal of 1896: silver, on a blue and white ribbon, an olive branch across it."""
    cx, cy, r = 232, 330, 86
    ribbon(s, 200, 270, cx, cy - r + 4, ("#2a62c8", "#e8eef8"))
    s.a(glow(cx, cy, r * 1.2, "#c8d4ff", 0.25, "s16"))
    s.a(f'<circle cx="{cx + 4}" cy="{cy + 6}" r="{r}" fill="#2c313b"/>',
        f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="url(#agBand)" stroke="#2c313b" stroke-width="3"/>',
        f'<circle cx="{cx}" cy="{cy}" r="{r - 10}" fill="none" stroke="#3c434f" stroke-width="2" opacity="0.45"/>')
    # a wreath in relief
    for side in (-1, 1):
        for k in range(7):
            a = math.radians(110 + side * (k * 13 + 8)) if side > 0 else math.radians(70 - (k * 13 + 8))
            x, y = cx + math.cos(a) * (r - 30), cy + math.sin(a) * (r - 30)
            s.a(f'<ellipse cx="{f(x)}" cy="{f(y)}" rx="9" ry="4" transform="rotate({f(math.degrees(a) + 90 * side)} {f(x)} {f(y)})" '
                'fill="#5c6574" opacity="0.45"/>')
    s.a(f'<circle cx="{cx}" cy="{cy - 4}" r="18" fill="none" stroke="#5c6574" stroke-width="3" opacity="0.45"/>')
    # the olive branch, lying across the lower left
    s.a(f'<path d="M{cx - 120},{cy + 120} Q{cx - 40},{cy + 70} {cx + 60},{cy + 96}" fill="none" stroke="#6a4a2a" stroke-width="5" '
        'stroke-linecap="round"/>')
    for k in range(9):
        t = k / 8
        x = cx - 116 + t * 170
        y = cy + 118 - math.sin(t * math.pi) * 40 + t * -8
        for side in (-1, 1):
            ang = -30 + side * 40 + t * 20
            s.a(f'<ellipse cx="{f(x + side * 6)}" cy="{f(y + side * 7)}" rx="15" ry="5" transform="rotate({f(ang)} {f(x + side * 6)} {f(y + side * 7)})" '
                f'fill="{"#7fae5a" if side > 0 else "#5a8a3e"}"/>')
    for (x, y) in ((cx - 50, cy + 104), (cx + 10, cy + 92)):
        s.a(f'<ellipse cx="{x}" cy="{y}" rx="7" ry="9" fill="#3a4a28"/>')


def closeup(s, src):
    """The peeled edge magnified: two rows of gold atoms on top, silver atoms below, a few copper among them."""
    cx, cy, Rm = 978, 236, 138
    opening, closing = magnifier(s, "magAu", cx, cy, Rm, COLOR, src=(src[0], src[1], 20), inner="#15193a")
    body = []
    r = 17
    dx = 36
    rows = [(-62, "Au"), (-31, "Au"), (0, "Ag"), (31, "Ag"), (62, "Ag"), (93, "Ag"), (124, "Ag")]
    copper = {(3, 2), (5, -1), (4, 3)}
    for j, (oy, el) in enumerate(rows):
        off = (j % 2) * dx / 2
        for i in range(-5, 6):
            x = cx + i * dx + off
            y = cy + oy
            e = el
            if el == "Ag" and (j, i) in copper:
                e = "Cu"
            body.append(aball(x, y, r, e))
    # the air above the gold, and a glint on the skin
    body.append(sparkle(cx - 40, cy - 98, 12, "#fff6d0", 0.8))
    s.a(opening, "".join(body), closing)


def build():
    s = Svg("Ag", COLOR)
    adefs(s)
    background(s, glows=[(600, 260, 430, 0.75)], seed=2024, stars=30, star_box=(0, 0, 1200, 380), bokeh=8)
    rnd = rng(1896)
    floodlight(s, 70, 90, 1)
    floodlight(s, 1130, 90, -1)
    stands(s, rnd)
    podium(s)
    silver_1896(s)
    src = gold_medal(s)
    closeup(s, src)
    finish(s)
    s.save("medal")


if __name__ == "__main__":
    build()
