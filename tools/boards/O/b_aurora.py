"""Board 'aurora': green aurora curtains (faint red top) over snowy mountains and a calm lake,
solar particles streaming in from the top corner, one oxygen atom glowing green."""
import math
import random
from kit import *

HORIZON = 500


def curtain(base, height, op, x0, x1, step, rnd, gid):
    rects = []
    x = x0
    while x < x1:
        yb = base(x)
        h = height(x) * rnd.uniform(0.85, 1.12)
        o = max(0.05, min(1.0, op(x) * rnd.uniform(0.55, 1.0)))
        rects.append(f'<rect x="{f(x)}" y="{f(yb - h)}" width="{f(step + 2)}" height="{f(h)}" opacity="{o:.2f}"/>')
        x += step
    return f'<g fill="url(#{gid})">' + "".join(rects) + "</g>"


def ridge(points):
    return "M" + " L".join(f"{f(x)},{f(y)}" for x, y in points)


def build():
    s = Svg("#6ef0a0")
    background(s, [], seed=61, stars=0, bokeh=0)
    rnd = random.Random(7)
    s.d(lin("sky", [(0, "#060a1c"), (0.55, "#0c1d3a"), (1, "#123f4a")], x1=0, y1=0, x2=0, y2=1),
        lin("aur", [(0, "#6ef0a0", 0), (0.03, "#e6fff0", 0.95), (0.12, "#7dffb0", 0.9), (0.4, "#3fe08f", 0.45),
                    (0.68, "#2fc49a", 0.12), (0.8, "#ff5a8a", 0.22), (0.92, "#ff4d6d", 0.12), (1, "#ff4d6d", 0)],
            x1=0, y1=1, x2=0, y2=0),
        lin("aur2", [(0, "#6ef0a0", 0), (0.04, "#c8ffe0", 0.75), (0.2, "#5ff0a0", 0.55), (0.55, "#36d48c", 0.15),
                     (0.78, "#ff5a8a", 0.14), (1, "#ff4d6d", 0)], x1=0, y1=1, x2=0, y2=0),
        lin("mtnFar", [(0, "#2b4a6e"), (1, "#162a48")], x1=0, y1=0, x2=0, y2=1),
        lin("mtnNear", [(0, "#1a2c4a"), (1, "#0d1830")], x1=0, y1=0, x2=0, y2=1),
        lin("snow", [(0, "#f2fff8"), (1, "#a8d8d0")], x1=0, y1=0, x2=0, y2=1),
        lin("lake", [(0, "#0f2a3a"), (1, "#081428")], x1=0, y1=0, x2=0, y2=1),
        rad("glowO", [(0, "#b6ffd0", 0.9), (0.4, "#6ef0a0", 0.45), (1, "#6ef0a0", 0)]),
        f'<clipPath id="lakeClip"><rect x="0" y="{HORIZON}" width="1200" height="{800 - HORIZON}"/></clipPath>')

    # ---------- sky
    s.a(f'<rect width="1200" height="{HORIZON + 2}" fill="url(#sky)"/>')
    stars = []
    for i in range(110):
        x, y = rnd.uniform(0, 1200), rnd.uniform(0, HORIZON - 60)
        stars.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{rnd.choice([0.8, 1, 1.2, 1.5, 1.9])}" fill="#fff" '
                     f'opacity="{rnd.uniform(0.35, 0.95):.2f}"/>')
    for i in range(7):
        stars.append(sparkle(rnd.uniform(40, 1160), rnd.uniform(30, 300), rnd.uniform(5, 8), "#fff", 0.85))
    s.a('<g id="stars">' + "".join(stars) + "</g>")

    # ---------- aurora curtains
    s.d(lin("airglow", [(0, "#6ef0a0", 0), (0.45, "#3fe08f", 0.3), (1, "#6ef0a0", 0.5)], x1=0, y1=260, x2=0, y2=HORIZON, user=True))
    s.a(f'<rect x="0" y="260" width="1200" height="{HORIZON - 260}" fill="url(#airglow)"/>')
    aur = []

    def b1(x):
        return 398 + 30 * math.sin(x / 150 + 0.6) + 24 * math.sin(x / 53 + 1.3) + 12 * math.sin(x / 23)

    def d1(x):
        return abs(30 / 150 * math.cos(x / 150 + 0.6) + 24 / 53 * math.cos(x / 53 + 1.3) + 12 / 23 * math.cos(x / 23))

    def b2(x):
        return 330 + 40 * math.sin(x / 130 + 2.2) + 14 * math.sin(x / 47)

    def b3(x):
        return 300 + 40 * math.sin(x / 110 + 4.0)

    # back curtain (higher, dimmer)
    aur.append('<g filter="url(#s4)" opacity="0.75">'
               + curtain(b2, lambda x: 200 + 40 * math.sin(x / 90), lambda x: 0.55, 120, 1100, 7, rnd, "aur2") + "</g>")
    aur.append('<g filter="url(#s4)" opacity="0.6">'
               + curtain(b3, lambda x: 170, lambda x: 0.5, 700, 1150, 7, rnd, "aur2") + "</g>")
    # a soft glow below the curtain down to the mountains (no dark gap under its lower edge)
    skirt = [(x, b1(x) - 14) for x in range(20, 1190, 20)]
    aur.append(f'<path d="M{P(skirt)} L1190,{HORIZON} L20,{HORIZON}Z" fill="#4fe89a" opacity="0.32" filter="url(#s8)"/>')
    # main curtain: brighter where it folds
    aur.append('<g filter="url(#s2)">'
               + curtain(b1, lambda x: 290 + 50 * math.sin(x / 75 + 1), lambda x: 0.5 + 0.8 * d1(x), 30, 1176, 6, rnd, "aur")
               + "</g>")
    # bright lower edge
    edge = [(x, b1(x)) for x in range(40, 1176, 12)]
    aur.append(f'<path d="{ridge(edge)}" fill="none" stroke="#b6ffd0" stroke-width="6" opacity="0.55" filter="url(#s4)"/>')
    s.a('<g id="aurora">' + "".join(aur) + "</g>")
    s.a(f'<ellipse cx="600" cy="{HORIZON - 40}" rx="700" ry="120" fill="#6ef0a0" opacity="0.12" filter="url(#s30)"/>')

    # ---------- solar particles from the top right corner + an oxygen atom glowing
    parts = []
    for i in range(13):
        x0 = 1200 + rnd.uniform(-40, 60)
        y0 = rnd.uniform(-40, 70)
        L = rnd.uniform(110, 230)
        ang = math.radians(rnd.uniform(146, 160))
        x1, y1 = x0 + math.cos(ang) * L, y0 - math.sin(ang) * L * -1
        x1, y1 = x0 + math.cos(ang) * L, y0 + math.sin(ang) * L
        parts.append(f'<path d="M{f(x0)},{f(y0)} L{f(x1)},{f(y1)}" stroke="#fff4c0" stroke-width="2" stroke-linecap="round" opacity="0.35"/>'
                     f'<circle cx="{f(x1)}" cy="{f(y1)}" r="{f(rnd.uniform(2.5, 4))}" fill="#fff8d8"/>')
    s.a('<g filter="url(#g1)">' + "".join(parts) + "</g>")
    ox, oy = 870, 200
    s.a(f'<circle cx="{ox}" cy="{oy}" r="62" fill="url(#glowO)"/>',
        f'<circle cx="{ox}" cy="{oy}" r="30" fill="none" stroke="#b6ffd0" stroke-width="3" opacity="0.7"/>',
        f'<circle cx="{ox}" cy="{oy}" r="44" fill="none" stroke="#7dffb0" stroke-width="2.5" opacity="0.45"/>',
        f'<path d="M{ox + 120},{oy - 70} L{ox + 26},{oy - 14}" stroke="#fff4c0" stroke-width="3" stroke-linecap="round" '
        f'stroke-dasharray="2 8" opacity="0.8"/>',
        ball(ox, oy, 17, "O"))

    # ---------- mountains
    far = [(-20, 452), (60, 400), (120, 418), (200, 352), (262, 392), (330, 330), (400, 380), (470, 360), (540, 412),
           (620, 372), (700, 404), (790, 342), (860, 388), (930, 360), (1010, 410), (1090, 366), (1160, 400), (1220, 384)]
    near = [(-20, 470), (40, 440), (110, 380), (150, 404), (210, 336), (290, 418), (350, 462), (420, 430), (480, 466),
            (560, 448), (640, 470), (720, 432), (790, 452), (870, 392), (930, 340), (990, 396), (1050, 432), (1120, 402),
            (1220, 446)]

    def mountain_layer(pts, fill, snow_depth, snowline, gid):
        body = f'<path d="{ridge(pts)} L1220,{HORIZON + 2} L-20,{HORIZON + 2}Z" fill="url(#{fill})"/>'
        top, bot = [], []
        for i in range(len(pts) - 1):
            (xa, ya), (xb, yb) = pts[i], pts[i + 1]
            for k in range(4):
                t = k / 4
                x, y = xa + (xb - xa) * t, ya + (yb - ya) * t
                dep = max(0.0, (snowline - y)) * snow_depth
                if dep > 0:
                    dep *= rnd.uniform(0.7, 1.3)
                top.append((x, y))
                bot.append((x, y + dep))
        snow = f'<path d="M{P(top)} L{P(list(reversed(bot)))}Z" fill="url(#snow)" opacity="0.92"/>'
        return f'<g id="{gid}">' + body + snow + "</g>"

    s.a(mountain_layer(far, "mtnFar", 0.55, 410, "mfar"))
    s.a(mountain_layer(near, "mtnNear", 0.6, 440, "mnear"))
    # spruces on the shore
    trees = []
    for i in range(26):
        x = rnd.uniform(-10, 1210)
        if 380 < x < 820:
            continue
        h = rnd.uniform(26, 52)
        y = HORIZON + 2
        trees.append(f'<path d="M{f(x)},{f(y - h)} L{f(x + h * 0.22)},{f(y - h * 0.45)} L{f(x + h * 0.14)},{f(y - h * 0.45)} '
                     f'L{f(x + h * 0.3)},{f(y)} L{f(x - h * 0.3)},{f(y)} L{f(x - h * 0.14)},{f(y - h * 0.45)} '
                     f'L{f(x - h * 0.22)},{f(y - h * 0.45)}Z"/>')
    s.a('<g id="trees" fill="#07101e">' + "".join(trees) + "</g>")

    # ---------- lake with the reflection
    s.a(f'<rect x="0" y="{HORIZON}" width="1200" height="{800 - HORIZON}" fill="url(#lake)"/>')
    s.a(f'<g clip-path="url(#lakeClip)"><g transform="translate(0,{2 * HORIZON}) scale(1,-1)" opacity="0.42">'
        f'<use href="#stars"/><use href="#aurora"/><use href="#mfar"/><use href="#mnear"/><use href="#trees"/></g></g>')
    ripples = []
    for i in range(16):
        y = HORIZON + 10 + i * 9 + rnd.uniform(-3, 3)
        x = rnd.uniform(60, 1000)
        w = rnd.uniform(80, 240)
        ripples.append(f'<path d="M{f(x)},{f(y)} h{f(w)}" stroke="#bfffd8" stroke-width="1.6" opacity="{rnd.uniform(0.12, 0.3):.2f}"/>')
    s.a("".join(ripples))
    s.a(f'<path d="M0,{HORIZON + 1} H1200" stroke="#9fe8c0" stroke-width="1.5" opacity="0.35"/>')

    finish(s)
    return s


if __name__ == "__main__":
    s = build()
    print(s.save("aurora"))
