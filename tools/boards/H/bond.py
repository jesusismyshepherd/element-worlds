"""Board 'bond': a pond at a pond skater's size. The insect stands on the water on its long thin legs, each
foot pressing a little dimple into the surface, which holds like a stretched skin; reeds and a lily pad
round it. A close-up under one foot: the water molecules of the top layers, each hydrogen tugging at a
neighbour's oxygen (hydrogen bonds, dashed), the layer bending under the hairy foot without breaking."""
import math
import os
import random
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from hkit import *  # noqa: E402,F401

COLOR = "#3fe0d0"
HORIZON = 300


def dimple(x, y, r):
    """A dent in the water's skin under a foot: a darker hollow, a bright rim, a faint ring round it."""
    return (f'<ellipse cx="{f(x)}" cy="{f(y + r * 0.08)}" rx="{f(r * 1.9)}" ry="{f(r * 0.48)}" fill="none" stroke="#bff8ee" stroke-width="1.5" opacity="0.35"/>'
            f'<ellipse cx="{f(x)}" cy="{f(y)}" rx="{f(r)}" ry="{f(r * 0.3)}" fill="#0c3a44" opacity="0.75"/>'
            f'<path d="M{f(x - r)},{f(y)} A{f(r)},{f(r * 0.3)} 0 0 0 {f(x + r)},{f(y)}" fill="none" stroke="#d4fff6" stroke-width="2.4" opacity="0.85"/>'
            f'<ellipse cx="{f(x)}" cy="{f(y + r * 0.42)}" rx="{f(r * 0.9)}" ry="{f(r * 0.22)}" fill="#062026" opacity="0.4" filter="url(#s2)"/>')


def leg(points, w, col="#2a221c"):
    """A jointed insect leg through the points (body to foot), thinning towards the foot."""
    out = []
    for i, ((x1, y1), (x2, y2)) in enumerate(zip(points, points[1:])):
        ww = w * (1 - i * 0.28)
        out.append(f'<line x1="{f(x1)}" y1="{f(y1)}" x2="{f(x2)}" y2="{f(y2)}" stroke="{col}" stroke-width="{f(ww)}" stroke-linecap="round"/>')
        out.append(f'<line x1="{f(x1)}" y1="{f(y1)}" x2="{f(x2)}" y2="{f(y2)}" stroke="#8a7a62" stroke-width="{f(max(0.8, ww * 0.25))}" stroke-linecap="round" opacity="0.6" transform="translate(-1 -1)"/>')
    return "".join(out)


def skater(s, cx, cy):
    """A pond skater, a little from above: a long slender body, short front legs, very long middle and hind
    legs whose feet rest on the water, each in its dimple."""
    feet = {
        "midL": (cx - 215, cy + 46), "midR": (cx + 218, cy - 22),
        "hindL": (cx - 120, cy + 104), "hindR": (cx + 150, cy + 64),
    }
    out = []
    for (fx, fy) in feet.values():
        out.append(dimple(fx, fy, 22))
    # the body's shadow on the water, and its reflection
    out.append(f'<ellipse cx="{f(cx + 10)}" cy="{f(cy + 70)}" rx="90" ry="12" fill="#04161a" opacity="0.35" filter="url(#s8)"/>')
    # far legs first (behind the body)
    out.append(leg([(cx + 20, cy - 4), (cx + 120, cy - 70), (cx + 190, cy - 34), feet["midR"]], 9))
    out.append(leg([(cx + 46, cy + 2), (cx + 110, cy - 30), (cx + 136, cy + 30), feet["hindR"]], 8))
    # the body: thorax and long abdomen, a small head with big eyes, antennae
    s.d(lin("skBody", [(0, "#6a5a48"), (0.45, "#3a3028"), (1, "#16120e")], x1=0, y1=0, x2=0, y2=1))
    body = [(cx - 95, cy + 8), (cx - 40, cy - 8), (cx + 30, cy - 12), (cx + 85, cy - 14), (cx + 110, cy - 10),
            (cx + 88, cy + 4), (cx + 30, cy + 10), (cx - 40, cy + 16)]
    out.append(f'<path d="{smooth(body)}" fill="url(#skBody)" stroke="#120e0a" stroke-width="2"/>')
    out.append(f'<path d="M{f(cx - 80)},{f(cy + 2)} Q{f(cx)},{f(cy - 12)} {f(cx + 90)},{f(cy - 10)}" fill="none" stroke="#c8b898" stroke-width="2" opacity="0.5"/>')
    hx, hy = cx + 124, cy - 13
    out.append(f'<ellipse cx="{f(hx)}" cy="{f(hy)}" rx="17" ry="10" fill="#2a221c" stroke="#120e0a" stroke-width="1.5"/>')
    out.append(f'<circle cx="{f(hx + 5)}" cy="{f(hy - 5)}" r="5.5" fill="#5a3a2a"/><circle cx="{f(hx + 6.5)}" cy="{f(hy - 6.5)}" r="1.8" fill="#ffffff" opacity="0.8"/>')
    for (ax, ay) in ((hx + 52, hy - 44), (hx + 60, hy - 24)):
        out.append(f'<path d="M{f(hx + 12)},{f(hy - 4)} Q{f((hx + ax) / 2 + 6)},{f(hy - 30)} {f(ax)},{f(ay)}" fill="none" stroke="#2a221c" stroke-width="2.4" stroke-linecap="round"/>')
    # the short front legs, held forward to grab
    out.append(leg([(cx + 100, cy - 4), (cx + 128, cy + 14), (cx + 156, cy + 8)], 5))
    out.append(leg([(cx + 96, cy - 2), (cx + 118, cy + 22), (cx + 148, cy + 22)], 5))
    # near legs (in front of the body)
    out.append(leg([(cx + 10, cy + 6), (cx - 90, cy - 66), (cx - 170, cy - 10), feet["midL"]], 10))
    out.append(leg([(cx + 36, cy + 8), (cx - 30, cy - 30), (cx - 70, cy + 44), feet["hindL"]], 9))
    s.a("".join(out))
    return feet


def reed(x, y0, h, lean, head=True):
    """A reed (a bulrush) standing out of the water."""
    tip = (x + lean, y0 - h)
    out = [f'<path d="M{f(x)},{f(y0)} Q{f(x + lean * 0.3)},{f(y0 - h * 0.6)} {f(tip[0])},{f(tip[1])}" fill="none" stroke="#2f6a48" stroke-width="7" stroke-linecap="round"/>']
    if head:
        a = math.atan2(-(h * 0.4), lean * 0.7)
        hx, hy = x + lean * 0.86, y0 - h * 0.82
        out.append(f'<ellipse cx="{f(hx)}" cy="{f(hy)}" rx="9" ry="34" transform="rotate({f(math.degrees(a) + 90)} {f(hx)} {f(hy)})" fill="#6a3f24" stroke="#3a2010" stroke-width="1.5"/>')
    out.append(f'<ellipse cx="{f(x)}" cy="{f(y0 + 2)}" rx="16" ry="3.5" fill="none" stroke="#bff8ee" stroke-width="1.4" opacity="0.4"/>')
    return "".join(out)


def build():
    s = Svg("H", COLOR)
    particles(s)
    background(s, glows=[(420, 320, 340, 0.5), (900, 300, 300, 0.55)], seed=72, stars=24, star_box=(0, 0, 1200, 240), bokeh=4)
    rnd = random.Random(2025)

    # ---------- the far bank, then the pond's surface in perspective
    s.a(f'<path d="M0,{HORIZON} Q200,{HORIZON - 40} 420,{HORIZON - 18} T820,{HORIZON - 26} T1200,{HORIZON - 12} L1200,{HORIZON + 4} L0,{HORIZON + 4} Z" fill="#163a3a"/>')
    for k in range(22):
        x = rnd.uniform(0, 1200)
        s.a(f'<ellipse cx="{f(x)}" cy="{f(HORIZON - 16 - rnd.uniform(0, 26))}" rx="{f(rnd.uniform(30, 60))}" ry="{f(rnd.uniform(16, 30))}" fill="#1c4a44" opacity="0.8"/>')
    s.d(lin("pond", [(0, "#3e8a8a"), (0.18, "#1f5c64"), (0.6, "#123c48"), (1, "#0a1e2c")], x1=0, y1=0, x2=0, y2=1))
    s.a(f'<rect x="0" y="{HORIZON}" width="1200" height="{800 - HORIZON}" fill="url(#pond)"/>')
    # the sky's sheen on the water: long soft streaks, closer together far off
    for k in range(16):
        y = HORIZON + 6 + (k / 15) ** 1.7 * 320
        x = rnd.uniform(-100, 900)
        w = 120 + k * 22
        s.a(f'<rect x="{f(x)}" y="{f(y)}" width="{f(w)}" height="{f(1.2 + k * 0.25)}" rx="2" fill="#bff8ee" opacity="{0.1 + 0.08 * (1 - k / 16):.2f}"/>')
    # reeds at the edges
    for (x, h, lean) in ((40, 330, 30), (78, 260, -10), (112, 380, 46), (1150, 300, -36), (1110, 230, 12)):
        s.a(reed(x, 560, h, lean, head=h > 250))
    # a lily pad near the front
    s.a(f'<path d="M820,600 A120,34 0 1 0 960,568 L890,585 Z" fill="#2f7a48" stroke="#1a4a2c" stroke-width="3"/>'
        f'<path d="M890,585 L850,610 M890,585 L940,606 M890,585 L790,592" stroke="#4aa064" stroke-width="2" opacity="0.6"/>')

    # ---------- the pond skater
    feet = skater(s, 420, 400)

    # ---------- the close-up under a foot: the top layers of water molecules, hydrogen-bonded
    fx, fy = feet["midR"]
    mx, my, mr = 905, 285, 170
    opening, closing = magnifier(s, "zoomWater", mx, my, mr, COLOR, src=(fx, fy, 26), inner="#0e2a40")
    s.a(opening)
    # air above, water below a surface that dips under the foot
    surf = lambda x: my - 34 + 52 * math.exp(-((x - mx) / 70) ** 2)
    pts = [(mx - mr, surf(mx - mr))] + [(x, surf(x)) for x in range(int(mx - mr), int(mx + mr) + 1, 12)] + [(mx + mr, my + mr), (mx - mr, my + mr)]
    s.a(f'<path d="{poly(pts)}" fill="#1a6a80" opacity="0.45"/>')
    # molecules: rows following the surface, the top row bent most
    mols = []
    for row in range(3):
        for col in range(-3, 4):
            x = mx + col * 64 + (row % 2) * 32 + rnd.uniform(-4, 4)
            depth = 26 + row * 58
            y = surf(x) * (1 - row * 0.3) + (my - 34 + 10) * row * 0.3 + depth + rnd.uniform(-4, 4)
            if math.hypot(x - mx, y - my) < mr - 18:
                mols.append([x, y])
    # each molecule points its two hydrogens towards two neighbours (below or beside), and tugs them
    drawn = []
    bonds = []
    for i, (x, y) in enumerate(mols):
        near = sorted((math.hypot(x2 - x, y2 - y), j) for j, (x2, y2) in enumerate(mols) if j != i and y2 > y - 30)
        near = [j for d, j in near if d < 95][:2]
        if len(near) == 2:
            a1 = math.atan2(mols[near[0]][1] - y, mols[near[0]][0] - x)
            a2 = math.atan2(mols[near[1]][1] - y, mols[near[1]][0] - x)
            bis = math.atan2(math.sin(a1) + math.sin(a2), math.cos(a1) + math.cos(a2))
        elif near:
            bis = math.atan2(mols[near[0]][1] - y, mols[near[0]][0] - x)
        else:
            bis = math.pi / 2 + rnd.uniform(-0.6, 0.6)
        ang = math.degrees(bis) - 90
        svg, hs = water(x, y, 15, ang)
        drawn.append(svg)
        for (hx, hy) in hs:
            # the nearest other oxygen that this hydrogen points at
            best = None
            for j, (x2, y2) in enumerate(mols):
                if j == i:
                    continue
                d = math.hypot(x2 - hx, y2 - hy)
                if d < 80 and (best is None or d < best[0]):
                    best = (d, x2, y2)
            if best:
                bonds.append((hx, hy, best[1], best[2]))
    for (hx, hy, ox, oy) in bonds:
        s.a(hbond(hx, hy, ox, oy, col="#7ffff0", w=4.2, gap=9))
    for svg in drawn:
        s.a(svg)
    # the foot pressing in from above: dark, hairy, resting in the dip
    tip = (mx + 4, surf(mx) - 18)
    s.a(f'<path d="M{f(mx - 150)},{f(my - 160)} Q{f(mx - 60)},{f(my - 90)} {f(tip[0])},{f(tip[1])}" fill="none" stroke="#2a221c" stroke-width="16" stroke-linecap="round"/>')
    for k in range(18):
        t = 0.35 + k * 0.035
        x = mx - 150 + (tip[0] - mx + 150) * t
        y = my - 160 + (tip[1] - my + 160) * t + math.sin(t * 3) * 10
        s.a(f'<line x1="{f(x)}" y1="{f(y)}" x2="{f(x - 6 + (k % 3) * 6)}" y2="{f(y + 14)}" stroke="#4a3a2a" stroke-width="1.6" opacity="0.9"/>')
    s.a(closing)
    finish(s)
    s.save("bond")


if __name__ == "__main__":
    build()
