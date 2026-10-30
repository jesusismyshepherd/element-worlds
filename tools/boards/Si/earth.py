"""Board 'earth': the Earth with a slice cut out, so you see inside: a thin crust, the thick green mantle
of silicate rock (olivine), the orange outer core and the yellow inner core of iron. Beside it the grey
Moon, made of the same kind of rock. Far off, a giant star bursting (a supernova), throwing out the silicon
it made. A close-up of the mantle's olivine: silicon in its four oxygens, with magnesium and iron between."""
import math
import os
import random
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from lib.style import *  # noqa: E402,F401

OLIVE = "#a6d64a"


def wedge(cx, cy, r, a0, a1):
    """A pie slice from angle a0 to a1 (degrees, clockwise from east, y down)."""
    x0, y0 = cx + math.cos(math.radians(a0)) * r, cy + math.sin(math.radians(a0)) * r
    x1, y1 = cx + math.cos(math.radians(a1)) * r, cy + math.sin(math.radians(a1)) * r
    large = 1 if (a1 - a0) % 360 > 180 else 0
    return f"M{f(cx)},{f(cy)} L{f(x0)},{f(y0)} A{f(r)},{f(r)} 0 {large} 1 {f(x1)},{f(y1)}Z"


def earth(s, cx, cy, R, rnd):
    s.d(rad("ocean", [(0, "#3a8ae0"), (0.7, "#1f5aa8"), (1, "#123a78")], cx=0.38, cy=0.35, r=0.75),
        rad("mantle", [(0, "#4a6a1a"), (0.45, "#6a9a2a"), (0.9, "#9ccc3e"), (1, "#b8dc5a")], cx=0.5, cy=0.5, r=0.5),
        rad("outer", [(0, "#ffb84d"), (1, "#e0661a")]),
        rad("inner", [(0, "#ffe9a0"), (0.7, "#ffd04a"), (1, "#f0a828")]))
    out = [glow(cx, cy, R * 1.06, "#7fb8ff", 0.45, "s16"),
           f'<circle cx="{f(cx)}" cy="{f(cy)}" r="{f(R)}" fill="url(#ocean)"/>']
    # the continents: soft green and brown blobs, clipped to the ball
    s.d(f'<clipPath id="earthClip"><circle cx="{f(cx)}" cy="{f(cy)}" r="{f(R)}"/></clipPath>')
    land = []
    for (dx, dy, rr, col) in ((-0.45, -0.35, 0.32, "#4a9a3a"), (-0.6, 0.1, 0.26, "#5aaa42"), (-0.25, 0.45, 0.3, "#8a7a3a"),
                              (0.05, 0.62, 0.22, "#4a9a3a"), (-0.72, -0.05, 0.18, "#c8a860")):
        pts = []
        for k in range(10):
            a = k / 10 * math.tau
            q = rr * R * rnd.uniform(0.7, 1.15)
            pts.append((cx + dx * R + math.cos(a) * q, cy + dy * R + math.sin(a) * q * 0.8))
        land.append(f'<path d="{smooth(pts)}" fill="{col}"/>')
    # clouds
    for (dx, dy, w) in ((-0.55, -0.6, 0.35), (-0.2, 0.25, 0.3), (-0.75, 0.42, 0.25)):
        land.append(f'<ellipse cx="{f(cx + dx * R)}" cy="{f(cy + dy * R)}" rx="{f(w * R)}" ry="{f(w * R * 0.18)}" fill="#e8f0ff" opacity="0.5"/>')
    out.append('<g clip-path="url(#earthClip)">' + "".join(land) + "</g>")
    # the shade on the night side
    s.d(rad("night", [(0.5, "#000814", 0), (1, "#000814", 0.6)], cx=0.3, cy=0.3, r=0.9))
    out.append(f'<circle cx="{f(cx)}" cy="{f(cy)}" r="{f(R)}" fill="url(#night)"/>')
    # the slice cut out (top right quarter): crust, mantle, outer core, inner core
    a0, a1 = -80, 10
    out.append(f'<path d="{wedge(cx, cy, R, a0, a1)}" fill="#6a4a2a"/>')
    out.append(f'<path d="{wedge(cx, cy, R * 0.975, a0, a1)}" fill="url(#mantle)"/>')
    # the mantle's grains of olivine, flecks of green
    s.d(f'<clipPath id="mantleClip"><path d="{wedge(cx, cy, R * 0.97, a0, a1)}"/></clipPath>')
    flecks = []
    for _ in range(160):
        a = math.radians(rnd.uniform(a0, a1))
        q = rnd.uniform(0.56, 0.96) * R
        flecks.append(f'<circle cx="{f(cx + math.cos(a) * q)}" cy="{f(cy + math.sin(a) * q)}" r="{f(rnd.uniform(2, 5))}" '
                      f'fill="{rnd.choice(["#c8e85a", "#5a8a20", "#b0d84a", "#3a5a14"])}" opacity="0.75"/>')
    out.append('<g clip-path="url(#mantleClip)">' + "".join(flecks) + "</g>")
    out.append(f'<path d="{wedge(cx, cy, R * 0.55, a0, a1)}" fill="url(#outer)"/>')
    out.append(f'<path d="{wedge(cx, cy, R * 0.19, a0, a1)}" fill="url(#inner)"/>')
    # the cut's edges
    for a in (a0, a1):
        x, y = cx + math.cos(math.radians(a)) * R, cy + math.sin(math.radians(a)) * R
        out.append(f'<line x1="{f(cx)}" y1="{f(cy)}" x2="{f(x)}" y2="{f(y)}" stroke="#20301a" stroke-width="3" opacity="0.6"/>')
    s.a("".join(out))


def moon(s, cx, cy, R, rnd):
    s.d(rad("moon", [(0, "#c8ccd4"), (0.6, "#9aa0ac"), (1, "#5a6070")], cx=0.38, cy=0.34, r=0.75))
    out = [glow(cx, cy, R * 1.2, "#d8dcff", 0.3, "s16"), f'<circle cx="{f(cx)}" cy="{f(cy)}" r="{f(R)}" fill="url(#moon)"/>']
    s.d(f'<clipPath id="moonClip"><circle cx="{f(cx)}" cy="{f(cy)}" r="{f(R)}"/></clipPath>')
    spots = []
    for (dx, dy, rr) in ((-0.3, -0.25, 0.3), (0.15, -0.05, 0.22), (-0.05, 0.35, 0.26), (0.4, 0.3, 0.14)):
        spots.append(f'<ellipse cx="{f(cx + dx * R)}" cy="{f(cy + dy * R)}" rx="{f(rr * R)}" ry="{f(rr * R * 0.8)}" fill="#6a707e" opacity="0.7"/>')
    for _ in range(12):
        x, y = cx + rnd.uniform(-0.8, 0.8) * R, cy + rnd.uniform(-0.8, 0.8) * R
        rr = rnd.uniform(3, 9)
        spots.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(rr)}" fill="#7a808e"/><circle cx="{f(x + 1)}" cy="{f(y + 1)}" r="{f(rr * 0.7)}" fill="#a8aebb"/>')
    out.append('<g clip-path="url(#moonClip)">' + "".join(spots) + "</g>")
    s.d(rad("moonNight", [(0.55, "#000814", 0), (1, "#000814", 0.55)], cx=0.3, cy=0.3, r=0.9))
    out.append(f'<circle cx="{f(cx)}" cy="{f(cy)}" r="{f(R)}" fill="url(#moonNight)"/>')
    s.a("".join(out))


def supernova(s, x, y, rnd):
    s.d(rad("nova", [(0, "#fff4d0"), (0.2, "#ffd36a", 0.9), (0.5, "#ff7a8a", 0.35), (1, "#a48cff", 0)]))
    s.a(f'<circle cx="{x}" cy="{y}" r="150" fill="url(#nova)"/>',
        star_burst(x, y, 70, 14, 8, "#ffe9a8", 0.85, rot=10), star_burst(x, y, 44, 10, 8, "#ffffff", 0.9, rot=32),
        f'<circle cx="{x}" cy="{y}" r="14" fill="#ffffff"/>')
    # a ring of hot gas thrown out, and silicon atoms flying from it
    s.a(f'<circle cx="{x}" cy="{y}" r="112" fill="none" stroke="#ff9aa8" stroke-width="4" stroke-dasharray="10 14" opacity="0.6"/>')
    for (a, d, r) in ((15, 150, 12), (55, 175, 13), (95, 160, 11), (-20, 190, 10), (35, 230, 12), (75, 245, 10)):
        t = math.radians(a)
        bx, by = x + math.cos(t) * d, y + math.sin(t) * d
        tx, ty = x + math.cos(t) * (d - 46), y + math.sin(t) * (d - 46)
        s.d(lin(f"trail{a}", [(0, "#ffd36a", 0), (1, "#ffd36a", 0.7)], x1=tx, y1=ty, x2=bx, y2=by, user=True))
        s.a(f'<line x1="{f(tx)}" y1="{f(ty)}" x2="{f(bx)}" y2="{f(by)}" stroke="url(#trail{a})" stroke-width="{f(r * 0.8)}" stroke-linecap="round"/>',
            ball(bx, by, r, "Si"))


def build():
    s = Svg("Si", OLIVE)
    background(s, glows=[(470, 330, 380, 0.7), (130, 120, 260, 0.5)], seed=2014, stars=140, star_box=(0, 0, 1200, 620), bokeh=4, tint=0.5)
    rnd = random.Random(382)
    supernova(s, 160, 135, rnd)

    # ---------- the Earth, cut open, and the Moon
    ex, ey, er = 470, 360, 235
    earth(s, ex, ey, er, rnd)
    moon(s, 830, 150, 72, rnd)

    # ---------- a close-up of the mantle: olivine, SiO4 with magnesium and iron between
    a = math.radians(-35)
    sx, sy = ex + math.cos(a) * er * 0.78, ey + math.sin(a) * er * 0.78
    cx, cy, r = 990, 430, 140
    opening, closing = magnifier(s, "zoomOlivine", cx, cy, r, OLIVE, src=(sx, sy, 22))
    s.a(opening)
    s.a(f'<rect x="{cx - r}" y="{cy - r}" width="{2 * r}" height="{2 * r}" fill="#3a5a14" opacity="0.35"/>')
    units = []
    for j in range(-1, 2):
        for i in range(-2, 2):
            units.append((cx + i * 112 + 56 + (j % 2) * 28, cy + j * 96))
    # magnesium (green) and a few iron (orange) between the tetrahedra
    for k, (x, y) in enumerate(units):
        s.a(ball(x + 56, y + 46, 18, "Fe" if k in (1, 6) else "Mg"))
        if k % 4 == 0:
            s.a(ball(x - 56, y + 46, 18, "Mg"))
    for (x, y) in units:
        # a tetrahedron seen from above: a tinted triangle, an oxygen at each corner, silicon in the middle
        # (its fourth oxygen sits right above the silicon; drawn as a ring round it)
        cs = [(x + math.cos(math.radians(t)) * 34, y + math.sin(math.radians(t)) * 34) for t in (90, 210, 330)]
        s.a(f'<polygon points="{P(cs)}" fill="#e2b486" opacity="0.35" stroke="#e2b486" stroke-width="3" stroke-linejoin="round"/>')
        for (ox, oy) in cs:
            s.a(bond(x, y, ox, oy, 5, "#8a6a5a"))
        s.a(ball(x, y, 15, "Si"))
        for (ox, oy) in cs:
            s.a(ball(ox, oy, 14, "O"))
    s.a(closing)
    finish(s)
    s.save("earth")


if __name__ == "__main__":
    build()
