"""Board 'salt': the salt pans of Aveiro under a big sun. Pools run from the sea to the front, each
saltier and paler than the last; white heaps of salt stand on the walls, a marnoto's rake leans on one.
In the front pool sodium (violet) and chloride (green) ions stay in the water while water molecules rise
towards the sun: the sun takes the water, the salt stays behind."""
import math
import os
import random
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from lib.style import *  # noqa: E402,F401

TEAL = "#3fd6c6"
HZ = 280  # the horizon
K = 300  # how fast the ground comes towards you
SX = 0.5  # how wide the view is


def pt(X, Z):
    """A point on the ground (X across, Z away from you) on the picture."""
    return 600 + X * K / Z * SX, HZ + K / Z


def scale(Z):
    """Pixels per ground unit at distance Z."""
    return K / Z * SX


def quad(x0, x1, z0, z1, inset=0.0):
    a, b = x0 + inset, x1 - inset
    n, m = z0 + inset * 0.12, z1 - inset * 0.12
    return [pt(a, n), pt(b, n), pt(b, m), pt(a, m)]


def heap(cx, by, w, h, rnd):
    """A conical heap of white salt, shaded, with a few crystals catching the sun."""
    out = []
    left = (cx - w / 2, by)
    right = (cx + w / 2, by)
    top = (cx + w * 0.04, by - h)
    shape = (f"M{f(left[0])},{f(left[1])} Q{f(cx - w * 0.22)},{f(by - h * 0.62)} {f(top[0] - w * 0.06)},{f(top[1] + h * 0.04)} "
             f"Q{f(top[0])},{f(top[1] - h * 0.03)} {f(top[0] + w * 0.06)},{f(top[1] + h * 0.05)} "
             f"Q{f(cx + w * 0.26)},{f(by - h * 0.6)} {f(right[0])},{f(right[1])} Q{f(cx)},{f(by + h * 0.08)} {f(left[0])},{f(left[1])}Z")
    out.append(f'<ellipse cx="{f(cx + w * 0.12)}" cy="{f(by + 2)}" rx="{f(w * 0.62)}" ry="{f(h * 0.1)}" fill="#0d3a48" opacity="0.5"/>')
    out.append(f'<path d="{shape}" fill="url(#salt)"/>')
    # the side away from the sun in a cool shade
    shade = (f"M{f(top[0] - w * 0.04)},{f(top[1] + h * 0.06)} Q{f(cx - w * 0.2)},{f(by - h * 0.55)} {f(left[0])},{f(left[1])} "
             f"Q{f(cx - w * 0.16)},{f(by + h * 0.05)} {f(cx - w * 0.06)},{f(by + h * 0.02)} Q{f(cx - w * 0.06)},{f(by - h * 0.5)} "
             f"{f(top[0] - w * 0.04)},{f(top[1] + h * 0.06)}Z")
    out.append(f'<path d="{shade}" fill="#9fc2d6" opacity="0.55"/>')
    for _ in range(int(w / 9)):
        t = rnd.uniform(0.1, 0.9)
        y = by - h * t
        half = w / 2 * (1 - t) * 0.9
        x = cx + rnd.uniform(-half, half)
        out.append(f'<rect x="{f(x)}" y="{f(y)}" width="{f(rnd.uniform(2.5, 4.5))}" height="{f(rnd.uniform(2.5, 4.5))}" '
                   f'fill="#ffffff" transform="rotate({rnd.randint(0, 45)} {f(x)} {f(y)})"/>')
    return "".join(out)


def build():
    s = Svg("Na", TEAL)
    rnd = random.Random(959)
    s.d(lin("sky", [(0, mix(TEAL, NAVY, 0.72)), (0.38, mix(TEAL, "#2a6a9a", 0.4)), (0.72, "#ffc98a"), (1, "#ffe6b0")],
            x1=0, y1=0, x2=0, y2=HZ + 6, user=True),
        rad("sunF", [(0, "#ffffff"), (0.55, "#fff4c4"), (1, "#ffd27a")]),
        rad("sunG", [(0, "#fff3c0", 0.85), (0.35, "#ffe0a0", 0.35), (1, "#ffc27a", 0)]),
        lin("sea", [(0, "#4fb6d8"), (1, "#2b7fb0")], x1=0, y1=0, x2=0, y2=1),
        lin("salt", [(0, "#ffffff"), (0.6, "#f2fbff"), (1, "#cfe6f2")], x1=0, y1=0, x2=0, y2=1),
        lin("wall", [(0, "#c99a62"), (1, "#7a5232")], x1=0, y1=0, x2=0, y2=1),
        lin("ground", [(0, "#8a6a44"), (0.55, "#5a4230"), (1, "#1e1610")], x1=0, y1=0, x2=0, y2=1),
        lin("pool0", [(0, "#4fd6e6"), (1, "#1f8fb0")], x1=0, y1=0, x2=0, y2=1),
        rad("glint", [(0, "#ffffff", 0.9), (0.4, "#fff6d0", 0.4), (1, "#fff6d0", 0)]))

    # ---------- sky and sun
    s.a(f'<rect width="1200" height="{HZ + 6}" fill="url(#sky)"/>')
    s.a(starfield(TEAL, seed=4, stars=18, box=(0, 0, 1200, 110), bokeh=0))
    sx, sy = 930, 132
    s.a(f'<circle cx="{sx}" cy="{sy}" r="210" fill="url(#sunG)"/>')
    for k in range(14):
        a = math.radians(k * 360 / 14 + 8)
        s.a(f'<line x1="{f(sx + math.cos(a) * 66)}" y1="{f(sy + math.sin(a) * 66)}" x2="{f(sx + math.cos(a) * 92)}" '
            f'y2="{f(sy + math.sin(a) * 92)}" stroke="#fff0b8" stroke-width="7" stroke-linecap="round" opacity="0.85"/>')
    s.a(f'<circle cx="{sx}" cy="{sy}" r="52" fill="url(#sunF)" filter="url(#g2)"/>')
    # two gulls
    for (gx, gy, gs) in ((330, 120, 1.0), (392, 96, 0.75)):
        s.a(f'<path d="M{f(gx - 22 * gs)},{f(gy)} Q{f(gx - 10 * gs)},{f(gy - 12 * gs)} {f(gx)},{f(gy)} '
            f'Q{f(gx + 10 * gs)},{f(gy - 12 * gs)} {f(gx + 22 * gs)},{f(gy)}" fill="none" stroke="#1c2a48" '
            f'stroke-width="{f(4 * gs)}" stroke-linecap="round" stroke-linejoin="round"/>')

    # ---------- the sea on the left of the horizon, the dunes and the far shore on the right
    s.a(f'<path d="M0,{HZ - 10} L560,{HZ - 10} L620,{HZ + 6} L0,{HZ + 6}Z" fill="url(#sea)"/>')
    for k in range(9):
        x = 30 + k * 62 + rnd.uniform(-10, 10)
        s.a(f'<path d="M{f(x)},{HZ - 4} q8,-4 16,0" fill="none" stroke="#e6fbff" stroke-width="2.5" stroke-linecap="round" opacity="0.8"/>')
    s.a(f'<path d="M540,{HZ - 10} Q640,{HZ - 26} 760,{HZ - 18} Q880,{HZ - 30} 1000,{HZ - 20} Q1110,{HZ - 30} 1200,{HZ - 22} '
        f'L1200,{HZ + 6} L540,{HZ + 6}Z" fill="#6f8a6a"/>')
    for (hx, hw, hh) in ((800, 22, 14), (826, 16, 11), (1060, 20, 13), (1084, 26, 16)):
        s.a(f'<rect x="{hx}" y="{HZ - 18 - hh}" width="{hw}" height="{hh}" fill="#f4efe6"/>',
            f'<path d="M{hx - 2},{HZ - 18 - hh} L{hx + hw / 2},{HZ - 26 - hh} L{hx + hw + 2},{HZ - 18 - hh}Z" fill="#c4563a"/>')

    # ---------- the ground and the pans: from blue seawater far away to white crust at the front
    s.a(f'<rect x="0" y="{HZ + 4}" width="1200" height="{800 - HZ - 4}" fill="url(#ground)"/>')
    zs = [0.5, 1.05, 1.5, 2.1, 2.9, 4.1, 6.2, 11, 30]
    xs = [-20, -12.5, -7.5, -2.5, 2.5, 7.5, 12.5, 20]
    pools = ["#ecfbf8", "#bff2ea", "#c8e8e2", "#93e6dc", "#62d2d4", "#41b8cd", "#2b98c0", "#2484b4"]
    inset = 0.42
    for zi in range(len(zs) - 2, -1, -1):
        z0, z1 = zs[zi], zs[zi + 1]
        for xi in range(len(xs) - 1):
            x0, x1 = xs[xi], xs[xi + 1]
            wall = quad(x0, x1, z0, z1)
            s.a(f'<polygon points="{P(wall)}" fill="url(#wall)"/>')
            if zi == 0:
                continue  # the front edge: earth only
            water = quad(x0, x1, z0, z1, inset=inset)
            col = pools[min(zi, len(pools) - 1)]
            s.a(f'<polygon points="{P(water)}" fill="{"url(#pool0)" if zi == 1 else col}"/>')
            # a strip of sky reflected along the far edge of each pool
            (ax, ay), (bx, by) = water[3], water[2]
            s.a(f'<line x1="{f(ax)}" y1="{f(ay + 2)}" x2="{f(bx)}" y2="{f(by + 2)}" stroke="#ffffff" '
                f'stroke-width="{f(max(1, 5 / zs[zi]))}" opacity="0.5"/>')
            if zi == 2:
                # the saltiest pools: a crust of crystals forming on them
                for _ in range(22):
                    u, v = rnd.uniform(0.05, 0.95), rnd.uniform(0.15, 0.85)
                    X = x0 + inset + (x1 - x0 - 2 * inset) * u
                    Z = z0 + (z1 - z0) * v
                    px, py = pt(X, Z)
                    sz = 10 / Z
                    s.a(f'<rect x="{f(px)}" y="{f(py)}" width="{f(sz)}" height="{f(sz * 0.7)}" fill="#ffffff" opacity="0.95" '
                        f'transform="rotate({rnd.randint(0, 40)} {f(px)} {f(py)})"/>')
    # the sun's glint on the far pools
    s.a(f'<ellipse cx="900" cy="{HZ + 24}" rx="160" ry="12" fill="url(#glint)"/>')

    # ---------- heaps of salt on the walls, a marnoto's rake leaning on the biggest
    heaps = [(-7.5, 2.05, 2.1, 1.7), (7.5, 2.2, 2.0, 1.55), (-2.5, 3.6, 1.8, 1.4), (12.5, 3.4, 1.8, 1.4),
             (2.5, 5.2, 1.7, 1.3), (-12.5, 3.1, 1.8, 1.4)]
    for (X, Z, wsz, hsz) in sorted(heaps, key=lambda h: -h[1]):
        bx, by = pt(X, Z)
        s.a(heap(bx, by, wsz * scale(Z), hsz * scale(Z), rnd))
    X, Z, wsz, hsz = heaps[0]
    rx, ry = pt(X, Z)
    w, h = wsz * scale(Z), hsz * scale(Z)
    pole = [(rx + w * 0.42, ry - h * 0.98), (rx + w * 0.62, ry + 14)]
    s.a(f'<line x1="{f(pole[0][0])}" y1="{f(pole[0][1])}" x2="{f(pole[1][0])}" y2="{f(pole[1][1])}" stroke="#6b4422" '
        f'stroke-width="7" stroke-linecap="round"/>',
        f'<line x1="{f(pole[0][0])}" y1="{f(pole[0][1])}" x2="{f(pole[1][0])}" y2="{f(pole[1][1])}" stroke="#c0884e" '
        f'stroke-width="2.5" stroke-linecap="round" transform="translate(-1.5,-1)"/>',
        f'<rect x="{f(pole[1][0] - 34)}" y="{f(pole[1][1] - 7)}" width="68" height="14" rx="3" fill="#8a5a2e" '
        f'stroke="#5a3818" stroke-width="2" transform="rotate(4 {f(pole[1][0])} {f(pole[1][1])})"/>')
    for (X, Z, wsz, hsz) in heaps[:4]:
        bx, by = pt(X, Z)
        s.a(sparkle(bx + wsz * scale(Z) * 0.12, by - hsz * scale(Z) * 0.62, 10, "#ffffff", 0.95))

    # ---------- the front pools: the ions stay, the water rises to the sun
    ions = [(-4.5, 1.36, "Cl"), (-3.5, 1.14, "Na"), (-1.6, 1.34, "Na"), (-0.6, 1.13, "Cl"), (0.5, 1.36, "Cl"),
            (1.5, 1.14, "Na"), (3.3, 1.34, "Na"), (4.0, 1.13, "Cl")]
    for (X, Z, el) in sorted(ions, key=lambda i: -i[1]):
        x, y = pt(X, Z)
        r = 30 / Z
        s.a(f'<ellipse cx="{f(x)}" cy="{f(y + r * 0.75)}" rx="{f(r * 1.2)}" ry="{f(r * 0.3)}" fill="#0a5a78" opacity="0.35"/>',
            ion(x, y - r * 0.1, r, el, "+" if el == "Na" else "-"))
    # the water lifting off: wavy heat lines and water molecules drifting up towards the sun
    for k, (x0, y0) in enumerate(((300, 470), (470, 462), (640, 470), (800, 462), (960, 470))):
        pts = [(x0 + 10 * math.sin(i * 1.3 + k), y0 - i * 17) for i in range(7)]
        s.a(f'<path d="{smooth(pts, closed=False)}" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" '
            f'opacity="0.6"/>')
    for (x, y, r, a) in ((392, 372, 16, -20), (560, 330, 15, 15), (720, 366, 16, 40), (640, 250, 13, -30), (820, 296, 13, 10),
                         (500, 236, 11, 60), (740, 196, 10, -10), (860, 214, 9, 30)):
        s.a(h2o(x, y, r, a, op=0.95))
    s.d(lin("low", [(0, NAVY_DEEP, 0), (1, NAVY_DEEP, 0.7)], x1=0, y1=560, x2=0, y2=800, user=True))
    s.a('<rect y="560" width="1200" height="240" fill="url(#low)"/>')
    finish(s)
    s.save("salt")


if __name__ == "__main__":
    build()
