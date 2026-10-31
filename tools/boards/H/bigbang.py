"""Board 'bigbang': the universe growing from left to right, a horn that widens with time. Near its tip a
hot glowing fog of free protons, electrons and a few helium nuclei, the light zig-zagging between them;
where it has cooled the fog clears: each proton has caught its electron, the first hydrogen atoms (and a
few helium ones) float in clear space, the light flies straight, and far off the first stars light up."""
import math
import os
import random
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from hkit import *  # noqa: E402,F401

COLOR = "#ff9e4a"
CY = 318  # the horn's middle line
X0, X1 = 36, 1200
CLEAR = 600  # where the fog clears


def half(x):
    """The horn's half-height at x: it widens with time."""
    return 10 + max(0.0, x - X0) ** 0.76 * 1.36


def top(x):
    return CY - half(x) * 1.0


def bot(x):
    return CY + half(x) * 0.93


def inside(x, y, m=0):
    return top(x) + m < y < bot(x) - m


def build():
    s = Svg("H", COLOR)
    particles(s)
    background(s, glows=[(150, 320, 300, 0.9), (900, 300, 360, 0.35)], seed=1380, stars=38, star_box=(640, 0, 1200, 600), bokeh=3)
    rnd = random.Random(13800)

    # ---------- the horn: its outline, the fog in it, the clear part
    xs = [X0 + i * (X1 - X0) / 80 for i in range(81)]
    up = [(x, top(x)) for x in xs]
    lo = [(x, bot(x)) for x in reversed(xs)]
    horn = poly(up + lo)
    s.d(f'<clipPath id="horn"><path d="{horn}"/></clipPath>',
        lin("fog", [(0, "#ffe2a6"), (0.05, "#ffbf5e"), (0.22, "#ff8f3a"), (0.38, "#e2582c"), (0.46, "#b33a34"),
                    (0.52, "#4a2346"), (0.6, "#1e1c46"), (1, "#121638")], x1=X0, y1=0, x2=X1, y2=0, user=True),
        lin("hornRim", [(0, "#ffd08a", 0.9), (0.5, COLOR, 0.55), (1, COLOR, 0.25)], x1=X0, y1=0, x2=X1, y2=0, user=True))
    s.a(f'<path d="{horn}" fill="url(#fog)"/>')
    s.a('<g clip-path="url(#horn)">')
    # the fog's billows, thick near the tip, thinning out where it clears
    for _ in range(90):
        x = X0 + (rnd.random() ** 1.3) * (CLEAR + 40 - X0)
        y = CY + (rnd.random() - 0.5) * 2 * half(x)
        col = rnd.choice(["#ffb35a", "#ff9a48", "#ff7a3a", "#e8603a"])
        k = max(0.0, 1 - (x - X0) / (CLEAR + 60 - X0))
        s.a(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(18 + rnd.random() * 40)}" fill="{col}" opacity="{0.08 + 0.18 * k:.2f}" filter="url(#s16)"/>')
    # the clear part: a few faint wisps of the last fog
    for _ in range(10):
        x = CLEAR + rnd.random() * 120
        y = CY + (rnd.random() - 0.5) * 1.6 * half(x)
        s.a(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(24 + rnd.random() * 30)}" fill="#c0503a" opacity="0.1" filter="url(#s16)"/>')

    # light in the fog: short wavy steps, each turned by a bump into a particle
    def zig(x, y, n, step):
        pts = [(x, y)]
        a = rnd.uniform(-1, 1)
        for _ in range(n):
            a += rnd.uniform(-1.7, 1.7)
            x += math.cos(a) * step
            y += math.sin(a) * step
            pts.append((x, y))
        return pts
    for _ in range(9):
        x = rnd.uniform(110, CLEAR - 70)
        y = CY + rnd.uniform(-0.6, 0.6) * half(x)
        pts = zig(x, y, 5, rnd.uniform(26, 40))
        if all(inside(px, py, 8) for px, py in pts):
            for (ax, ay), (bx, by) in zip(pts, pts[1:]):
                n = 18
                d = math.hypot(bx - ax, by - ay)
                ux, uy = (bx - ax) / d, (by - ay) / d
                w = [(ax + ux * d * i / n - uy * math.sin(i / n * math.tau * 2) * 3, ay + uy * d * i / n + ux * math.sin(i / n * math.tau * 2) * 3) for i in range(n + 1)]
                s.a(f'<path d="{smooth(w, closed=False)}" fill="none" stroke="#fff0b8" stroke-width="2.4" stroke-linecap="round" opacity="0.75"/>')
            s.a(sparkle(pts[-1][0], pts[-1][1], 5, "#fff6d0", 0.8))
    # free protons and electrons, and a few helium nuclei, crowded near the tip
    for _ in range(170):
        x = X0 + 60 + (rnd.random() ** 1.15) * (CLEAR + 10 - X0 - 60)
        y = CY + rnd.uniform(-0.92, 0.92) * half(x)
        if not inside(x, y, 6):
            continue
        k = rnd.random()
        sz = 0.75 + (x - X0) / (CLEAR - X0) * 0.55
        if k < 0.46:
            s.a(sball(x, y, 4.2 * sz, "pP", shine=False))
        elif k < 0.93:
            s.a(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(2.4 * sz)}" fill="{ELECTRON}" opacity="0.95"/>')
        else:
            s.a(nucleus(x, y, 5.5 * sz, seed=int(x * 7)))
    # the hot tip
    s.a(glow(X0 + 30, CY, 70, "#fff0c0", 0.7, "s16"), glow(X0 + 18, CY, 26, "#fffbe8", 0.95, "s8"))

    # ---------- the clear part: the first atoms, the light flying straight (fading in where the fog thins)
    s.d(lin("freeLight", [(0, "#ffd98a", 0), (0.3, "#ffd98a", 0.55), (1, "#ffd98a", 0.4)], x1=CLEAR - 40, y1=0, x2=X1, y2=0, user=True))
    for i in range(7):
        y = CY + (i - 3) / 3.4 * half(CLEAR + 40)
        d = []
        for k in range(61):
            x = CLEAR - 30 + k * (X1 - CLEAR + 30) / 60
            d.append((x, y + (y - CY) * (x - CLEAR) / 1400 + math.sin(k * 0.9 + i) * 3.2))
        s.a(f'<path d="{smooth(d, closed=False)}" fill="none" stroke="url(#freeLight)" stroke-width="2.4" stroke-linecap="round"/>')
    atoms = []
    tries = 0
    while len(atoms) < 22 and tries < 900:
        tries += 1
        x = rnd.uniform(CLEAR + 30, 1150)
        y = CY + rnd.uniform(-0.88, 0.88) * half(x)
        R = rnd.uniform(16, 30) * (0.8 + (x - CLEAR) / 1400)
        if not inside(x, y, R * 0.6) or y > 600:
            continue
        if any(math.hypot(x - ax, y - ay) < (R + aR) * 1.05 for ax, ay, aR, _ in atoms):
            continue
        if math.hypot(x - 820, y - 300) < 120 or (x > 980 and y < 230):
            continue
        atoms.append((x, y, R, "He" if len(atoms) in (4, 11) else "H"))
    for (x, y, R, kind) in sorted(atoms, key=lambda a: a[2]):
        if kind == "He":
            s.a(heatom(x, y, R * 1.05, rot=rnd.uniform(-30, 30), phase=rnd.uniform(0, 6.28), op=0.92))
        else:
            s.a(hatom(x, y, R, rot=rnd.uniform(-40, 40), tilt=rnd.uniform(0.3, 0.55), phase=rnd.uniform(0, 6.28), op=0.92))
    # the hero: one big hydrogen atom, its electron just caught
    hx, hy, hR = 820, 300, 78
    s.a(glow(hx, hy, hR * 1.3, COLOR, 0.18, "s30"))
    s.a(hatom(hx, hy, hR, tilt=0.42, rot=-16, phase=0.75, glow_op=0.6))
    # the first stars, far off at the wide end, and a young galaxy
    for (x, y, r) in ((1085, 150, 9), (1140, 205, 6), (1030, 112, 5), (1160, 120, 4)):
        s.a(glow(x, y, r * 2.6, "#9fc0ff", 0.4, "s4"), star_burst(x, y, r * 2.6, r * 0.45, 4, "#dce8ff", 0.95, rot=12),
            f'<circle cx="{x}" cy="{y}" r="{f(r * 0.6)}" fill="#ffffff"/>')
    s.a("</g>")
    # the horn's rim
    s.a(f'<path d="{smooth(up, closed=False)}" fill="none" stroke="url(#hornRim)" stroke-width="4"/>',
        f'<path d="{smooth(list(reversed(lo)), closed=False)}" fill="none" stroke="url(#hornRim)" stroke-width="4"/>')
    finish(s)
    s.save("bigbang")


if __name__ == "__main__":
    build()
