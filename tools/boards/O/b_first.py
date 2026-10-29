"""Board 'first': an ancient sea 2.4 billion years ago. Stromatolites of blue-green microbes
breathe out oxygen bubbles, the orange sky turns blue, a cliff of banded iron (red and grey) at the side."""
import math
import random
from kit import *

SURF = 292


def strom_outline(cx, by, w, h, s=1.0):
    w, h = w * s, h * s
    return (f"M{f(cx - 0.34 * w)},{f(by)} "
            f"C{f(cx - 0.42 * w)},{f(by - 0.25 * h)} {f(cx - 0.56 * w)},{f(by - 0.48 * h)} {f(cx - 0.5 * w)},{f(by - 0.7 * h)} "
            f"C{f(cx - 0.44 * w)},{f(by - 0.95 * h)} {f(cx - 0.2 * w)},{f(by - h)} {f(cx)},{f(by - h)} "
            f"C{f(cx + 0.2 * w)},{f(by - h)} {f(cx + 0.44 * w)},{f(by - 0.95 * h)} {f(cx + 0.5 * w)},{f(by - 0.7 * h)} "
            f"C{f(cx + 0.56 * w)},{f(by - 0.48 * h)} {f(cx + 0.42 * w)},{f(by - 0.25 * h)} {f(cx + 0.34 * w)},{f(by)}Z")


def strom_top(cx, by, w, h):
    return (f"M{f(cx - 0.5 * w)},{f(by - 0.7 * h)} "
            f"C{f(cx - 0.44 * w)},{f(by - 0.95 * h)} {f(cx - 0.2 * w)},{f(by - h)} {f(cx)},{f(by - h)} "
            f"C{f(cx + 0.2 * w)},{f(by - h)} {f(cx + 0.44 * w)},{f(by - 0.95 * h)} {f(cx + 0.5 * w)},{f(by - 0.7 * h)}")


def build():
    s = Svg("#4fd1c5")
    background(s, [], seed=51, stars=0, bokeh=0)
    rnd = random.Random(12)
    s.d(lin("sky", [(0, "#ff5a36"), (0.3, "#ff8a4c"), (0.5, "#ffc27a"), (0.68, "#9fd0ff"), (1, "#3d8cff")], x1=0, y1=0, x2=1, y2=0),
        lin("skyTop", [(0, "#0b0f24", 0.6), (0.6, "#0b0f24", 0.1), (1, "#0b0f24", 0)], x1=0, y1=0, x2=0, y2=1),
        lin("sea", [(0, "#3fd6c6", 0.55), (0.25, "#1d9aa0", 0.78), (0.6, "#0f4f6e", 0.95), (1, "#0b1a33", 1)],
            x1=0, y1=SURF, x2=0, y2=800, user=True),
        lin("volc", [(0, "#5a2a26"), (1, "#2a1420")], x1=0, y1=0, x2=0, y2=1),
        lin("floor", [(0, "#2b5a5a"), (1, "#0b1a2e")], x1=0, y1=0, x2=0, y2=1),
        lin("strom", [(0, "#d9a868"), (0.5, "#a8763f"), (1, "#5e3c22")], x1=0, y1=0, x2=0, y2=1),
        lin("shaft", [(0, "#e8fffb", 0.35), (1, "#e8fffb", 0)], x1=0, y1=0, x2=0, y2=1),
        rad("sunF", [(0, "#ffffff"), (0.5, "#fff3c0"), (1, "#ffd27a")]),
        rad("sunG", [(0, "#fff3c0", 0.8), (0.4, "#ffe0a0", 0.3), (1, "#ffc27a", 0)]),
        rad("bub", [(0, "#c8fff4", 0.05), (0.75, "#9ff7e6", 0.18), (1, "#e8fffb", 0.5)]),
        lin("cliffShade", [(0, "#000", 0.45), (0.25, "#000", 0.1), (1, "#000", 0)], x1=0, y1=0, x2=1, y2=0))

    # ---------- sky
    s.a(f'<rect width="1200" height="{SURF + 4}" fill="url(#sky)"/>',
        f'<rect width="1200" height="{SURF + 4}" fill="url(#skyTop)"/>')
    sx, sy = 590, 128
    s.a(f'<circle cx="{sx}" cy="{sy}" r="170" fill="url(#sunG)"/>',
        f'<circle cx="{sx}" cy="{sy}" r="44" fill="url(#sunF)" filter="url(#g2)"/>')

    # ---------- volcano with a plume (early, bare Earth)
    s.a(f'<path d="M-20,{SURF} L60,{SURF - 40} L180,170 Q200,158 222,160 Q244,158 262,172 L400,{SURF - 28} L470,{SURF} Z" '
        f'fill="url(#volc)"/>',
        f'<path d="M184,170 Q222,150 258,172 Q222,182 184,170Z" fill="#ff7a2a" filter="url(#g1)"/>',
        f'<path d="M210,172 C202,196 218,214 208,238 C200,256 212,268 204,286" fill="none" stroke="#ff7a2a" stroke-width="9" '
        f'stroke-linecap="round" opacity="0.85" filter="url(#g2)"/>',
        f'<path d="M210,172 C202,196 218,214 208,238 C200,256 212,268 204,286" fill="none" stroke="#ffd27a" stroke-width="3" '
        f'stroke-linecap="round" opacity="0.9"/>')
    plume = [(222, 150, 26), (206, 118, 34), (226, 84, 40), (190, 62, 38), (150, 52, 32)]
    for (x, y, r) in plume:
        s.a(f'<circle cx="{x}" cy="{y}" r="{r}" fill="#6e5a66" opacity="0.55" filter="url(#s4)"/>')
    s.a(f'<path d="M-20,{SURF} L120,{SURF - 26} L220,{SURF - 10} L320,{SURF - 30} L480,{SURF} Z" fill="#3a1e24"/>')

    # ---------- banded iron cliff (right)
    cliff = [(1220, 92), (1150, 96), (1090, 104), (1052, 124), (1030, 158), (1012, 200), (1004, 246), (988, 292),
             (976, 340), (962, 400), (946, 460), (930, 520), (918, 580), (910, 640), (1220, 640)]
    cp = "M" + " L".join(f"{f(x)},{f(y)}" for x, y in cliff) + "Z"
    s.d(f'<clipPath id="cliffClip"><path d="{cp}"/></clipPath>')
    reds = ["#c4452b", "#d9583a", "#a8361f", "#e2683f"]
    greys = ["#5d6675", "#7d8796", "#4a5160", "#8c95a3"]
    bands = []
    y = 86
    i = 0
    while y < 650:
        t = rnd.uniform(9, 22)
        col = (reds if i % 2 == 0 else greys)[rnd.randrange(4)]
        ph = rnd.uniform(0, 6)
        top = [(x, y + 4 * math.sin(x / 38 + ph) + (x - 900) * 0.035) for x in range(880, 1240, 40)]
        bot = [(x, yy + t) for x, yy in reversed(top)]
        bands.append(f'<path d="M{P(top)} L{P(bot)}Z" fill="{col}"/>')
        y += t * 0.92
        i += 1
    cliff_inner = "".join(bands)
    s.a(f'<g clip-path="url(#cliffClip)"><rect x="880" y="80" width="340" height="580" fill="#7a3a2a"/>' + "".join(bands)
        + f'<rect x="880" y="80" width="340" height="580" fill="url(#cliffShade)"/>'
        + '<path d="M1060,140 L1072,210 L1060,260 M1120,300 L1110,380 L1130,430" stroke="#2a1410" stroke-width="3" fill="none" opacity="0.5"/>'
        + '</g>')
    s.a(f'<path d="M{P(cliff[:9])}" fill="none" stroke="#ffd0a0" stroke-width="3" opacity="0.45"/>')

    # ---------- the sea (cross-section)
    s.a(f'<rect x="0" y="{SURF}" width="1200" height="{800 - SURF}" fill="url(#sea)"/>')
    # the banded iron still shows under the water, a little hazy
    s.d(f'<clipPath id="cliffUnder"><path d="{cp}"/></clipPath>',
        f'<clipPath id="underWater"><rect x="0" y="{SURF}" width="1200" height="{800 - SURF}"/></clipPath>')
    s.a(f'<g clip-path="url(#underWater)"><g clip-path="url(#cliffUnder)" opacity="0.5">' + cliff_inner
        + f'<rect x="880" y="80" width="340" height="580" fill="url(#cliffShade)"/></g></g>')
    # light shafts
    for (x0, w0, sk) in ((330, 50, 120), (470, 70, 150), (640, 50, 90), (760, 40, 110)):
        poly = [(x0, SURF), (x0 + w0, SURF), (x0 + w0 + sk + 40, 600), (x0 + sk - 30, 600)]
        s.a(f'<polygon points="{P(poly)}" fill="url(#shaft)" filter="url(#s4)"/>')
    # sea floor
    fl = [(x, 586 + 10 * math.sin(x / 90) + 6 * math.sin(x / 31)) for x in range(-20, 1240, 40)]
    s.a(f'<path d="M{P(fl)} L1240,800 L-20,800Z" fill="url(#floor)"/>')

    # ---------- stromatolites
    stroms = [(130, 596, 150, 150), (300, 600, 200, 214), (472, 594, 130, 128), (612, 600, 176, 178), (770, 596, 120, 112),
              (858, 598, 80, 70)]
    tops = []
    for (cx, by, w, h) in stroms:
        out = [f'<path d="{strom_outline(cx, by, w, h)}" fill="url(#strom)" stroke="#3e2614" stroke-width="3"/>']
        for k, sc in enumerate((0.84, 0.68, 0.52, 0.36)):
            col = "#e6ba7c" if k % 2 == 0 else "#7a5030"
            out.append(f'<path d="{strom_outline(cx, by, w, h, sc)}" fill="none" stroke="{col}" stroke-width="3" opacity="0.55"/>')
        tp = strom_top(cx, by, w, h)
        out.append(f'<path d="{tp}" fill="none" stroke="#3fffc0" stroke-width="22" stroke-linecap="round" opacity="0.35" filter="url(#s8)"/>')
        out.append(f'<path d="{tp}" fill="none" stroke="#1fae8a" stroke-width="14" stroke-linecap="round"/>')
        out.append(f'<path d="{tp}" fill="none" stroke="#5ff0c0" stroke-width="6" stroke-linecap="round" stroke-dasharray="2 9"/>')
        s.a("".join(out))
        tops.append((cx, by - h, w))

    # ---------- oxygen bubbles rising
    for (cx, ty, w) in tops:
        n = 3 if w > 100 else 2
        for j in range(n):
            x = cx + rnd.uniform(-w * 0.28, w * 0.28)
            y = ty - 14
            r = rnd.uniform(4, 7)
            while y > SURF + 26:
                s.a(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r)}" fill="url(#bub)" stroke="#d6fff6" stroke-width="1.8"/>')
                y -= rnd.uniform(34, 56)
                x += rnd.uniform(-10, 10)
                r = min(r * 1.12, 15)
    for (x, y) in ((262, 330), (590, 352), (406, 410), (720, 330)):
        s.a(f'<circle cx="{x}" cy="{y}" r="25" fill="url(#bub)" stroke="#e8fffb" stroke-width="2.5"/>',
            o2(x, y + 1, 8, rnd.uniform(-30, 30)),
            f'<path d="M{x - 15},{y - 8} A17,17 0 0 1 {x - 4},{y - 18}" fill="none" stroke="#fff" stroke-width="3" '
            f'stroke-linecap="round" opacity="0.7"/>')

    # rust settling near the cliff (oxygen meets dissolved iron)
    for i in range(16):
        x, y = rnd.uniform(830, 950), rnd.uniform(330, 560)
        s.a(f'<rect x="{f(x)}" y="{f(y)}" width="{f(rnd.uniform(4, 7))}" height="{f(rnd.uniform(3, 5))}" rx="1.5" '
            f'fill="#e2683f" opacity="{rnd.uniform(0.55, 0.9):.2f}" transform="rotate({rnd.randint(0, 90)} {f(x)} {f(y)})"/>')

    # ---------- surface line
    surf = [(x, SURF + 3 * math.sin(x / 22)) for x in range(-10, 1220, 12)]
    s.a(f'<path d="M{P(surf)}" fill="none" stroke="#c8fff4" stroke-width="3" opacity="0.75"/>')
    # oxygen escaping into the air, drifting towards the blue sky
    for (x, y, r) in ((640, 262, 9), (700, 222, 10), (760, 182, 11), (842, 150, 12), (690, 140, 9), (560, 238, 8)):
        s.a(o2(x, y, r, rnd.uniform(-40, 40), op=0.95))
    for (x, y) in ((600, 280), (720, 262), (800, 228)):
        s.a(f'<circle cx="{x}" cy="{y}" r="3" fill="#fff" opacity="0.6"/>')

    finish(s)
    return s


if __name__ == "__main__":
    s = build()
    print(s.save("first"))
