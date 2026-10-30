"""Board 'space': the edge of the Earth at night, and high above it a thin glowing layer of sodium atoms
(made very much higher than it is, to be seen). Shooting stars burn up into it and leave their sodium;
an observatory on a mountain shines a yellow-orange laser up at it and makes an artificial star there;
and in the sky a comet with three tails: a white one of dust, a blue one of ions, and between them the
narrow yellow tail of sodium that comet Hale-Bopp showed in 1997."""
import math
import os
import random
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from lib.style import *  # noqa: E402,F401

BLUE = "#6f8cff"
EC = (600, 4800)  # the Earth's centre, far below the picture
ER = 4300  # its radius (the top of the Earth at y = 500)
LAYER = ER + 250  # the sodium layer


def on(r, x):
    """The y of a circle round the Earth's centre, at x."""
    return EC[1] - math.sqrt(r * r - (x - EC[0]) ** 2)


def arc(r):
    return f"M-20,{f(on(r, -20))} A{r},{r} 0 0 1 1220,{f(on(r, 1220))}"


def build():
    s = Svg("Na", BLUE)
    background(s, glows=[(320, 260, 360, 0.55), (1000, 160, 300, 0.45)], seed=1929, stars=130,
               star_box=(0, 0, 1200, 520), bokeh=4, tint=0.55)
    rnd = random.Random(1997)
    s.d(lin("earth", [(0, "#123a5e"), (0.25, "#0b2340"), (1, "#050b1a")], x1=0, y1=500, x2=0, y2=800, user=True),
        lin("beam", [(0, "#ffd84a", 0.05), (0.15, "#ffb21e", 0.5), (1, "#ffcf4a", 0.95)], x1=0, y1=250, x2=0, y2=505, user=True),
        rad("star", [(0, "#ffffff"), (0.2, "#fff2a0"), (0.5, "#ffb21e", 0.6), (1, "#ffb21e", 0)]),
        rad("coma", [(0, "#ffffff"), (0.25, "#e8f4ff", 0.9), (0.6, "#9fd0ff", 0.35), (1, "#9fd0ff", 0)]),
        lin("dust", [(0, "#ffffff", 0.7), (0.5, "#fff4e0", 0.3), (1, "#fff4e0", 0)], x1=1, y1=0.5, x2=0, y2=0.5),
        lin("ions", [(0, "#8fd0ff", 0.95), (1, "#4a8cff", 0)], x1=1, y1=0.5, x2=0, y2=0.5),
        lin("natail", [(0, "#ffe066", 1), (1, "#ffb21e", 0)], x1=1, y1=0.5, x2=0, y2=0.5),
        lin("meteor", [(0, "#ffffff", 0), (0.7, "#fff2c0", 0.7), (1, "#ffffff", 1)], x1=0, y1=0, x2=1, y2=0))

    # ---------- the comet, upper right: dust, ions and, between them, sodium
    hx, hy = 1070, 196

    def tail(ang, length, w0, w1):
        """A straight tail from the head, `ang` degrees, `length` long, from w0 wide to w1."""
        a = math.radians(ang)
        n = (math.cos(a + math.pi / 2), math.sin(a + math.pi / 2))
        ex, ey = hx + math.cos(a) * length, hy + math.sin(a) * length
        return [(hx + n[0] * w0, hy + n[1] * w0), (ex + n[0] * w1, ey + n[1] * w1), (ex - n[0] * w1, ey - n[1] * w1),
                (hx - n[0] * w0, hy - n[1] * w0)]

    # the dust tail: broad, curved, white
    dust = (f"M{hx},{hy - 8} C{hx - 140},{hy - 40} {hx - 300},{hy - 70} {hx - 470},{hy - 60} "
            f"L{hx - 460},{hy + 30} C{hx - 300},{hy + 14} {hx - 140},{hy + 10} {hx},{hy + 8}Z")
    s.a(f'<path d="{dust}" fill="url(#dust)" filter="url(#s4)"/>')
    # the ion tail: straight, blue, pointing right away from the Sun
    s.a(f'<polygon points="{P(tail(-157, 470, 4, 16))}" fill="url(#ions)" filter="url(#s2)"/>')
    # the sodium tail: straight and narrow, yellow, between the two
    s.a(f'<polygon points="{P(tail(-167, 450, 5, 16))}" fill="url(#natail)" filter="url(#s4)"/>',
        f'<polygon points="{P(tail(-167, 450, 3.5, 10))}" fill="url(#natail)"/>')
    s.a(f'<circle cx="{hx}" cy="{hy}" r="46" fill="url(#coma)"/>', f'<circle cx="{hx}" cy="{hy}" r="9" fill="#ffffff" filter="url(#g1)"/>')

    # ---------- the Earth, its thin blue air and its lights
    s.a(f'<path d="{arc(ER + 24)}" fill="none" stroke="#6fb4ff" stroke-width="40" opacity="0.25" filter="url(#s16)"/>',
        f'<path d="{arc(ER + 6)}" fill="none" stroke="#9fd6ff" stroke-width="8" opacity="0.7" filter="url(#s2)"/>',
        f'<path d="{arc(ER)} L1220,820 L-20,820Z" fill="url(#earth)"/>')
    for _ in range(40):
        x = rnd.uniform(560, 1180)
        y = on(ER, x) + rnd.uniform(12, 90)
        s.a(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(rnd.uniform(0.8, 2))}" fill="#ffd27a" opacity="{rnd.uniform(0.5, 0.95):.2f}"/>')

    # ---------- the sodium layer: a thin glowing shell, atoms glowing yellow in it
    s.a(f'<path d="{arc(LAYER)}" fill="none" stroke="#ffb21e" stroke-width="46" opacity="0.18" filter="url(#s16)"/>',
        f'<path d="{arc(LAYER)}" fill="none" stroke="#ffc83d" stroke-width="12" opacity="0.55" filter="url(#s4)"/>',
        f'<path d="{arc(LAYER)}" fill="none" stroke="#fff0a0" stroke-width="3" opacity="0.8"/>')
    for k in range(13):
        x = 40 + k * 92 + rnd.uniform(-20, 20)
        y = on(LAYER, x) + rnd.uniform(-8, 8)
        s.a(glow(x, y, 15, "#ffd84a", 0.7, "s4"), ball(x, y, 9, "Na", shine=False))

    # ---------- shooting stars burning up into the layer, leaving sodium behind
    for (x1, y1, ln, ang) in ((600, 236, 230, 205), (780, 238, 190, 212), (180, 252, 170, 200), (930, 248, 150, 208)):
        a = math.radians(ang)
        x0, y0 = x1 + math.cos(a) * ln, y1 + math.sin(a) * ln
        n = (math.cos(a + math.pi / 2) * 4.5, math.sin(a + math.pi / 2) * 4.5)
        s.d(lin(f"m{x1}", [(0, "#ffffff", 0), (0.75, "#fff2c0", 0.65), (1, "#ffffff", 1)], x1=x0, y1=y0, x2=x1, y2=y1, user=True))
        s.a(f'<polygon points="{P([(x0, y0), (x1 + n[0], y1 + n[1]), (x1 - n[0], y1 - n[1])])}" fill="url(#m{x1})" filter="url(#s1)"/>',
            glow(x1, y1, 16, "#fff2c0", 0.8, "s4"), f'<circle cx="{x1}" cy="{y1}" r="5" fill="#ffffff"/>')
        for j in range(5):
            px = x1 + rnd.uniform(-26, 26)
            py = y1 + rnd.uniform(8, 22)
            s.a(f'<circle cx="{f(px)}" cy="{f(py)}" r="{f(rnd.uniform(2, 3.5))}" fill="#ffd84a" opacity="0.85"/>')

    # ---------- the observatory on its mountain, its laser making an artificial star in the layer
    ridge = [(-20, on(ER, -20) + 4), (120, 520), (230, 470), (300, 452), (360, 452), (430, 476), (540, 506), (680, on(ER, 680) + 2)]
    s.a(f'<path d="{smooth(ridge, closed=False)} L680,700 L-20,700Z" fill="url(#earth)"/>',
        f'<path d="{smooth(ridge[1:6], closed=False)}" fill="none" stroke="#3a5a8a" stroke-width="3" opacity="0.7"/>')
    ox, oy = 330, 452
    tx, ty = ox + 6, on(LAYER, ox + 6)
    s.a(f'<polygon points="{P([(ox - 6, oy - 44), (ox + 8, oy - 44), (tx + 3, ty), (tx - 3, ty)])}" fill="url(#beam)"/>',
        f'<polygon points="{P([(ox - 6, oy - 44), (ox + 8, oy - 44), (tx + 3, ty), (tx - 3, ty)])}" fill="url(#beam)" filter="url(#s4)"/>')
    s.a(f'<rect x="{ox - 40}" y="{oy - 24}" width="80" height="26" fill="#d8dee8"/>',
        f'<rect x="{ox - 40}" y="{oy - 24}" width="80" height="6" fill="#ffffff" opacity="0.6"/>',
        f'<path d="M{ox - 44},{oy - 22} A44,40 0 0 1 {ox + 44},{oy - 22}Z" fill="#eef2f8"/>',
        f'<path d="M{ox + 4},{oy - 61} A44,40 0 0 1 {ox + 44},{oy - 22} L{ox + 30},{oy - 22} A30,30 0 0 0 {ox + 4},{oy - 50}Z" fill="#b8c4d6"/>',
        f'<rect x="{ox - 6}" y="{oy - 62}" width="14" height="40" rx="3" fill="#2a3450"/>')
    s.a(f'<circle cx="{f(tx)}" cy="{f(ty)}" r="60" fill="url(#star)"/>',
        sparkle(tx, ty, 34, "#ffffff", 0.95), f'<circle cx="{f(tx)}" cy="{f(ty)}" r="7" fill="#ffffff"/>')
    finish(s)
    s.save("space")


if __name__ == "__main__":
    build()
