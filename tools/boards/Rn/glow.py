"""Board 'glow': Gray and Ramsay's frozen radon, 1909. A clear glass vacuum flask of liquid air, fog
spilling from its mouth; a hair-thin glass capillary dips into it, and at its tip a speck of frozen radon
glows orange-red by itself. A close-up of the tip: the capillary's glass walls, the thread of mercury that
pushed the radon down, and the frozen crystal shining, with the tiny sparks of its own decays. Down the
right, the three colours it showed as it got colder: steel blue, yellow, orange-red."""
import math
import os
import random
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from rnkit import *  # noqa: E402,F401,F403

COLOR = "#ff8c42"
FLOOR = 600


def flask(s, cx, top, bottom, w):
    """A clear double-walled vacuum flask of liquid air, cut away by its own clear glass."""
    out = []
    s.d(lin("fGlass", [(0, "#bfe0ff", 0.22), (0.18, "#bfe0ff", 0.05), (0.8, "#bfe0ff", 0.05), (1, "#bfe0ff", 0.25)],
            x1=0, y1=0, x2=1, y2=0),
        lin("fAir", [(0, "#7fb2e8", 0.55), (1, "#2d4f8a", 0.8)], x1=0, y1=0, x2=0, y2=1))
    x0, x1 = cx - w / 2, cx + w / 2
    level = top + (bottom - top) * 0.3
    # liquid air inside the inner wall, a faint blue, bubbles rising
    out.append(f'<path d="M{f(x0 + 16)},{f(level)} L{f(x1 - 16)},{f(level)} L{f(x1 - 16)},{f(bottom - 30)} '
               f'Q{f(cx)},{f(bottom - 4)} {f(x0 + 16)},{f(bottom - 30)}Z" fill="url(#fAir)"/>')
    out.append(f'<ellipse cx="{f(cx)}" cy="{f(level)}" rx="{f(w / 2 - 16)}" ry="10" fill="#a8cdf2" opacity="0.6"/>')
    rnd = random.Random(71)
    for _ in range(16):
        x = rnd.uniform(x0 + 26, x1 - 26)
        y = rnd.uniform(level + 20, bottom - 40)
        out.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(rnd.uniform(2, 5))}" fill="none" stroke="#d8ecff" '
                   f'stroke-width="1.6" opacity="0.6"/>')
    # the two glass walls: outer and inner, a vacuum between them
    for inset, op in ((0, 0.85), (14, 0.55)):
        out.append(f'<path d="M{f(x0 + inset)},{f(top + inset * 0.3)} L{f(x0 + inset)},{f(bottom - 34 + inset * 0.2)} '
                   f'Q{f(cx)},{f(bottom + 6 - inset)} {f(x1 - inset)},{f(bottom - 34 + inset * 0.2)} '
                   f'L{f(x1 - inset)},{f(top + inset * 0.3)}" fill="none" stroke="#d8ecff" stroke-width="3.2" '
                   f'opacity="{op}"/>')
    out.append(f'<rect x="{f(x0)}" y="{f(top)}" width="{f(w)}" height="{f(bottom - top - 20)}" rx="14" fill="url(#fGlass)"/>')
    # the rim and a shine down the left
    out.append(f'<ellipse cx="{f(cx)}" cy="{f(top)}" rx="{f(w / 2)}" ry="12" fill="none" stroke="#e6f2ff" stroke-width="3" opacity="0.8"/>'
               f'<rect x="{f(x0 + 6)}" y="{f(top + 20)}" width="6" height="{f(bottom - top - 90)}" rx="3" fill="#ffffff" opacity="0.28"/>')
    # a wooden stand
    out.append(f'<rect x="{f(x0 - 26)}" y="{f(bottom - 10)}" width="{f(w + 52)}" height="22" rx="6" fill="#6b4630"/>'
               f'<rect x="{f(x0 - 26)}" y="{f(bottom - 10)}" width="{f(w + 52)}" height="6" rx="3" fill="#8a5c3c"/>')
    return "".join(out), level


def fog(cx, top, w, seed=3):
    """Cold fog spilling over the rim and sliding down the flask's side."""
    rnd = random.Random(seed)
    out = []
    for i in range(14):
        x = cx + rnd.uniform(-w * 0.55, w * 0.65)
        y = top - rnd.uniform(-6, 40) + (i % 4) * 22
        r = rnd.uniform(22, 44)
        out.append(f'<ellipse cx="{f(x)}" cy="{f(y)}" rx="{f(r * 1.4)}" ry="{f(r * 0.7)}" fill="#b9d2f0" '
                   f'opacity="{rnd.uniform(0.12, 0.22):.2f}" filter="url(#s8)"/>')
    for i in range(6):
        x = cx + w / 2 + rnd.uniform(-6, 26)
        y = top + 30 + i * 46
        out.append(f'<ellipse cx="{f(x)}" cy="{f(y)}" rx="22" ry="34" fill="#b9d2f0" opacity="0.1" filter="url(#s8)"/>')
    return "".join(out)


def crystal(cx, cy, r, rnd, hot=1.0):
    """The frozen speck: a cluster of shards, orange-red outside, yellow at the heart, its own light."""
    out = [glow(cx, cy, r * 3.2, "#ff4a1a", 0.45 * hot, "s30"), glow(cx, cy, r * 1.8, "#ff7a2a", 0.55 * hot, "s16")]
    shards = []
    for k in range(9):
        a = k * 2 * math.pi / 9 + rnd.uniform(-0.3, 0.3)
        d = r * rnd.uniform(0.15, 0.55)
        x, y = cx + math.cos(a) * d, cy + math.sin(a) * d
        rr = r * rnd.uniform(0.38, 0.6)
        pts = [(x + math.cos(a + j * 2.1 + rnd.uniform(-0.3, 0.3)) * rr, y + math.sin(a + j * 2.1) * rr * 0.9)
               for j in range(3)]
        shards.append(pts)
    cols = ["#ff5a24", "#ff6f2a", "#ff8a34", "#ff5022", "#ff7a30", "#ff9a3c", "#ff6428", "#ff7f2e", "#e84a1e"]
    for pts, col in zip(shards, cols):
        out.append(f'<polygon points="{P(pts)}" fill="{col}" stroke="#ffc070" stroke-width="1.5" stroke-linejoin="round"/>')
    out.append(f'<circle cx="{f(cx)}" cy="{f(cy)}" r="{f(r * 0.42)}" fill="#ffd36a" filter="url(#s4)"/>'
               f'<circle cx="{f(cx)}" cy="{f(cy)}" r="{f(r * 0.2)}" fill="#ffe9a8"/>')
    return "".join(out)


def build():
    s = Svg("Rn", COLOR)
    setup(s)
    background(s, glows=[(330, 470, 360, 0.7), (800, 330, 360, 0.65)], seed=1909, stars=34,
               star_box=(0, 0, 1200, 300), bokeh=5)
    rnd = random.Random(1909)
    s.d(lin("bench", [(0, "#5a3a26"), (0.15, "#43291a"), (1, "#1f140c")], x1=0, y1=0, x2=0, y2=1))

    # ---------- the bench and the back wall's shelf of bottles
    s.a(f'<rect x="0" y="{FLOOR}" width="1200" height="{800 - FLOOR}" fill="url(#bench)"/>',
        f'<rect x="0" y="{FLOOR}" width="1200" height="4" fill="#a87a52" opacity="0.6"/>')
    s.a('<rect x="0" y="230" width="560" height="10" fill="#3a2a40" opacity="0.7"/>')
    for (x, w, h, col) in ((40, 30, 60, "#6aa0c8"), (84, 22, 44, "#c88a5a"), (420, 34, 70, "#8ac87a"), (470, 24, 48, "#9a7ac8")):
        s.a(f'<rect x="{x}" y="{230 - h}" width="{w}" height="{h}" rx="6" fill="{col}" opacity="0.3"/>',
            f'<rect x="{x + w * 0.3}" y="{230 - h - 12}" width="{w * 0.4}" height="14" rx="3" fill="{col}" opacity="0.3"/>')

    # ---------- the flask of liquid air
    cx, top, bottom, w = 300, 330, FLOOR - 6, 190
    body, level = flask(s, cx, top, bottom, w)
    # ---------- the capillary: from the manifold off the top left, down into the liquid air
    tip = (cx + 6, bottom - 70)
    path = [(-20, 120), (120, 118), (230, 140), (cx + 6, 210), (cx + 6, 330), tip]
    d = smooth(path, closed=False)
    s.a(f'<path d="{d}" fill="none" stroke="#d8ecff" stroke-width="11" stroke-linecap="round" opacity="0.35"/>',
        f'<path d="{d}" fill="none" stroke="#eaf4ff" stroke-width="3" stroke-linecap="round" opacity="0.9"/>')
    # a bulb of the manifold, top left, and a tap
    s.a(f'<circle cx="70" cy="118" r="34" fill="#bfe0ff" fill-opacity="0.08" stroke="#d8ecff" stroke-width="3" opacity="0.7"/>',
        f'<rect x="150" y="104" width="22" height="30" rx="5" fill="#b8892e"/>')
    # the mercury thread in the capillary above the tip
    s.a(f'<line x1="{f(tip[0])}" y1="{f(tip[1] - 140)}" x2="{f(tip[0])}" y2="{f(tip[1] - 14)}" stroke="#c9d0dc" '
        f'stroke-width="4.5" stroke-linecap="round"/>')
    s.a(body)
    # the speck glowing at the tip, through the liquid air
    s.a(crystal(tip[0], tip[1], 17, random.Random(7)))
    s.a(fog(cx, top, w))

    # ---------- the close-up of the tip
    mx, my, mr = 790, 320, 200
    opening, closing = magnifier(s, "zoomTip", mx, my, mr, COLOR, src=(tip[0], tip[1], 26), inner="#101633")
    s.a(opening)
    # liquid air all round: a cold blue, a few bubbles
    s.a(f'<rect x="{mx - mr}" y="{my - mr}" width="{2 * mr}" height="{2 * mr}" fill="#1e3766" opacity="0.75"/>')
    for _ in range(12):
        x, y = rnd.uniform(mx - mr, mx + mr), rnd.uniform(my - mr, my + mr)
        s.a(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(rnd.uniform(4, 10))}" fill="none" stroke="#bcdcff" stroke-width="2" opacity="0.4"/>')
    # the capillary, enormous: two glass walls coming down to a rounded end
    gx, gw, gend = mx - 6, 120, my + 120
    s.a(f'<path d="M{f(gx - gw / 2)},{f(my - mr - 10)} L{f(gx - gw / 2)},{f(gend - gw / 2)} '
        f'A{f(gw / 2)},{f(gw / 2)} 0 0 0 {f(gx + gw / 2)},{f(gend - gw / 2)} L{f(gx + gw / 2)},{f(my - mr - 10)}" '
        f'fill="#2a3f70" fill-opacity="0.55" stroke="#d8ecff" stroke-width="14" stroke-opacity="0.32"/>',
        f'<path d="M{f(gx - gw / 2)},{f(my - mr - 10)} L{f(gx - gw / 2)},{f(gend - gw / 2)} '
        f'A{f(gw / 2)},{f(gw / 2)} 0 0 0 {f(gx + gw / 2)},{f(gend - gw / 2)} L{f(gx + gw / 2)},{f(my - mr - 10)}" '
        f'fill="none" stroke="#eaf4ff" stroke-width="3" opacity="0.85"/>')
    # the glass glows faintly where the radon touches it (the liquid made it phosphoresce)
    s.a(f'<rect x="{f(gx - gw / 2 - 8)}" y="{f(my - 30)}" width="{f(gw + 16)}" height="160" rx="50" fill="#9a7cff" '
        f'opacity="0.16" filter="url(#s16)"/>')
    # the mercury thread above, silver, its round end pressing down
    s.a(f'<rect x="{f(gx - gw / 2 + 8)}" y="{f(my - mr - 10)}" width="{f(gw - 16)}" height="{f(mr - 40)}" rx="{f((gw - 16) / 2)}" '
        f'fill="#8f97a6"/>',
        f'<rect x="{f(gx - gw / 2 + 18)}" y="{f(my - mr - 10)}" width="18" height="{f(mr - 60)}" rx="9" fill="#e4e8ef" opacity="0.8"/>',
        f'<rect x="{f(gx + 20)}" y="{f(my - mr - 10)}" width="12" height="{f(mr - 70)}" rx="6" fill="#5d6574" opacity="0.8"/>')
    # the frozen radon, the light of its own decays round it
    ccx, ccy = gx, my + 52
    s.a(crystal(ccx, ccy, 60, random.Random(11)))
    for k in range(9):
        a = rnd.uniform(0, 2 * math.pi)
        r0, r1 = rnd.uniform(62, 72), rnd.uniform(96, 140)
        s.a(f'<line x1="{f(ccx + math.cos(a) * r0)}" y1="{f(ccy + math.sin(a) * r0)}" x2="{f(ccx + math.cos(a) * r1)}" '
            f'y2="{f(ccy + math.sin(a) * r1)}" stroke="#ffd08a" stroke-width="2.4" stroke-linecap="round" opacity="0.7"/>')
    for k in range(6):
        a = rnd.uniform(0, 2 * math.pi)
        rr = rnd.uniform(70, 150)
        s.a(sparkle(ccx + math.cos(a) * rr, ccy + math.sin(a) * rr, rnd.uniform(5, 9), "#ffe2b0", 0.85))
    s.a(closing)

    # ---------- the three colours as it gets colder, down the right
    bx = 1110
    s.d(lin("cold", [(0, "#ff8c42", 0.0), (0.2, "#9ad0ff", 0.5), (1, "#5a8cff", 0.7)], x1=0, y1=0, x2=0, y2=1))
    s.a(f'<rect x="{bx - 5}" y="150" width="10" height="330" rx="5" fill="url(#cold)"/>')
    s.a(arrow([(bx + 34, 170), (bx + 34, 470)], "#9ad0ff", w=5, op=0.75))
    for y, core, halo in ((190, "#c8dcff", "#5a8cff"), (320, "#ffe98a", "#ffc42a"), (450, "#ffb070", "#ff4a1a")):
        s.a(glow(bx, y, 40, halo, 0.6, "s16"),
            f'<circle cx="{bx}" cy="{y}" r="17" fill="{halo}"/>',
            f'<circle cx="{bx}" cy="{y}" r="9" fill="{core}"/>')
    s.a(snowflake(bx + 34, 512, 16, "#cfe2ff", 0.9))

    finish(s)
    s.save("glow")


if __name__ == "__main__":
    build()
