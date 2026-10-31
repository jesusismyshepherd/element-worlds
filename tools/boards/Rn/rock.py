"""Board 'rock': how a granite rock breathes out radon. A big granite boulder on a hillside at dusk, cut open
to show its grains (pink feldspar, grey quartz, black mica), radon rising from its crack. Above it the
uranium family as a staircase of atoms, uranium-238 at the top, lead-206 at the bottom (an alpha decay a
big step down, a beta decay a small one); radon's step is empty, its atom floating away: the one gas of the
family. A close-up of two grains: a radium atom near the edge of one breaks apart, the alpha particle flies
into the grain, and the new radon atom recoils into the pore between the grains, where a film of water
catches it, and other radon atoms drift away up the gap."""
import math
import os
import random
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from rnkit import *  # noqa: E402,F401,F403

COLOR = "#ff6f91"
GROUND = 560


def staircase(s, x0, y0):
    """The U-238 series as steps: an alpha decay drops 18, a beta decay 6. Returns radon's spot."""
    out = []
    x, y = x0, y0
    step = 33
    rn_at = None
    for i, (el, mode) in enumerate(SERIES):
        out.append(f'<rect x="{f(x - 15)}" y="{f(y + 11)}" width="{f(step + 4)}" height="6" rx="3" fill="{mix(COLOR, NAVY, 0.35)}" opacity="0.9"/>')
        if el == "Rn":
            rn_at = (x, y)
            out.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="11" fill="none" stroke="{RN_GLOW}" stroke-width="2" '
                       f'stroke-dasharray="4 4" opacity="0.8"/>')
        else:
            r = 15 if i in (0, len(SERIES) - 1) else 11
            out.append(atom(x, y - (r - 11), r, el))
        if mode:
            dy = 18 if mode == "a" else 6
            # the riser down to the next step
            out.append(f'<rect x="{f(x + step - 16)}" y="{f(y + 11)}" width="5" height="{f(dy + 6)}" rx="2" '
                       f'fill="{mix(COLOR, NAVY, 0.35)}" opacity="0.9"/>')
            if mode == "a":
                out.append(alpha(x + step * 0.55, y - 16, 3.2, 0.85))
            else:
                out.append(f'<circle cx="{f(x + step * 0.55)}" cy="{f(y - 12)}" r="3" fill="#8fd0ff"/>')
            x += step
            y += dy
    s.a("".join(out))
    return rn_at


def build():
    s = Svg("Rn", COLOR)
    setup(s)
    background(s, glows=[(320, 200, 320, 0.6), (900, 330, 360, 0.6)], seed=222, stars=36,
               star_box=(0, 0, 1200, 260), bokeh=5)
    rnd = random.Random(238)
    s.d(lin("hillR", [(0, "#3a2e5a"), (1, "#1e1a3c")], x1=0, y1=0, x2=0, y2=1),
        lin("grassR", [(0, "#3a5536"), (1, "#1e2c1c")], x1=0, y1=0, x2=0, y2=1),
        lin("rockSide", [(0, "#7a6e78"), (1, "#3a3440")], x1=0, y1=0, x2=1, y2=1))

    # ---------- the hills at dusk, tors on the skyline
    s.a(f'<path d="{smooth([(-40, 420), (160, 380), (380, 400), (600, 360), (820, 392), (1000, 370), (1240, 400), (1240, 640), (-40, 640)])}" fill="url(#hillR)"/>')
    for (x, y, r) in ((600, 352, 22), (630, 358, 14), (1000, 362, 18)):
        s.a(f'<path d="M{x - r * 1.3},{y + 8} Q{x - r * 1.3},{y - r} {x},{y - r} Q{x + r * 1.3},{y - r} {x + r * 1.3},{y + 8}Z" fill="#4a3f6a"/>')
    s.a(f'<rect x="0" y="{GROUND}" width="1200" height="{800 - GROUND}" fill="url(#grassR)"/>',
        f'<path d="{smooth([(-20, GROUND + 6), (300, GROUND - 6), (700, GROUND + 4), (1220, GROUND - 4)], closed=False)} L1220,800 L-20,800Z" fill="url(#grassR)"/>')

    # ---------- the boulder: its rounded back, and the flat face where it was cut open
    back = [(90, 560), (70, 470), (110, 390), (210, 336), (360, 318), (500, 336), (590, 396), (620, 480), (604, 562)]
    s.a(f'<ellipse cx="350" cy="568" rx="300" ry="22" fill="#000" opacity="0.35" filter="url(#s8)"/>',
        f'<path d="{smooth(back)}" fill="url(#rockSide)"/>')
    face = [(120, 552), (106, 470), (140, 400), (230, 356), (360, 342), (480, 360), (560, 416), (582, 484), (566, 552)]
    s.a(granite(s, "grF", smooth(face), (90, 330, 600, 570), seed=5, scale=1.15, mica=0.6, dim=0.42))
    s.a(f'<path d="{smooth(face)}" fill="none" stroke="#c7a2b0" stroke-width="3" opacity="0.5"/>')
    # a light from the top left over the face, shade at the bottom
    s.d(lin("faceSh", [(0, "#ffffff", 0.14), (0.5, "#ffffff", 0), (1, "#000000", 0.35)], x1=0, y1=0, x2=0.4, y2=1))
    s.a(f'<path d="{smooth(face)}" fill="url(#faceSh)"/>')
    # the crack, and radon rising out of it
    crack = [(330, 344), (322, 380), (338, 420), (326, 470), (344, 520)]
    s.a(f'<path d="{smooth(crack, closed=False)}" fill="none" stroke="#1a1420" stroke-width="5" stroke-linecap="round"/>')
    for k, (x, y) in enumerate(((330, 330), (318, 296), (340, 262), (322, 226))):
        s.a(radon(x + rnd.uniform(-6, 6), y, 8 - k * 0.6, 0.95 - k * 0.12))
    s.a(wisp([(330, 344), (316, 300), (342, 254), (318, 200)], w=10, op=0.32))

    # ---------- the family staircase above
    rx, ry = staircase(s, 70, 70)
    # radon has left its step: it floats up and away, a gas
    fx, fy = rx + 40, ry - 46
    s.a(wisp([(rx, ry), (rx + 14, ry - 24), (fx, fy)], w=8, op=0.45),
        radon(fx, fy, 13))

    # ---------- the close-up: two grains, a pore between them
    mx, my, mr = 905, 320, 215
    opening, closing = magnifier(s, "zoomGrain", mx, my, mr, COLOR, src=(470, 470, 30), inner="#120f26")
    s.a(opening)
    # the pore: dark, its water film blue
    s.a(f'<rect x="{mx - mr}" y="{my - mr}" width="{2 * mr}" height="{2 * mr}" fill="#14112a"/>')
    lower = [(mx - mr - 20, my + 30), (mx - 120, my + 4), (mx - 30, my + 20), (mx + 60, my + 62), (mx + 150, my + 70),
             (mx + mr + 20, my + 96), (mx + mr + 20, my + mr + 20), (mx - mr - 20, my + mr + 20)]
    upper = [(mx - mr - 20, my - 70), (mx - 100, my - 92), (mx + 10, my - 64), (mx + 110, my - 40), (mx + mr + 20, my - 10),
             (mx + mr + 20, my - mr - 20), (mx - mr - 20, my - mr - 20)]
    film = [(mx - mr - 20, my + 30), (mx - 120, my + 4), (mx - 30, my + 20), (mx + 60, my + 62), (mx + 150, my + 70), (mx + mr + 20, my + 96)]
    film_up = [(x, y - 16) for (x, y) in film][::-1]
    s.a(f'<path d="M{f(film[0][0])},{f(film[0][1])} ' + " ".join(f"L{f(x)},{f(y)}" for x, y in film[1:])
        + " " + " ".join(f"L{f(x)},{f(y)}" for x, y in film_up) + 'Z" fill="#3a7ad8" opacity="0.55"/>')
    # the pink feldspar grain below, its atoms in rows
    s.d(lin("feldG", [(0, "#b47888"), (1, "#6a3c4c")], x1=0, y1=0, x2=0, y2=1),
        lin("quartzG", [(0, "#7c8294"), (1, "#a4aaba")], x1=0, y1=0, x2=0, y2=1))
    s.a(f'<path d="M{f(lower[0][0])},{f(lower[0][1])} ' + " ".join(f"L{f(x)},{f(y)}" for x, y in lower[1:]) + 'Z" fill="url(#feldG)"/>')
    s.a(f'<path d="M{f(upper[0][0])},{f(upper[0][1])} ' + " ".join(f"L{f(x)},{f(y)}" for x, y in upper[1:]) + 'Z" fill="url(#quartzG)"/>')
    s.d(f'<clipPath id="lowC"><path d="M{f(lower[0][0])},{f(lower[0][1])} ' + " ".join(f"L{f(x)},{f(y)}" for x, y in lower[1:]) + 'Z"/></clipPath>',
        f'<clipPath id="upC"><path d="M{f(upper[0][0])},{f(upper[0][1])} ' + " ".join(f"L{f(x)},{f(y)}" for x, y in upper[1:]) + 'Z"/></clipPath>')
    dots = []
    for j in range(-12, 14):
        for i in range(-14, 14):
            x = mx + i * 30 + (j % 2) * 15
            y = my + j * 26
            dots.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="5" fill="#e0b0bc" opacity="0.35"/>')
    s.a('<g clip-path="url(#lowC)">' + "".join(dots) + "</g>")
    s.a('<g clip-path="url(#upC)">' + "".join(d.replace("#e0b0bc", "#c8cede") for d in dots) + "</g>")
    # the decay: a radium atom just under the lower grain's surface has broken apart
    dx, dy = mx - 40, my + 64
    s.a(star_burst(dx, dy, 34, 12, 8, "#ffe0a0", 0.85), glow(dx, dy, 30, "#ffd08a", 0.6, "s8"))
    # the alpha particle shoots down into the grain, a long track
    ax, ay = mx - 118, my + 142
    s.a(f'<line x1="{f(dx)}" y1="{f(dy)}" x2="{f(ax)}" y2="{f(ay)}" stroke="#ffd0a0" stroke-width="5" stroke-dasharray="3 9" '
        f'stroke-linecap="round" opacity="0.85"/>', alpha(ax, ay, 9))
    # the radon atom recoils the other way, out of the grain and into the water film
    rx2, ry2 = mx + 6, my + 22
    s.a(f'<line x1="{f(dx)}" y1="{f(dy)}" x2="{f(rx2)}" y2="{f(ry2)}" stroke="{RN_GLOW}" stroke-width="6" stroke-linecap="round" opacity="0.6"/>',
        radon(rx2, ry2, 22))
    # radon atoms drifting off up the gap between the grains
    for (x, y, r, o) in ((mx + 100, my + 30, 15, 0.9), (mx + 170, my + 34, 13, 0.75), (mx - 120, my - 20, 13, 0.8)):
        s.a(radon(x, y, r, o))
    s.a(arrow([(mx + 120, my + 24), (mx + 175, my + 20), (mx + 225, my + 30)], RN_GLOW, w=4, op=0.55))
    s.a(closing)

    finish(s)
    s.save("rock")


if __name__ == "__main__":
    build()
