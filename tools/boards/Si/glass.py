"""Board 'glass': from sand to glass in a glassworks. On the left a heap of golden sand; in the middle the
furnace's round mouth glows white-hot, and a blowpipe holds a glowing gather being blown into a bubble; on
the right the finished glass, clear: a bottle, a vase and a tumbler, the warm light behind them showing
straight through. A close-up of the glass: silicon and oxygen in a jumbled network (no rows, as a crystal
has), so nothing inside bends the light away."""
import math
import os
import random
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from lib.style import *  # noqa: E402,F401

ORANGE = "#ff8f4a"
FLOOR = 566


def sand(s, cx, base, w, h, rnd):
    """A heap of sand: a soft mound, grains speckled over it, a scoop stuck in it."""
    s.d(lin("sand", [(0, "#f0c070"), (0.5, "#d49a48"), (1, "#8a5a28")], x1=0, y1=0, x2=0.3, y2=1))
    pts = [(cx - w / 2, base), (cx - w * 0.3, base - h * 0.5), (cx - w * 0.08, base - h * 0.96), (cx + w * 0.06, base - h),
           (cx + w * 0.3, base - h * 0.5), (cx + w / 2, base)]
    shape = smooth(pts, closed=False) + "Z"
    out = [f'<ellipse cx="{f(cx)}" cy="{f(base + 4)}" rx="{f(w * 0.55)}" ry="12" fill="#000" opacity="0.35"/>',
           f'<path d="{shape}" fill="url(#sand)"/>']
    s.d(f'<clipPath id="sandClip"><path d="{shape}"/></clipPath>')
    grains = []
    for _ in range(520):
        x = rnd.uniform(cx - w / 2, cx + w / 2)
        y = rnd.uniform(base - h, base)
        col = rnd.choice(["#ffe0a0", "#b07a38", "#f6d090", "#8a5a28", "#fff0c8"])
        grains.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(rnd.uniform(1.6, 3.4))}" fill="{col}" opacity="0.8"/>')
    out.append('<g clip-path="url(#sandClip)">' + "".join(grains) + "</g>")
    # a little spill of grains at the foot, and a few that catch the light
    for _ in range(40):
        x = cx + rnd.uniform(-w * 0.6, w * 0.6)
        out.append(f'<circle cx="{f(x)}" cy="{f(base + rnd.uniform(-2, 8))}" r="{f(rnd.uniform(1.5, 3))}" fill="#e8b868" opacity="0.8"/>')
    for _ in range(7):
        x = rnd.uniform(cx - w * 0.3, cx + w * 0.3)
        y = rnd.uniform(base - h * 0.8, base - h * 0.1)
        out.append(sparkle(x, y, rnd.uniform(5, 8), "#fff3c8", 0.8))
    s.a("".join(out))


def furnace(s, cx, base, w, h, mx, my, mr):
    """A brick furnace: a dome of bricks, its round mouth glowing white-hot with flames inside."""
    s.d(lin("brick", [(0, "#7a3a2a"), (1, "#3a1a16")], x1=0, y1=0, x2=0, y2=1),
        rad("mouth", [(0, "#fff0b0"), (0.35, "#ffd060"), (0.7, "#ff9a2a"), (1, "#e05a1a")]),
        rad("heat", [(0, "#ffb84d", 0.6), (0.4, "#ff8a2a", 0.25), (1, "#ff6a1a", 0)]))
    dome = f"M{f(cx - w / 2)},{f(base)} L{f(cx - w / 2)},{f(base - h * 0.45)} Q{f(cx - w / 2)},{f(base - h)} {f(cx)},{f(base - h)} " \
           f"Q{f(cx + w / 2)},{f(base - h)} {f(cx + w / 2)},{f(base - h * 0.45)} L{f(cx + w / 2)},{f(base)}Z"
    out = [f'<circle cx="{f(mx)}" cy="{f(my)}" r="{f(mr * 3.4)}" fill="url(#heat)"/>',
           f'<path d="{dome}" fill="url(#brick)" stroke="#2a1210" stroke-width="4"/>']
    s.d(f'<clipPath id="domeClip"><path d="{dome}"/></clipPath>')
    rows = []
    bh = 30
    for j in range(int(h / bh) + 1):
        y = base - (j + 1) * bh
        off = (j % 2) * 34
        rows.append(f'<line x1="{f(cx - w / 2)}" y1="{f(y)}" x2="{f(cx + w / 2)}" y2="{f(y)}" stroke="#2a1210" stroke-width="3" opacity="0.7"/>')
        for i in range(-1, int(w / 68) + 2):
            x = cx - w / 2 + off + i * 68
            rows.append(f'<line x1="{f(x)}" y1="{f(y)}" x2="{f(x)}" y2="{f(y + bh)}" stroke="#2a1210" stroke-width="3" opacity="0.7"/>')
    out.append('<g clip-path="url(#domeClip)">' + "".join(rows) +
               # the bricks round the mouth lit by its glow
               f'<circle cx="{f(mx)}" cy="{f(my)}" r="{f(mr * 1.9)}" fill="#ff8a2a" opacity="0.28" filter="url(#s16)"/></g>')
    # the arch of the mouth, and the fire inside
    out.append(f'<circle cx="{f(mx)}" cy="{f(my)}" r="{f(mr + 16)}" fill="#4a2018"/>'
               f'<circle cx="{f(mx)}" cy="{f(my)}" r="{f(mr)}" fill="url(#mouth)"/>')
    for k in range(5):
        fx = mx - mr * 0.6 + k * mr * 0.3
        fh = mr * (0.7 + 0.25 * math.sin(k * 2.1))
        fy = my + mr * 0.75
        out.append(f'<path d="M{f(fx - 16)},{f(fy)} C{f(fx - 20)},{f(fy - fh * 0.5)} {f(fx - 4)},{f(fy - fh * 0.7)} {f(fx)},{f(fy - fh)} '
                   f'C{f(fx + 6)},{f(fy - fh * 0.6)} {f(fx + 20)},{f(fy - fh * 0.4)} {f(fx + 16)},{f(fy)}Z" fill="#ff8a2a" opacity="0.6" filter="url(#s4)"/>')
    s.a("".join(out))


def gather(s, x, y, r):
    """The glowing gather of molten glass on the blowpipe's end, being blown into a bubble."""
    s.d(rad("gather", [(0, "#ffe68a"), (0.45, "#ffb03a"), (0.85, "#ff7a1a"), (1, "#d84a10")], cx=0.4, cy=0.38, r=0.7))
    s.a(glow(x, y, r * 1.6, "#ff9a2a", 0.55, "s16"),
        f'<ellipse cx="{f(x)}" cy="{f(y)}" rx="{f(r * 1.08)}" ry="{f(r)}" fill="url(#gather)"/>',
        f'<ellipse cx="{f(x - r * 0.3)}" cy="{f(y - r * 0.38)}" rx="{f(r * 0.3)}" ry="{f(r * 0.16)}" fill="#fff6c8" opacity="0.8" '
        f'transform="rotate(-30 {f(x - r * 0.3)} {f(y - r * 0.38)})"/>')


def clear_glass(s, d, gid, tint="#bfeee6"):
    """A piece of clear glass: almost no fill, a bright outline, a tinted edge and shine."""
    s.a(f'<path d="{d}" fill="{tint}" opacity="0.1"/>',
        f'<path d="{d}" fill="none" stroke="#7ac8b8" stroke-width="7" opacity="0.55"/>',
        f'<path d="{d}" fill="none" stroke="#d8f6f0" stroke-width="2.5" opacity="0.9"/>')


def build():
    s = Svg("Si", ORANGE)
    background(s, glows=[(560, 360, 380, 0.8)], seed=2500, stars=24, star_box=(0, 0, 1200, 220), bokeh=5, tint=0.6)
    rnd = random.Random(1500)

    # ---------- the floor
    s.d(lin("floor", [(0, "#4a2e22"), (1, "#1a1012")], x1=0, y1=0, x2=0, y2=1))
    s.a(f'<rect x="0" y="{FLOOR}" width="1200" height="{800 - FLOOR}" fill="url(#floor)"/>',
        f'<rect x="0" y="{FLOOR}" width="1200" height="4" fill="#c87a4a" opacity="0.5"/>')

    # ---------- the furnace, its mouth glowing
    mx, my, mr = 560, 380, 78
    furnace(s, 560, FLOOR, 400, 400, mx, my, mr)

    # ---------- sand on the left
    sand(s, 170, FLOOR, 330, 190, rnd)

    # ---------- the blowpipe: from the gather by the mouth up over the sand, to the glassblower out of the picture
    gx, gy = 430, 462
    s.a(f'<line x1="{gx - 30}" y1="{gy - 10}" x2="-10" y2="250" stroke="#3a3e48" stroke-width="12" stroke-linecap="round"/>',
        f'<line x1="{gx - 30}" y1="{gy - 12}" x2="-10" y2="248" stroke="#9aa2b2" stroke-width="3" opacity="0.7"/>')
    gather(s, gx, gy, 46)

    # ---------- the finished glass on a shelf: a bottle, a vase and a tumbler, clear
    shelf_y = 520
    s.a(f'<rect x="800" y="{shelf_y}" width="400" height="16" fill="#6b4630"/>',
        f'<rect x="800" y="{shelf_y + 16}" width="400" height="8" fill="#3a2418"/>')
    # the warm light behind shows straight through the glass
    s.a(glow(990, 430, 150, "#ff9a4a", 0.35, "s30"))
    bx = 870
    bottle = (f"M{bx - 34},{shelf_y} L{bx - 34},{shelf_y - 150} Q{bx - 34},{shelf_y - 190} {bx - 10},{shelf_y - 205} L{bx - 10},{shelf_y - 255} "
              f"L{bx + 10},{shelf_y - 255} L{bx + 10},{shelf_y - 205} Q{bx + 34},{shelf_y - 190} {bx + 34},{shelf_y - 150} L{bx + 34},{shelf_y}Z")
    clear_glass(s, bottle, "bottle")
    vx = 985
    vase = (f"M{vx - 28},{shelf_y} Q{vx - 70},{shelf_y - 70} {vx - 48},{shelf_y - 130} Q{vx - 24},{shelf_y - 170} {vx - 26},{shelf_y - 200} "
            f"L{vx + 26},{shelf_y - 200} Q{vx + 24},{shelf_y - 170} {vx + 48},{shelf_y - 130} Q{vx + 70},{shelf_y - 70} {vx + 28},{shelf_y}Z")
    clear_glass(s, vase, "vase")
    tx = 1110
    tumbler = f"M{tx - 40},{shelf_y - 130} L{tx - 32},{shelf_y} L{tx + 32},{shelf_y} L{tx + 40},{shelf_y - 130}"
    s.a(f'<path d="{tumbler}Z" fill="#bfeee6" opacity="0.1"/>',
        f'<path d="{tumbler}" fill="none" stroke="#7ac8b8" stroke-width="7" opacity="0.55"/>',
        f'<path d="{tumbler}" fill="none" stroke="#d8f6f0" stroke-width="2.5" opacity="0.9"/>',
        f'<ellipse cx="{tx}" cy="{shelf_y - 130}" rx="40" ry="8" fill="none" stroke="#d8f6f0" stroke-width="2.5" opacity="0.9"/>',
        f'<rect x="{tx - 32}" y="{shelf_y - 10}" width="64" height="10" fill="#9ad8c8" opacity="0.35"/>')
    # shine on the glass
    for (x, y0, y1) in ((bx - 20, shelf_y - 160, shelf_y - 20), (vx - 34, shelf_y - 120, shelf_y - 40), (tx - 26, shelf_y - 118, shelf_y - 18)):
        s.a(f'<line x1="{x}" y1="{y0}" x2="{x + 2}" y2="{y1}" stroke="#ffffff" stroke-width="6" stroke-linecap="round" opacity="0.5"/>')
    for (x, y) in ((bx + 14, shelf_y - 230), (vx + 30, shelf_y - 150), (tx + 30, shelf_y - 100)):
        s.a(sparkle(x, y, 13, "#ffffff", 0.85))

    # ---------- a close-up of the glass: a jumbled network of silicon and oxygen
    cx, cy, r = 1000, 170, 120
    opening, closing = magnifier(s, "zoomGlass", cx, cy, r, ORANGE, src=(vx, shelf_y - 110, 30))
    s.a(opening)
    rr = random.Random(9)
    si = []
    for j in range(-3, 4):
        for i in range(-3, 4):
            si.append((cx + i * 64 + rr.uniform(-16, 16) + (j % 2) * 20, cy + j * 58 + rr.uniform(-14, 14)))
    links = []
    for a in range(len(si)):
        near = sorted(range(len(si)), key=lambda b: (si[a][0] - si[b][0]) ** 2 + (si[a][1] - si[b][1]) ** 2)[1:4]
        for b in near:
            if (b, a) not in links and math.dist(si[a], si[b]) < 100:
                links.append((a, b))
    for (a, b) in links:
        (x0, y0), (x1, y1) = si[a], si[b]
        s.a(bond(x0, y0, x1, y1, 6, "#8a6a5a"))
    for (a, b) in links:
        (x0, y0), (x1, y1) = si[a], si[b]
        s.a(ball((x0 + x1) / 2 + rr.uniform(-5, 5), (y0 + y1) / 2 + rr.uniform(-5, 5), 10, "O"))
    for (x, y) in si:
        s.a(ball(x, y, 16, "Si"))
    s.a(closing)
    finish(s)
    s.save("glass")


if __name__ == "__main__":
    build()
