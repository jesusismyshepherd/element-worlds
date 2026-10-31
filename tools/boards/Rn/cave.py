"""Board 'cave': a cave breathing on a winter night. A snowy limestone mountain cut open: a big chamber
with stalactites and stalagmites and a still pool, a lower entrance at its foot where a path with lamps
leads in, and a narrow passage climbing to an opening high on the slope. Cold outside air flows in at the
bottom (blue), the cave's warmer air rises up the passage (orange) and out of the top, steaming in the
frost and carrying radon away. A guide with a helmet lamp, a little radon monitor on the wall."""
import math
import os
import random
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from rnkit import *  # noqa: E402,F401,F403

COLOR = "#3cc7d8"
WARM = "#ffb070"
COLD = "#a8d4ff"


def spruce(x, y, h, col="#1f4a3a", snow="#a9bcd6"):
    """A small spruce with snow on its tiers."""
    out = [f'<rect x="{f(x - 2.5)}" y="{f(y - h * 0.18)}" width="5" height="{f(h * 0.18)}" fill="#3a2a20"/>']
    for k in range(3):
        w = h * (0.42 - k * 0.1)
        top = y - h * (0.35 + k * 0.25)
        base = top + h * 0.38
        out.append(f'<polygon points="{P([(x - w, base), (x, top), (x + w, base)])}" fill="{col}"/>')
        out.append(f'<polygon points="{P([(x - w * 0.5, top + h * 0.2), (x, top), (x + w * 0.5, top + h * 0.2)])}" fill="{snow}" opacity="0.85"/>')
    return "".join(out)


def build():
    s = Svg("Rn", COLOR)
    setup(s)
    background(s, glows=[(560, 440, 340, 0.45), (1000, 200, 220, 0.4)], seed=2005, stars=70,
               star_box=(0, 0, 1200, 260), bokeh=4)
    rnd = random.Random(2009)
    s.d(lin("rockC", [(0, "#4a4656"), (1, "#2a2834")], x1=0, y1=0, x2=0, y2=1),
        lin("hollow", [(0, "#1a1824"), (1, "#100e18")], x1=0, y1=0, x2=0, y2=1),
        lin("snowC", [(0, "#b8c8de"), (1, "#7a8aa6")], x1=0, y1=0, x2=0, y2=1),
        lin("pool", [(0, "#2a6a8a"), (1, "#123a52")], x1=0, y1=0, x2=0, y2=1))

    # ---------- the mountain: its snowy outside, cut open in front
    outline = [(-30, 610), (60, 540), (180, 470), (300, 380), (420, 300), (560, 200), (680, 140), (780, 170),
               (900, 230), (1020, 290), (1120, 380), (1230, 470), (1230, 820), (-30, 820)]
    mountain = f'{smooth(outline[:-2], closed=False)} L1230,820 L-30,820Z'
    s.a(f'<path d="{mountain}" fill="url(#rockC)"/>')
    s.d(f'<clipPath id="mtnC"><path d="{mountain}"/></clipPath>')
    # strata lines across the cut face
    s.a('<g clip-path="url(#mtnC)">')
    for k in range(9):
        y = 200 + k * 50
        pts = [(x, y + 10 * math.sin(x / 140 + k)) for x in range(-20, 1260, 60)]
        s.a(f'<polyline points="{P(pts)}" fill="none" stroke="#5a5668" stroke-width="2" opacity="0.5"/>')
    s.a('</g>')
    # the snow along the ridge
    ridge = [(300, 380), (420, 300), (560, 200), (680, 140), (780, 170), (900, 230), (1020, 290), (1120, 380)]
    snow = [(x, y + (4 + 22 * math.sin(math.pi * i / (len(ridge) - 1))) + 5 * math.sin(x / 30))
            for i, (x, y) in enumerate(ridge)][::-1]
    s.a(f'<path d="{smooth(ridge, closed=False)} L' + " L".join(f"{f(x)},{f(y)}" for x, y in snow) + 'Z" fill="url(#snowC)"/>')
    for (x, h) in ((80, 64), (140, 54), (230, 70), (1150, 66), (1190, 52)):
        y = 600 - (x < 600) * (x * 0.0) + 0
        base = {80: 548, 140: 512, 230: 452, 1150: 420, 1190: 446}[x]
        s.a(spruce(x, base, h))

    # ---------- the cave: a big chamber, the lower entrance, the passage up to the top opening
    chamber = [(170, 560), (240, 520), (330, 470), (430, 420), (560, 404), (700, 416), (800, 440), (860, 470),
               (880, 520), (840, 568), (700, 590), (520, 596), (330, 590), (200, 584)]
    s.a(f'<path d="{smooth(chamber)}" fill="url(#hollow)"/>')
    # the passage: a winding tube from the chamber's top right up to the opening at (1020, 290)
    passage = [(780, 436), (850, 400), (880, 352), (940, 320), (1000, 300), (1030, 292)]
    s.a(f'<path d="{smooth(passage, closed=False)}" fill="none" stroke="#1a1824" stroke-width="44" stroke-linecap="round"/>')
    # the lower entrance: an opening in the foot of the slope, a path going in, lamps along it
    s.a(f'<path d="M90,600 Q120,520 200,520 Q240,540 250,580 L250,600Z" fill="url(#hollow)"/>')
    s.a(f'<path d="M-10,612 Q120,600 230,590 Q420,590 600,592" fill="none" stroke="#6a6276" stroke-width="10" stroke-linecap="round" opacity="0.8"/>')
    for x in (60, 150, 260, 380, 500, 620):
        y = 600 if x < 230 else 590
        s.a(f'<rect x="{x - 2}" y="{y - 22}" width="4" height="22" fill="#2a2834"/>',
            glow(x, y - 24, 14, "#ffd27a", 0.6, "s4"), f'<circle cx="{x}" cy="{y - 24}" r="3.5" fill="#ffe6a8"/>')
    # stalactites and stalagmites, a pool
    for (x, l) in ((380, 50), (420, 34), (470, 62), (530, 40), (600, 70), (650, 44), (720, 52), (760, 30)):
        top = 412 + 0.0 * x
        top = min(470, max(406, 420 + (x - 560) ** 2 / 4000))
        s.a(f'<polygon points="{P([(x - 9, top - 4), (x + 9, top - 4), (x, top + l)])}" fill="#6a6478"/>',
            f'<polygon points="{P([(x - 9, top - 4), (x - 2, top - 4), (x, top + l)])}" fill="#8a849a" opacity="0.7"/>')
    for (x, h) in ((340, 46), (470, 34), (690, 56), (790, 38)):
        base = 590 if x < 760 else 560
        s.a(f'<polygon points="{P([(x - 13, base), (x + 13, base), (x + 3, base - h), (x - 3, base - h)])}" fill="#6a6478"/>')
    s.a(f'<ellipse cx="580" cy="586" rx="80" ry="9" fill="url(#pool)"/>')
    # the radon monitor on the wall: a little box with a green light
    s.a(f'<rect x="806" y="490" width="30" height="40" rx="4" fill="#c8ccd6" opacity="0.85"/>',
        f'<rect x="811" y="496" width="20" height="12" rx="2" fill="#123a52"/>',
        glow(821, 518, 8, "#5ee08f", 0.8, "s2"), f'<circle cx="821" cy="518" r="3" fill="#9affc0"/>')
    # the guide: a small figure with a helmet lamp, its beam on the stalactites
    gx, gy = 420, 590
    s.a(f'<polygon points="{P([(gx - 4, gy - 52), (gx - 40, gy - 110), (gx + 30, gy - 120)])}" fill="#ffe6a8" opacity="0.12"/>',
        f'<rect x="{gx - 9}" y="{gy - 44}" width="18" height="30" rx="6" fill="#d86a3a"/>',
        f'<rect x="{gx - 8}" y="{gy - 16}" width="6" height="16" fill="#2a2834"/><rect x="{gx + 2}" y="{gy - 16}" width="6" height="16" fill="#2a2834"/>',
        f'<circle cx="{gx}" cy="{gy - 52}" r="8" fill="#e8c4a0"/>',
        f'<path d="M{gx - 10},{gy - 54} Q{gx},{gy - 68} {gx + 10},{gy - 54}Z" fill="#f2c040"/>',
        glow(gx - 2, gy - 60, 7, "#fff2c0", 0.9, "s2"))

    # ---------- the breath: cold air in at the bottom, warm air up the passage and out of the top
    s.a(arrow([(20, 560), (110, 566), (220, 566), (330, 560)], COLD, w=8, op=0.85))
    s.a(arrow([(120, 520), (230, 540), (360, 548)], COLD, w=6, op=0.6))
    s.a(arrow([(560, 470), (700, 456), (800, 432), (870, 380), (950, 324), (1040, 286), (1090, 240)], WARM, w=8, op=0.85))
    # radon carried out with the warm air, steaming out into the frost
    for (x, y, r, o) in ((620, 470, 8, 0.95), (720, 450, 8, 0.95), (860, 392, 7.5, 0.9), (960, 318, 7, 0.85),
                         (1060, 262, 6.5, 0.75), (1100, 214, 6, 0.55), (1130, 176, 5.5, 0.4), (520, 500, 8, 0.95)):
        s.a(radon(x, y, r, o))
    for k in range(7):
        x = 1040 + k * 14 + rnd.uniform(-8, 8)
        y = 280 - k * 30
        s.a(f'<ellipse cx="{f(x)}" cy="{f(y)}" rx="{f(22 + k * 6)}" ry="{f(14 + k * 4)}" fill="#c8d6ea" '
            f'opacity="{0.22 - k * 0.025:.2f}" filter="url(#s8)"/>')
    # snow falling outside
    for _ in range(26):
        x, y = rnd.uniform(0, 1200), rnd.uniform(0, 330)
        if 300 < x < 1100 and y > 200:
            continue
        s.a(snowflake(x, y, rnd.uniform(3, 6), "#dfeaff", rnd.uniform(0.5, 0.85)))

    finish(s)
    s.save("cave")


if __name__ == "__main__":
    build()
