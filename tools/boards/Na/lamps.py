"""Board 'lamps': one street at night under two lamps. On the left an old low-pressure sodium lamp (its
U-shaped tube glowing inside the lantern) pours yellow light, and the car, the tree, the flowers and the
ball under it show only shades of yellow and grey; on the right a white lamp shows the same things in
their colours: a red car, a green tree, flowers of every colour, a blue ball."""
import math
import os
import random
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from lib.style import *  # noqa: E402,F401

YELLOW = "#ffc83d"
ROAD = 512  # the kerb's top edge
COLOURS = {
    "body": "#e8323c", "bodyDark": "#9e1a22", "roof": "#c4232c", "window": "#9fd8ff", "wheel": "#16161e", "hub": "#c8ccd4",
    "light": "#fff6d0", "tree": "#3fbf4a", "treeDark": "#1f7a2e", "trunk": "#7a4a26", "leaf": "#2f9a3a",
    "f1": "#ff4d6d", "f2": "#4d7dff", "f3": "#ffd23f", "f4": "#c86bff", "ball": "#2f7dff", "ballStripe": "#ffffff",
    "road": "#2e3446", "lane": "#e8ecf4", "kerb": "#8a92a6", "pave": "#4a5266", "bush": "#2c8a3a",
}


def mono(h):
    """What a colour looks like under sodium light: only how much light near 589 nm it sends back, so a
    shade between dark olive and pale yellow (red, green and blue end up alike)."""
    r, g, b = hex2rgb(h)
    t = (0.55 * r + 0.45 * g) / 255
    return mix("#17120a", "#ffe78a", t ** 0.9)


def car(cx, base, pal):
    """A small car seen from the side, its wheels on the road at y = base."""
    p = pal
    w, h = 250, 96
    x0 = cx - w / 2
    body = [(x0, base - 28), (x0 + 6, base - 58), (x0 + 40, base - 66), (x0 + 70, base - h), (x0 + 168, base - h),
            (x0 + 204, base - 64), (x0 + 244, base - 56), (x0 + w, base - 28), (x0 + w - 6, base - 16), (x0 + 6, base - 16)]
    out = [f'<ellipse cx="{f(cx)}" cy="{f(base + 4)}" rx="{f(w * 0.56)}" ry="10" fill="#000" opacity="0.4"/>',
           f'<path d="{smooth(body)}" fill="{p["body"]}" stroke="{p["bodyDark"]}" stroke-width="3"/>',
           f'<path d="M{f(x0 + 8)},{f(base - 34)} L{f(x0 + w - 8)},{f(base - 34)}" stroke="{p["bodyDark"]}" stroke-width="4" opacity="0.6"/>',
           f'<path d="M{f(x0 + 82)},{f(base - 86)} L{f(x0 + 116)},{f(base - 86)} L{f(x0 + 116)},{f(base - 62)} L{f(x0 + 62)},{f(base - 62)}Z" '
           f'fill="{p["window"]}"/>',
           f'<path d="M{f(x0 + 124)},{f(base - 86)} L{f(x0 + 162)},{f(base - 86)} L{f(x0 + 190)},{f(base - 62)} L{f(x0 + 124)},{f(base - 62)}Z" '
           f'fill="{p["window"]}"/>',
           f'<rect x="{f(x0 + w - 18)}" y="{f(base - 50)}" width="14" height="10" rx="4" fill="{p["light"]}"/>',
           f'<path d="M{f(x0 + 74)},{f(base - 90)} L{f(x0 + 160)},{f(base - 90)}" stroke="#ffffff" stroke-width="4" '
           f'stroke-linecap="round" opacity="0.45"/>']
    for wx in (x0 + 58, x0 + w - 58):
        out.append(f'<circle cx="{f(wx)}" cy="{f(base - 16)}" r="26" fill="{p["wheel"]}"/>'
                   f'<circle cx="{f(wx)}" cy="{f(base - 16)}" r="11" fill="{p["hub"]}"/>')
    return "".join(out)


def tree(cx, base, pal, rnd):
    p = pal
    out = [f'<path d="M{f(cx - 12)},{f(base)} L{f(cx - 8)},{f(base - 120)} L{f(cx + 8)},{f(base - 120)} L{f(cx + 12)},{f(base)}Z" '
           f'fill="{p["trunk"]}"/>']
    blobs = [(cx, base - 190, 72), (cx - 58, base - 150, 52), (cx + 58, base - 150, 54), (cx - 30, base - 236, 46), (cx + 36, base - 230, 48)]
    for (x, y, r) in blobs:
        out.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r)}" fill="{p["treeDark"]}"/>')
    for (x, y, r) in blobs:
        out.append(f'<circle cx="{f(x - r * 0.12)}" cy="{f(y - r * 0.14)}" r="{f(r * 0.82)}" fill="{p["tree"]}"/>')
    return "".join(out)


def flowers(x0, base, pal, rnd):
    p = pal
    out = [f'<path d="M{f(x0)},{f(base)} Q{f(x0 + 70)},{f(base - 46)} {f(x0 + 150)},{f(base)}Z" fill="{p["bush"]}"/>']
    for k in range(7):
        x = x0 + 18 + k * 19
        y = base - 18 - 16 * math.sin(k / 6 * math.pi) - rnd.uniform(0, 6)
        col = p[f"f{k % 4 + 1}"]
        for a in range(5):
            ang = a / 5 * math.pi * 2
            out.append(f'<circle cx="{f(x + math.cos(ang) * 6)}" cy="{f(y + math.sin(ang) * 6)}" r="5.5" fill="{col}"/>')
        out.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="3.5" fill="{p["f3"] if col != p["f3"] else p["f1"]}"/>')
    return "".join(out)


def ball(cx, cy, r, pal):
    p = pal
    return (f'<circle cx="{f(cx)}" cy="{f(cy)}" r="{f(r)}" fill="{p["ball"]}" stroke="{p["ballStripe"]}" stroke-opacity="0.35" stroke-width="2"/>'
            f'<path d="M{f(cx - r)},{f(cy)} Q{f(cx)},{f(cy - r * 0.5)} {f(cx + r)},{f(cy)}" fill="none" stroke="{p["ballStripe"]}" stroke-width="6"/>'
            f'<circle cx="{f(cx - r * 0.35)}" cy="{f(cy - r * 0.4)}" r="{f(r * 0.2)}" fill="#ffffff" opacity="0.6"/>')


def street(s, pal, ox, rnd):
    """One half of the street, in a palette: road, kerb, pavement, a tree, flowers, a ball and a car."""
    p = pal
    out = [f'<rect x="{ox}" y="{ROAD}" width="600" height="20" fill="{p["kerb"]}"/>',
           f'<rect x="{ox}" y="{ROAD - 70}" width="600" height="70" fill="{p["pave"]}"/>',
           f'<rect x="{ox}" y="{ROAD + 20}" width="600" height="{800 - ROAD - 20}" fill="{p["road"]}"/>']
    for k in range(4):
        out.append(f'<rect x="{ox + 40 + k * 150}" y="{ROAD + 96}" width="80" height="9" rx="4" fill="{p["lane"]}" opacity="0.8"/>')
    out.append(tree(ox + 96, ROAD - 14, p, rnd))
    out.append(flowers(ox + 330, ROAD - 6, p, rnd))
    out.append(ball(ox + 520, ROAD - 30, 26, p))
    out.append(car(ox + 300, ROAD + 84, p))
    return "".join(out)


def lamp_post(s, x, head_x, top, kind):
    """A street lamp: a post with an arm and a lantern; sodium shows its glowing U-tube under the lantern."""
    out = [f'<rect x="{x - 9}" y="{top}" width="18" height="{ROAD - 40 - top}" fill="#3a4258"/>',
           f'<rect x="{x - 4}" y="{top + 6}" width="5" height="{ROAD - 52 - top}" fill="#6a7490" opacity="0.7"/>',
           f'<rect x="{x - 16}" y="{ROAD - 52}" width="32" height="14" rx="4" fill="#2a3044"/>',
           f'<path d="M{x},{top + 8} Q{x},{top - 30} {(x + head_x) / 2},{top - 30} L{head_x},{top - 30}" fill="none" stroke="#3a4258" '
           f'stroke-width="12" stroke-linecap="round"/>']
    if kind == "na":
        lx = head_x
        out.append(f'<path d="M{lx - 92},{top - 34} Q{lx},{top - 70} {lx + 92},{top - 34} L{lx + 82},{top - 12} L{lx - 82},{top - 12}Z" fill="#2c3246"/>')
        out.append(f'<rect x="{lx - 84}" y="{top - 14}" width="168" height="26" rx="11" fill="#ffd25a" opacity="0.55"/>')
        out.append(f'<path d="M{lx - 70},{top - 4} L{lx + 66},{top - 4} A6,6 0 0 1 {lx + 66},{top + 8} L{lx - 70},{top + 8}" fill="none" '
                   f'stroke="#fff3b0" stroke-width="6" stroke-linecap="round" filter="url(#g1)"/>')
    else:
        lx = head_x
        out.append(f'<path d="M{lx - 70},{top - 36} L{lx + 70},{top - 36} L{lx + 62},{top - 16} L{lx - 62},{top - 16}Z" fill="#2c3246"/>')
        out.append(f'<rect x="{lx - 60}" y="{top - 18}" width="120" height="10" rx="5" fill="#ffffff"/>')
    s.a("".join(out))


def build():
    s = Svg("Na", YELLOW)
    background(s, glows=[(300, 160, 300, 0.7)], seed=1932, stars=60, star_box=(0, 0, 1200, 260), bokeh=4)
    rnd = random.Random(589)
    sodium = {k: mono(v) for k, v in COLOURS.items()}
    s.d('<clipPath id="left"><rect x="0" y="0" width="600" height="800"/></clipPath>',
        '<clipPath id="right"><rect x="600" y="0" width="600" height="800"/></clipPath>',
        lin("coneNa", [(0, "#ffcf4a", 0.5), (0.6, "#ffb21e", 0.2), (1, "#ffb21e", 0.05)], x1=0, y1=0, x2=0, y2=1),
        lin("coneW", [(0, "#ffffff", 0.42), (0.6, "#eaf2ff", 0.14), (1, "#eaf2ff", 0.04)], x1=0, y1=0, x2=0, y2=1),
        rad("glowNa", [(0, "#fff2b0", 0.95), (0.25, "#ffc83d", 0.5), (1, "#ff9a1e", 0)]),
        rad("glowW", [(0, "#ffffff", 0.95), (0.25, "#e6f0ff", 0.45), (1, "#cfe0ff", 0)]),
        lin("mid", [(0, NAVY_DEEP, 0), (0.5, NAVY_DEEP, 0.6), (1, NAVY_DEEP, 0)], x1=540, y1=0, x2=660, y2=0, user=True))

    # houses along the street, dark against the sky, a few lit windows
    houses = [(0, 300, 170), (160, 250, 150), (300, 320, 190), (480, 280, 140), (610, 300, 160), (760, 240, 170), (920, 310, 150),
              (1060, 270, 150)]
    for (x, y, w) in houses:
        s.a(f'<rect x="{x}" y="{y}" width="{w}" height="{ROAD - 60 - y}" fill="#141a36"/>',
            f'<path d="M{x - 8},{y} L{x + w / 2},{y - 46} L{x + w + 8},{y}Z" fill="#10152e"/>')
        for j in range(2):
            for i in range(2):
                if rnd.random() < 0.55:
                    s.a(f'<rect x="{x + 26 + i * (w - 80)}" y="{y + 30 + j * 64}" width="28" height="36" rx="3" fill="#ffd27a" opacity="0.75"/>')

    # the two halves of the street, each in its own light
    s.a(f'<g clip-path="url(#left)">{street(s, sodium, 0, random.Random(7))}</g>')
    s.a(f'<g clip-path="url(#right)">{street(s, COLOURS, 600, random.Random(7))}</g>')
    # the light pouring down from each lamp
    s.a(f'<polygon points="{P([(256, 170), (424, 170), (620, 700), (60, 700)])}" fill="url(#coneNa)"/>',
        f'<polygon points="{P([(870, 170), (1010, 170), (1200, 700), (680, 700)])}" fill="url(#coneW)"/>')
    # sodium light tints everything on its side
    s.a('<rect x="0" y="0" width="600" height="800" fill="#ffb21e" opacity="0.1"/>')
    s.a('<rect x="540" y="0" width="120" height="800" fill="url(#mid)"/>')
    # the lamps and their glows
    lamp_post(s, 228, 340, 170, "na")
    lamp_post(s, 828, 940, 170, "w")
    s.a('<circle cx="340" cy="164" r="150" fill="url(#glowNa)"/>', '<circle cx="940" cy="150" r="120" fill="url(#glowW)"/>')
    finish(s)
    s.save("lamps")


if __name__ == "__main__":
    build()
