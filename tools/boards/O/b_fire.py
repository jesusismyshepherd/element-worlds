"""Board 'fire': the fire triangle (fuel, heat, oxygen) around a bright flame."""
import math
import random
from kit import *


def tear(cx, by, w, h, bend=0.0, twist=0.12, n=15):
    """A flame tongue: round bottom at (cx, by), concave flanks tapering to a tip h above."""
    right, left = [], []
    for i in range(n + 1):
        u = i / n
        if u < 0.26:
            hw = w * math.sqrt(max(0.0, 1 - ((0.26 - u) / 0.26) ** 2))
        else:
            v = (u - 0.26) / 0.74
            hw = w * (1 - v) ** 1.55 * (1 + 0.18 * math.sin(v * math.pi))
        xo = bend * u ** 2.2
        wob = twist * w * math.sin(u * math.pi * 1.5)
        y = by - u * h
        right.append((cx + xo + hw + wob, y))
        left.append((cx + xo - hw + wob * 0.6, y))
    pts = list(reversed(right)) + left[1:]
    return smooth(pts, closed=True)


def flame(cx, by, k, parts=5):
    """Union of tongues, scaled by k (parts: 1, 3 or 5 tongues)."""
    d = tear(cx, by, 112 * k, 320 * k, 16 * k)
    if parts >= 3:
        d += (tear(cx - 68 * k, by - 6 * k, 58 * k, 200 * k, -46 * k, -0.15)
              + tear(cx + 72 * k, by - 6 * k, 60 * k, 232 * k, 50 * k, 0.15))
    if parts >= 5:
        d += (tear(cx - 112 * k, by - 4 * k, 36 * k, 118 * k, -40 * k, -0.2)
              + tear(cx + 116 * k, by - 4 * k, 34 * k, 104 * k, 34 * k, 0.2))
    return d


def build():
    s = Svg("#ffa94d")
    background(s, [(600, 360, 470, 0.85), (600, 360, 260, 0.6)], seed=21, stars=50)
    rnd = random.Random(3)
    T, L, R = (600, 112), (230, 520), (970, 520)

    s.d(lin("triS", [(0, "#ffe08a"), (0.5, "#ffa94d"), (1, "#ff6a2a")], x1=0, y1=0, x2=0, y2=1),
        rad("medF", [(0, "#2a2f5c"), (0.7, "#161b40"), (1, "#0f1330")], cx=0.5, cy=0.4, r=0.6),
        lin("logBark", [(0, "#a36a3c"), (0.5, "#7a4a26"), (1, "#4f2c14")], x1=0, y1=0, x2=0, y2=1),
        rad("logEnd", [(0, "#ffe2b0"), (0.7, "#e8b77a"), (1, "#c68a4c")]),
        rad("heatF", [(0, "#ffffff"), (0.3, "#fff2a0"), (0.65, "#ffb02e"), (1, "#ff5a1f")]),
        lin("fl1", [(0, "#ffb02e"), (0.55, "#ff6a1f"), (1, "#e2381a")], x1=0, y1=0, x2=0, y2=1),
        lin("fl2", [(0, "#ffd84a"), (1, "#ff9a1f")], x1=0, y1=0, x2=0, y2=1),
        lin("fl3", [(0, "#fff3a8"), (1, "#ffd23f")], x1=0, y1=0, x2=0, y2=1),
        rad("flBase", [(0, "#8fb4ff", 0.9), (1, "#4d7dff", 0)]),
        rad("hot", [(0, "#fff0b0", 0.9), (0.4, "#ffb02e", 0.45), (1, "#ff6a1f", 0)]))

    # ---------- triangle (glowing outline, rounded corners)
    tri = f"M{P([T])} L{P([R])} L{P([L])} Z"
    s.a(f'<path d="{tri}" fill="#ffa94d" opacity="0.07"/>',
        f'<path d="{tri}" fill="none" stroke="#ffa94d" stroke-width="30" stroke-linejoin="round" opacity="0.35" filter="url(#s16)"/>',
        f'<path d="{tri}" fill="none" stroke="url(#triS)" stroke-width="11" stroke-linejoin="round" filter="url(#g1)"/>',
        f'<path d="{tri}" fill="none" stroke="#fff4d6" stroke-width="3" stroke-linejoin="round" opacity="0.7"/>')

    # ---------- the flame in the middle
    fx, fby = 600, 430
    s.a(f'<ellipse cx="{fx}" cy="{fby - 120}" rx="230" ry="250" fill="url(#hot)"/>')
    s.a(f'<path d="{flame(fx, fby, 1.06, 3)}" fill="#ff6a1f" opacity="0.65" filter="url(#s16)"/>',
        f'<path d="{flame(fx, fby, 1.0)}" fill="url(#fl1)"/>',
        f'<path d="{flame(fx + 2, fby + 2, 0.76, 3)}" fill="url(#fl2)"/>',
        f'<path d="{tear(fx + 4, fby + 2, 62, 200, 12, 0.08)}" fill="url(#fl3)"/>',
        f'<path d="{tear(fx + 4, fby + 2, 34, 110, 6, 0.05)}" fill="#ffffff" opacity="0.9"/>',
        f'<ellipse cx="{fx}" cy="{fby - 4}" rx="70" ry="18" fill="url(#flBase)"/>')
    # glowing coal bed under the flame
    s.a(f'<ellipse cx="{fx}" cy="{fby + 14}" rx="130" ry="20" fill="#ff6a1f" opacity="0.6" filter="url(#s8)"/>')
    # sparks rising
    for i in range(14):
        x = fx + rnd.uniform(-150, 150)
        y = fby - rnd.uniform(200, 330)
        r = rnd.uniform(2, 4.5)
        s.a(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r)}" fill="#ffe08a" filter="url(#g1)" opacity="{rnd.uniform(0.6, 1):.2f}"/>')

    # small O2 molecules drifting from the top corner into the flame
    for (x, y, r, ang) in ((544, 224, 10.5, 30), (654, 246, 10.5, -40), (606, 200, 9, 80)):
        s.a(o2(x, y, r, ang, op=0.95))

    # ---------- medallions at the corners
    def medal(x, y):
        s.a(f'<circle cx="{x}" cy="{y}" r="96" fill="#ffa94d" opacity="0.35" filter="url(#s16)"/>',
            f'<circle cx="{x}" cy="{y}" r="86" fill="url(#medF)" stroke="#ffa94d" stroke-width="7"/>',
            f'<circle cx="{x}" cy="{y}" r="76" fill="none" stroke="#ffd9a8" stroke-width="2" opacity="0.5"/>')

    medal(*T)
    medal(*L)
    medal(*R)
    # oxygen (top)
    tx, ty = T
    for (dx, dy) in ((-46, -40), (40, 44), (52, -30)):
        s.a(f'<path d="M{tx + dx - 14},{ty + dy} q7,-8 14,0 t14,0" fill="none" stroke="#bfe4ff" stroke-width="3" '
            f'stroke-linecap="round" opacity="0.6"/>')
    s.a(o2(tx, ty + 2, 31, -18))

    # fuel (bottom left): two logs
    lx, ly = L
    for (dx, dy, rot, ln) in ((-6, 22, 14, 120), (4, -12, -18, 112)):
        x0, y0 = lx + dx, ly + dy
        s.a(f'<g transform="translate({f(x0)},{f(y0)}) rotate({rot})">'
            f'<rect x="{-ln / 2}" y="-22" width="{ln}" height="44" rx="20" fill="url(#logBark)" stroke="#3a1f0c" stroke-width="3"/>'
            f'<path d="M{-ln / 2 + 16},-8 H{ln / 2 - 40} M{-ln / 2 + 30},8 H{ln / 2 - 26} M{-ln / 2 + 20},-15 H{-ln / 2 + 54}" '
            f'stroke="#3f220e" stroke-width="3" stroke-linecap="round" opacity="0.6"/>'
            f'<ellipse cx="{ln / 2 - 10}" cy="0" rx="16" ry="22" fill="url(#logEnd)" stroke="#8a5a30" stroke-width="2.5"/>'
            f'<ellipse cx="{ln / 2 - 10}" cy="0" rx="10" ry="14" fill="none" stroke="#b7814a" stroke-width="2"/>'
            f'<ellipse cx="{ln / 2 - 10}" cy="0" rx="4.5" ry="6" fill="none" stroke="#b7814a" stroke-width="2"/>'
            f'</g>')
    # a small leaf on the wood
    s.a(f'<path d="M{lx - 44},{ly - 40} q22,-26 44,-6 q-22,20 -44,6z" fill="#6fd35e" stroke="#2c7a24" stroke-width="2"/>')

    # heat (bottom right): glowing sun-like heat
    hx, hy = R
    rays = []
    for i in range(10):
        a = math.radians(i * 36 + 18)
        pts = []
        for j in range(8):
            rr = 42 + j * 3.6
            off = math.sin(j * 1.6) * 5
            pts.append((hx + math.cos(a) * rr - math.sin(a) * off, hy + math.sin(a) * rr + math.cos(a) * off))
        rays.append("M" + " L".join(f"{f(x)},{f(y)}" for x, y in pts))
    s.a(f'<path d="{"".join(rays)}" fill="none" stroke="#ff7a2a" stroke-width="8" stroke-linecap="round" '
        f'stroke-linejoin="round" filter="url(#g1)"/>',
        f'<path d="{"".join(rays)}" fill="none" stroke="#ffd27a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>')
    s.a(f'<circle cx="{hx}" cy="{hy}" r="34" fill="url(#heatF)" filter="url(#g2)"/>')

    finish(s)
    return s


if __name__ == "__main__":
    s = build()
    print(s.save("fire"))

