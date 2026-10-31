"""Board 'airship': an evening sky over Paris. Charles's striped silk balloon of 1783 rising, its net
over the top and a little boat-shaped car hanging below; far off a great silver airship of the 1930s.
A close-up of the balloon's skin: inside, a few light hydrogen molecules; outside, the crowded air
(nitrogen and oxygen), and the air's push lifting the balloon."""
import math
import os
import random
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from hkit import *  # noqa: E402,F401

COLOR = "#6fb6ff"
GROUND = 560


def balloon(s, cx, cy, r):
    """La Charlière: gores of red and yellow silk, a net over the upper half, a hoop, a boat-shaped car."""
    s.d(f'<clipPath id="envelope"><circle cx="{f(cx)}" cy="{f(cy)}" r="{f(r)}"/></clipPath>',
        rad("silkShade", [(0, "#ffffff", 0.0), (0.55, "#000000", 0.0), (1, "#000000", 0.5)], cx=0.38, cy=0.36, r=0.75),
        rad("silkHi", [(0, "#ffffff", 0.35), (1, "#ffffff", 0)], cx=0.34, cy=0.3, r=0.35))
    out = [f'<circle cx="{f(cx + 10)}" cy="{f(cy + 14)}" r="{f(r)}" fill="#000" opacity="0.25" filter="url(#s16)"/>']
    # the gores: bands bounded by meridians seen from the side (x = cx + r sin(lon) cos(lat))
    out.append('<g clip-path="url(#envelope)">')
    cols = ["#d8344a", "#f2c23a"]
    n = 14
    for i in range(n):
        lon0 = -math.pi / 2 + i * math.pi / n
        lon1 = lon0 + math.pi / n
        pts = []
        for k in range(25):
            lat = -math.pi / 2 + k * math.pi / 24
            pts.append((cx + r * math.sin(lon0) * math.cos(lat), cy + r * math.sin(lat)))
        for k in range(24, -1, -1):
            lat = -math.pi / 2 + k * math.pi / 24
            pts.append((cx + r * math.sin(lon1) * math.cos(lat), cy + r * math.sin(lat)))
        out.append(f'<path d="{poly(pts)}" fill="{cols[i % 2]}"/>')
    out.append(f'<circle cx="{f(cx)}" cy="{f(cy)}" r="{f(r)}" fill="url(#silkShade)"/>')
    out.append(f'<circle cx="{f(cx)}" cy="{f(cy)}" r="{f(r)}" fill="url(#silkHi)"/>')
    out.append("</g>")
    # the net over the upper half: meridians and rings of cord
    net = "#5a3a22"
    for i in range(1, 12):
        lon = -math.pi / 2 + i * math.pi / 12
        pts = [(cx + r * math.sin(lon) * math.cos(lat), cy + r * math.sin(lat)) for lat in [-math.pi / 2 + k * math.pi / 40 for k in range(23)]]
        out.append(f'<path d="{smooth(pts, closed=False)}" fill="none" stroke="{net}" stroke-width="1.6" opacity="0.7"/>')
    for k in range(1, 5):
        lat = -math.pi / 2 + k * math.pi / 10
        y = cy + r * math.sin(lat)
        w = r * math.cos(lat)
        out.append(f'<path d="M{f(cx - w)},{f(y)} Q{f(cx)},{f(y + w * 0.16)} {f(cx + w)},{f(y)}" fill="none" stroke="{net}" stroke-width="1.6" opacity="0.7"/>')
    # the hoop at the equator, cords down to the car
    out.append(f'<ellipse cx="{f(cx)}" cy="{f(cy + r * 0.05)}" rx="{f(r * 1.0)}" ry="{f(r * 0.08)}" fill="none" stroke="#7a4e2a" stroke-width="4"/>')
    car_y = cy + r * 1.62
    for k in range(-4, 5):
        x0 = cx + k * r * 0.24
        out.append(f'<line x1="{f(x0)}" y1="{f(cy + r * 0.08)}" x2="{f(cx + k * r * 0.07)}" y2="{f(car_y - 4)}" stroke="#4a3426" stroke-width="1.6" opacity="0.85"/>')
    # the car: a little gilded boat with two passengers waving
    cw = r * 0.44
    out.append(f'<path d="M{f(cx - cw)},{f(car_y - 6)} Q{f(cx - cw * 0.9)},{f(car_y + 26)} {f(cx)},{f(car_y + 28)} Q{f(cx + cw * 0.9)},{f(car_y + 26)} {f(cx + cw)},{f(car_y - 6)} Z" fill="#2c4a8c" stroke="#e8c45a" stroke-width="3"/>')
    out.append(f'<path d="M{f(cx - cw * 0.85)},{f(car_y + 4)} L{f(cx + cw * 0.85)},{f(car_y + 4)}" stroke="#e8c45a" stroke-width="2" opacity="0.8"/>')
    for dx, arm in ((-cw * 0.35, -1), (cw * 0.3, 1)):
        hx = cx + dx
        out.append(f'<rect x="{f(hx - 7)}" y="{f(car_y - 26)}" width="14" height="22" rx="5" fill="#3a2a40"/>'
                   f'<circle cx="{f(hx)}" cy="{f(car_y - 33)}" r="7" fill="#e8b48e"/>'
                   f'<line x1="{f(hx + arm * 6)}" y1="{f(car_y - 22)}" x2="{f(hx + arm * 18)}" y2="{f(car_y - 42)}" stroke="#3a2a40" stroke-width="4" stroke-linecap="round"/>')
    s.a("".join(out))
    return car_y


def airship(s, x, y, L, H):
    """A 1930s rigid airship seen from the side: a long silver hull, fins, a gondola under its front."""
    s.d(lin("hull", [(0, "#e2e8f2"), (0.35, "#aeb8c8"), (0.75, "#6e7890"), (1, "#3e4658")], x1=0, y1=0, x2=0, y2=1))
    pts = []
    for k in range(41):
        t = k / 40
        u = t * 2 - 1
        prof = (1 - u ** 2) ** 0.62 * (1 - 0.18 * max(0, u) ** 2)
        pts.append((x + t * L, y - prof * H / 2))
    for k in range(40, -1, -1):
        t = k / 40
        u = t * 2 - 1
        prof = (1 - u ** 2) ** 0.62 * (1 - 0.18 * max(0, u) ** 2)
        pts.append((x + t * L, y + prof * H / 2))
    hull = smooth(pts)
    out = [f'<path d="{hull}" fill="url(#hull)" stroke="#2e3446" stroke-width="1.5"/>']
    s.d(f'<clipPath id="hullClip"><path d="{hull}"/></clipPath>')
    out.append('<g clip-path="url(#hullClip)">')
    for k in range(1, 16):
        xx = x + k * L / 16
        out.append(f'<line x1="{f(xx)}" y1="{f(y - H)}" x2="{f(xx)}" y2="{f(y + H)}" stroke="#4a5266" stroke-width="1" opacity="0.35"/>')
    out.append(f'<rect x="{f(x)}" y="{f(y - H * 0.42)}" width="{f(L)}" height="{f(H * 0.1)}" fill="#ffffff" opacity="0.28"/>')
    out.append("</g>")
    # fins at the tail
    tx = x + L * 0.86
    out.append(f'<path d="M{f(tx)},{f(y - H * 0.32)} L{f(x + L * 0.99)},{f(y - H * 0.72)} L{f(x + L * 1.0)},{f(y - H * 0.18)} Z" fill="#8a94a8" stroke="#2e3446" stroke-width="1.2"/>')
    out.append(f'<path d="M{f(tx)},{f(y + H * 0.32)} L{f(x + L * 0.99)},{f(y + H * 0.72)} L{f(x + L * 1.0)},{f(y + H * 0.18)} Z" fill="#6e7890" stroke="#2e3446" stroke-width="1.2"/>')
    out.append(f'<path d="M{f(tx + 6)},{f(y - H * 0.04)} L{f(x + L * 1.02)},{f(y - H * 0.06)} L{f(x + L * 1.02)},{f(y + H * 0.06)} L{f(tx + 6)},{f(y + H * 0.04)} Z" fill="#5a6478"/>')
    # the gondola, with a row of lit windows
    gx = x + L * 0.2
    out.append(f'<path d="M{f(gx)},{f(y + H * 0.46)} L{f(gx + L * 0.09)},{f(y + H * 0.46)} L{f(gx + L * 0.075)},{f(y + H * 0.62)} L{f(gx + L * 0.012)},{f(y + H * 0.62)} Z" fill="#5a6478" stroke="#2e3446" stroke-width="1"/>')
    for k in range(4):
        out.append(f'<rect x="{f(gx + L * 0.016 + k * L * 0.017)}" y="{f(y + H * 0.5)}" width="{f(L * 0.01)}" height="{f(H * 0.06)}" fill="#ffd98a"/>')
    s.a("".join(out))


def build():
    s = Svg("H", COLOR)
    particles(s)
    background(s, glows=[(330, 250, 300, 0.55), (960, 140, 260, 0.45)], seed=1783, stars=30, star_box=(0, 0, 1200, 260), bokeh=3)
    rnd = random.Random(1937)
    # a sunset glow low over the horizon
    s.d(lin("dusk", [(0, "#ff9a6a", 0), (0.6, "#ff8a5a", 0.22), (1, "#ffb070", 0.35)], x1=0, y1=0, x2=0, y2=1))
    s.a(f'<rect x="0" y="300" width="1200" height="{GROUND - 300}" fill="url(#dusk)"/>')
    # a few soft clouds
    for (x, y, w) in ((140, 420, 160), (620, 470, 220), (1040, 360, 180), (820, 520, 140)):
        s.a(f'<ellipse cx="{x}" cy="{y}" rx="{w}" ry="{w * 0.16}" fill="#c98aa0" opacity="0.25" filter="url(#s8)"/>')

    # ---------- the far airship
    airship(s, 700, 150, 380, 74)

    # ---------- Paris on the horizon: roofs, a dome, the Tuileries' trees
    s.d(lin("ground", [(0, "#1c2348"), (1, "#0e1230")], x1=0, y1=0, x2=0, y2=1))
    sky = [(0, GROUND)]
    x = 0
    while x < 1200:
        w = rnd.uniform(26, 60)
        h = rnd.uniform(14, 38)
        sky += [(x, GROUND - h), (x + w * 0.5, GROUND - h - rnd.uniform(4, 14)), (x + w, GROUND - h)]
        x += w
    sky += [(1200, GROUND), (1200, 800), (0, 800)]
    s.a(f'<path d="{poly(sky)}" fill="#141a3c"/>')
    s.a(f'<path d="M540,{GROUND - 44} A48,48 0 0 1 636,{GROUND - 44} Z" fill="#141a3c"/><rect x="584" y="{GROUND - 112}" width="8" height="22" fill="#141a3c"/>'
        f'<rect x="530" y="{GROUND - 46}" width="116" height="40" fill="#141a3c"/>')
    for k in range(9):
        lx = 760 + k * 34 + rnd.uniform(-6, 6)
        s.a(f'<rect x="{f(lx)}" y="{GROUND - 30}" width="6" height="9" fill="#ffcf7a" opacity="0.75"/>')
    s.a(f'<rect x="0" y="{GROUND}" width="1200" height="{800 - GROUND}" fill="url(#ground)"/>')
    for k in range(16):
        tx = 30 + k * 28 + rnd.uniform(-6, 6)
        s.a(f'<ellipse cx="{f(tx)}" cy="{GROUND - 8}" rx="{f(rnd.uniform(18, 24))}" ry="{f(rnd.uniform(12, 18))}" fill="#141a3c"/>')

    # ---------- the balloon
    bx, by, br = 300, 228, 142
    car_y = balloon(s, bx, by, br)
    # the air pushing it up
    for side in (-1, 1):
        x0 = bx + side * br * 0.86
        s.a(arrow([(x0 + side * 6, car_y + 30), (x0, car_y - 20), (x0 - side * br * 0.1, by + br * 0.9)], "#9fd0ff", w=8, op=0.85))

    # ---------- the close-up of the skin: few hydrogens inside, crowded air outside
    mx, my, mr = 820, 405, 138
    opening, closing = magnifier(s, "zoomSkin", mx, my, mr, COLOR, src=(bx + br * 0.62, by + br * 0.45, 22))
    s.a(opening)
    # the skin: an arc across the window, inside (upper left) and outside (lower right)
    sk = [(mx - mr * 1.2, my + mr * 0.15), (mx - mr * 0.2, my + mr * 0.02), (mx + mr * 0.5, my - mr * 0.36), (mx + mr * 1.1, my - mr * 0.95)]
    s.a(f'<path d="M{f(sk[0][0])},{f(sk[0][1])} L{f(sk[1][0])},{f(sk[1][1])} L{f(sk[2][0])},{f(sk[2][1])} L{f(sk[3][0])},{f(sk[3][1])} L{f(mx - mr * 1.2)},{f(my - mr * 1.2)} Z" fill="#2a3a78" opacity="0.55"/>')
    s.a(f'<path d="{smooth(sk, closed=False)}" fill="none" stroke="#d8344a" stroke-width="12"/>',
        f'<path d="{smooth([(x, y + 7) for x, y in sk], closed=False)}" fill="none" stroke="#f2c23a" stroke-width="3" opacity="0.8"/>')
    # inside: four hydrogen molecules, roomy
    for (x, y, a) in ((mx - 70, my - 75, 20), (mx + 10, my - 108, -30), (mx - 105, my - 18, 70), (mx - 22, my - 40, -60)):
        s.a(h2(x, y, 13, a, grey=True))
    # outside: crowded nitrogen (blue) and oxygen (red) pairs
    spots = []
    tries = 0
    while len(spots) < 24 and tries < 2000:
        tries += 1
        x = rnd.uniform(mx - mr, mx + mr)
        y = rnd.uniform(my - mr, my + mr)
        if math.hypot(x - mx, y - my) > mr - 12:
            continue
        # below the skin line (outside the balloon)
        if y < my + (mx - x) * 0.5 - (x - mx) * 0.3 + 20 and not (x > mx + 40 and y > my - 40):
            if y < my + 40 - (x - mx) * 0.55:
                continue
        if any(math.hypot(x - a, y - b) < 34 for a, b, _ in spots):
            continue
        spots.append((x, y, rnd.uniform(0, 180)))
    for i, (x, y, a) in enumerate(spots):
        s.a(pair(x, y, 11, "O" if i % 5 == 0 else "N", a))
    s.a(arrow([(mx + 40, my + 95), (mx + 20, my + 40), (mx - 6, my + 2)], "#9fd0ff", w=7, op=0.9))
    s.a(closing)
    finish(s)
    s.save("airship")


if __name__ == "__main__":
    build()
