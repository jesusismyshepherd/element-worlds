"""Board 'diatoms': the sunlit sea seen as under a microscope, full of diatoms, each in its shell of glass.
A big round one in the middle (a centric diatom: rings of tiny holes between ribs, like a rose window), a
boat-shaped one, a triangular one and a star-shaped colony; their golden insides catch the light, and
from each rise bubbles of oxygen (O2, two red atoms) towards the sun rays above."""
import math
import os
import random
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from lib.style import *  # noqa: E402,F401

GREEN = "#46e0a0"
GLASS = "#9fe8dc"  # the shell's glass: kept under the hall's bloom (no large near-white areas)
GLASS_EDGE = "#c8ece4"  # a little under the bloom threshold (sodium's trap)
GOLD = "#d8a640"  # the chloroplasts (diatoms are golden brown)


def rays(s):
    """Sunlight falling through the water from the top."""
    s.d(lin("ray", [(0, "#d8fff0", 0.32), (1, "#d8fff0", 0)], x1=0, y1=0, x2=0, y2=1))
    out = []
    for (x, w, sk) in ((140, 70, 120), (330, 110, 170), (610, 80, 150), (820, 130, 210), (1060, 90, 160)):
        out.append(f'<polygon points="{P([(x, -10), (x + w, -10), (x + w + sk, 640), (x + sk - w * 0.3, 640)])}" fill="url(#ray)"/>')
    s.a('<g opacity="0.75">' + "".join(out) + "</g>")


def o2(x, y, r, ang=0):
    """An oxygen molecule in a bubble."""
    a = math.radians(ang)
    dx, dy = math.cos(a) * r * 0.62, math.sin(a) * r * 0.62
    return (f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r * 1.65)}" fill="#bff5ea" opacity="0.12" stroke="#d8fff6" '
            f'stroke-opacity="0.55" stroke-width="2"/>'
            + ball(x - dx, y - dy, r * 0.75, "O") + ball(x + dx, y + dy, r * 0.75, "O"))


def centric(s, cx, cy, R):
    """A round diatom seen from above: a glass disc with ribs from the centre and rows of holes between
    them, a golden inside showing through, a bright rim."""
    s.d(rad("cenGlass", [(0, "#5fc8b8"), (0.55, "#3a9e94"), (0.85, "#2e7f86"), (1, "#7fdccf")]),
        rad("cenGold", [(0, "#f0c060", 0.85), (0.6, "#c88a2a", 0.55), (1, "#a06a1a", 0)]))
    out = [glow(cx, cy, R * 1.12, GREEN, 0.35, "s16"),
           f'<circle cx="{f(cx)}" cy="{f(cy)}" r="{f(R)}" fill="url(#cenGlass)"/>',
           f'<circle cx="{f(cx + R * 0.05)}" cy="{f(cy + R * 0.06)}" r="{f(R * 0.7)}" fill="url(#cenGold)"/>']
    n = 18
    # the ribs
    for k in range(n):
        a = k / n * math.tau
        out.append(f'<line x1="{f(cx + math.cos(a) * R * 0.2)}" y1="{f(cy + math.sin(a) * R * 0.2)}" '
                   f'x2="{f(cx + math.cos(a) * R * 0.97)}" y2="{f(cy + math.sin(a) * R * 0.97)}" stroke="{GLASS_EDGE}" '
                   f'stroke-width="{f(R * 0.03)}" stroke-linecap="round" opacity="0.75"/>')
    # rows of holes between the ribs, bigger towards the rim
    for k in range(n):
        a0 = (k + 0.5) / n * math.tau
        for j, rr in enumerate((0.3, 0.42, 0.54, 0.66, 0.78, 0.89)):
            cols = 1 if j < 2 else 2 if j < 4 else 3
            for c in range(cols):
                a = a0 + (c - (cols - 1) / 2) * (math.tau / n / (cols + 0.6))
                hr = R * (0.022 + j * 0.006)
                x, y = cx + math.cos(a) * R * rr, cy + math.sin(a) * R * rr
                out.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(hr)}" fill="#14384a" opacity="0.8"/>'
                           f'<circle cx="{f(x - hr * 0.3)}" cy="{f(y - hr * 0.3)}" r="{f(hr * 0.45)}" fill="{GLASS}" opacity="0.6"/>')
    # the centre and the rim
    out.append(f'<circle cx="{f(cx)}" cy="{f(cy)}" r="{f(R * 0.17)}" fill="#3a9e94" stroke="{GLASS_EDGE}" stroke-width="{f(R * 0.025)}"/>')
    for k in range(7):
        a = k / 7 * math.tau + 0.3
        out.append(f'<circle cx="{f(cx + math.cos(a) * R * 0.09)}" cy="{f(cy + math.sin(a) * R * 0.09)}" r="{f(R * 0.022)}" fill="#14384a"/>')
    out.append(f'<circle cx="{f(cx)}" cy="{f(cy)}" r="{f(R)}" fill="none" stroke="{GLASS_EDGE}" stroke-width="{f(R * 0.06)}"/>')
    out.append(f'<circle cx="{f(cx)}" cy="{f(cy)}" r="{f(R * 1.035)}" fill="none" stroke="#2a6a6a" stroke-width="{f(R * 0.025)}"/>')
    # a glassy shine across the top left
    out.append(f'<path d="M{f(cx - R * 0.8)},{f(cy - R * 0.35)} A{f(R * 0.88)},{f(R * 0.88)} 0 0 1 {f(cx - R * 0.15)},{f(cy - R * 0.86)}" '
               f'fill="none" stroke="#ffffff" stroke-width="{f(R * 0.05)}" stroke-linecap="round" opacity="0.5"/>')
    s.a("".join(out))


def pennate(s, cx, cy, L, Wd, ang):
    """A boat-shaped diatom: a long pointed oval with a slit down the middle and fine ribs across it."""
    s.d(lin("penGlass", [(0, "#7fdccf"), (0.5, "#3a9e94"), (1, "#2e7f86")], x1=0, y1=0, x2=0, y2=1))
    pts = []
    for i in range(48):
        t = i / 48 * math.tau
        x = math.cos(t) * L / 2
        y = math.sin(t) * Wd / 2 * (1 - 0.25 * math.cos(t) ** 4)
        pts.append((x, y))
    shape = smooth(pts)
    out = [f'<g transform="translate({f(cx)} {f(cy)}) rotate({f(ang)})">',
           glow(0, 0, L * 0.42, GREEN, 0.3, "s16"),
           f'<path d="{shape}" fill="url(#penGlass)" stroke="{GLASS_EDGE}" stroke-width="5"/>',
           f'<ellipse cx="{f(-L * 0.16)}" cy="0" rx="{f(L * 0.2)}" ry="{f(Wd * 0.3)}" fill="{GOLD}" opacity="0.55"/>',
           f'<ellipse cx="{f(L * 0.16)}" cy="0" rx="{f(L * 0.2)}" ry="{f(Wd * 0.3)}" fill="{GOLD}" opacity="0.55"/>']
    # fine ribs across, either side of the slit
    for i in range(-15, 16):
        x = i * L / 34
        h = Wd / 2 * math.sqrt(max(0, 1 - (2 * x / L) ** 2)) * 0.86
        if h < 4:
            continue
        for sgn in (-1, 1):
            out.append(f'<line x1="{f(x)}" y1="{f(sgn * 7)}" x2="{f(x)}" y2="{f(sgn * h)}" stroke="#14384a" stroke-width="3.2" '
                       f'stroke-linecap="round" opacity="0.65"/>')
    out.append(f'<line x1="{f(-L * 0.42)}" y1="0" x2="{f(L * 0.42)}" y2="0" stroke="{GLASS_EDGE}" stroke-width="4" opacity="0.85"/>'
               f'<circle cx="0" cy="0" r="7" fill="{GLASS_EDGE}"/>'
               f'<path d="M{f(-L * 0.36)},{f(-Wd * 0.32)} Q0,{f(-Wd * 0.52)} {f(L * 0.36)},{f(-Wd * 0.32)}" fill="none" stroke="#ffffff" '
               f'stroke-width="4" stroke-linecap="round" opacity="0.45"/>')
    out.append("</g>")
    s.a("".join(out))


def triangle(s, cx, cy, R, ang):
    """A triangular diatom with rounded corners and a honeycomb of holes."""
    s.d(rad("triGlass", [(0, "#4fb8aa"), (0.8, "#2e8a86"), (1, "#7fdccf")]))
    corners = [(math.cos(math.radians(ang + 90 + k * 120)) * R, math.sin(math.radians(ang + 90 + k * 120)) * R) for k in range(3)]
    pts = []
    for k in range(3):
        a, b = corners[k], corners[(k + 1) % 3]
        for t in (0.0, 0.5):
            x = a[0] + (b[0] - a[0]) * t
            y = a[1] + (b[1] - a[1]) * t
            if t == 0.5:  # the sides bulge a little
                x *= 1.14
                y *= 1.14
            pts.append((x, y))
    shape = smooth(pts, k=0.8)
    out = [f'<g transform="translate({f(cx)} {f(cy)})">', glow(0, 0, R * 0.9, GREEN, 0.3, "s16"),
           f'<path d="{shape}" fill="url(#triGlass)" stroke="{GLASS_EDGE}" stroke-width="5"/>',
           f'<circle cx="0" cy="0" r="{f(R * 0.36)}" fill="{GOLD}" opacity="0.5"/>']
    s.d(f'<clipPath id="triClip"><path d="{shape}"/></clipPath>')
    holes = []
    step = R * 0.13
    for j in range(-9, 10):
        for i in range(-9, 10):
            x = i * step + (j % 2) * step / 2
            y = j * step * 0.87
            if x * x + y * y < (R * 0.95) ** 2:
                holes.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(step * 0.3)}" fill="#14384a" opacity="0.7"/>')
    out.append('<g clip-path="url(#triClip)">' + "".join(holes) + "</g>")
    for (x, y) in corners:
        out.append(f'<circle cx="{f(x * 0.86)}" cy="{f(y * 0.86)}" r="{f(R * 0.09)}" fill="{GLASS_EDGE}" opacity="0.85"/>')
    out.append("</g>")
    s.a("".join(out))


def star_colony(s, cx, cy, L, n, rot):
    """A colony of rod-shaped diatoms joined at one end, spread like the spokes of a star."""
    out = [glow(cx, cy, L * 0.8, GREEN, 0.28, "s16")]
    for k in range(n):
        a = math.radians(rot + k * 360 / n)
        x0, y0 = cx + math.cos(a) * L * 0.08, cy + math.sin(a) * L * 0.08
        x1, y1 = cx + math.cos(a) * L, cy + math.sin(a) * L
        out.append(f'<line x1="{f(x0)}" y1="{f(y0)}" x2="{f(x1)}" y2="{f(y1)}" stroke="{GLASS_EDGE}" stroke-width="17" stroke-linecap="round"/>'
                   f'<line x1="{f(x0)}" y1="{f(y0)}" x2="{f(x1)}" y2="{f(y1)}" stroke="#3a9e94" stroke-width="11" stroke-linecap="round"/>')
        mx, my = cx + math.cos(a) * L * 0.55, cy + math.sin(a) * L * 0.55
        out.append(f'<ellipse cx="{f(mx)}" cy="{f(my)}" rx="{f(L * 0.2)}" ry="4" transform="rotate({f(math.degrees(a))} {f(mx)} {f(my)})" '
                   f'fill="{GOLD}" opacity="0.8"/>')
    s.a("".join(out))


def build():
    s = Svg("Si", GREEN)
    background(s, glows=[(430, 300, 420, 0.75), (930, 250, 300, 0.5)], seed=1867, stars=0, bokeh=10, tint=0.5)
    rnd = random.Random(1867)
    rays(s)
    # specks drifting in the water
    for _ in range(70):
        x, y = rnd.uniform(0, 1200), rnd.uniform(0, 600)
        s.a(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(rnd.uniform(1.2, 3))}" fill="#bff5ea" opacity="{rnd.uniform(0.2, 0.55):.2f}"/>')

    star_colony(s, 150, 470, 118, 8, 12)
    pennate(s, 930, 190, 380, 120, -18)
    triangle(s, 960, 470, 120, 8)
    centric(s, 470, 320, 220)
    # small far-off diatoms
    for (x, y, r) in ((1130, 340, 22), (250, 150, 26), (720, 560, 18), (90, 230, 16)):
        s.a(f'<circle cx="{x}" cy="{y}" r="{r}" fill="#3a9e94" stroke="{GLASS_EDGE}" stroke-width="3" opacity="0.7"/>',
            f'<circle cx="{x}" cy="{y}" r="{r * 0.5}" fill="{GOLD}" opacity="0.5"/>')

    # oxygen rising from them
    for (x, y, r, a) in ((650, 120, 15, 20), (700, 60, 12, -30), (300, 70, 13, 40), (1080, 80, 12, 10), (790, 380, 13, -20),
                         (180, 330, 12, 60), (1150, 560, 11, 0), (600, 590, 12, 30)):
        s.a(o2(x, y, r, a))
    for _ in range(26):
        x, y = rnd.uniform(40, 1160), rnd.uniform(30, 600)
        s.a(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(rnd.uniform(3, 7))}" fill="none" stroke="#d8fff6" stroke-width="2" '
            f'opacity="{rnd.uniform(0.35, 0.7):.2f}"/>')
    finish(s)
    s.save("diatoms")


if __name__ == "__main__":
    build()
