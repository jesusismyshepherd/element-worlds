"""Board 'heat': a forest at night under a thin moon. On the left a fox sits among dark ferns, almost
invisible. On the right a thermal camera points at it, its germanium lens a dark grey mirror in a black
mount. Wavy orange-red infrared rays go from the fox into the lens; the moon's pale light bounces off the
lens. Above, a round window shows what the camera sees: the same fox glowing in heat colours (purple and red
where it is cool, orange and yellow where it is warm, its eyes and face the warmest)."""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gekit import *  # noqa: E402,F401

COLOR = "#ff6a3c"
IR = "#ff5a2a"


def fox(cx, cy, k, body, head, tail, ear, snout, eye, legs=None, op=None):
    """A fox sitting, facing right, `k` its size (about 100 px tall at k = 1)."""
    legs = legs or body
    o = f' opacity="{op}"' if op is not None else ""
    out = [f"<g{o}>"]
    # the tail curled round the front
    t = [(cx - 40 * k, cy + 30 * k), (cx - 80 * k, cy + 18 * k), (cx - 92 * k, cy + 44 * k), (cx - 60 * k, cy + 62 * k),
         (cx + 20 * k, cy + 64 * k), (cx + 40 * k, cy + 52 * k), (cx - 10 * k, cy + 48 * k), (cx - 50 * k, cy + 44 * k)]
    out.append(f'<path d="{smooth(t)}" fill="{tail}"/>')
    # the body: a pear, the chest up front
    b = [(cx - 44 * k, cy + 50 * k), (cx - 50 * k, cy), (cx - 26 * k, cy - 46 * k), (cx + 10 * k, cy - 58 * k),
         (cx + 34 * k, cy - 30 * k), (cx + 36 * k, cy + 20 * k), (cx + 24 * k, cy + 54 * k)]
    out.append(f'<path d="{smooth(b)}" fill="{body}"/>')
    for dx in (14, 28):
        out.append(f'<rect x="{f(cx + dx * k - 5 * k)}" y="{f(cy + 10 * k)}" width="{f(10 * k)}" height="{f(48 * k)}" rx="{f(5 * k)}" fill="{legs}"/>')
    # the head with its ears and snout
    hx, hy = cx + 18 * k, cy - 74 * k
    for side in (-1, 1):
        ex = hx + side * 16 * k
        out.append(f'<polygon points="{P([(ex - 11 * k, hy - 12 * k), (ex + side * 4 * k, hy - 52 * k), (ex + 12 * k, hy - 10 * k)])}" fill="{ear}"/>')
    out.append(f'<circle cx="{f(hx)}" cy="{f(hy)}" r="{f(26 * k)}" fill="{head}"/>')
    out.append(f'<path d="M{f(hx + 14 * k)},{f(hy - 8 * k)} Q{f(hx + 30 * k)},{f(hy - 4 * k)} {f(hx + 44 * k)},{f(hy + 10 * k)} Q{f(hx + 30 * k)},{f(hy + 22 * k)} {f(hx + 8 * k)},{f(hy + 20 * k)}Z" fill="{snout}"/>')
    out.append(f'<circle cx="{f(hx + 10 * k)}" cy="{f(hy - 6 * k)}" r="{f(4.5 * k)}" fill="{eye}"/>')
    return "".join(out) + "</g>"


def fern(x, y, h, lean, col, op=1.0):
    out = [f'<path d="M{f(x)},{f(y)} Q{f(x + lean * 0.4)},{f(y - h * 0.6)} {f(x + lean)},{f(y - h)}" fill="none" stroke="{col}" '
           f'stroke-width="3" opacity="{op}"/>']
    for i in range(1, 9):
        t = i / 9
        px = x + lean * t * t
        py = y - h * t
        L = (1 - t) * h * 0.35 + 6
        for side in (-1, 1):
            out.append(f'<path d="M{f(px)},{f(py)} q{f(side * L * 0.6)},{f(-L * 0.1)} {f(side * L)},{f(L * 0.3)}" fill="none" '
                       f'stroke="{col}" stroke-width="4" stroke-linecap="round" opacity="{op}"/>')
    return "".join(out)


def tree(x, base, h, w, col):
    return (f'<rect x="{f(x - w * 0.07)}" y="{f(base - h * 0.3)}" width="{f(w * 0.14)}" height="{f(h * 0.3)}" fill="{col}"/>'
            + "".join(f'<polygon points="{P([(x, base - h + k * h * 0.2), (x - w * (0.3 + 0.12 * k), base - h * (0.55 - 0.13 * k)), (x + w * (0.3 + 0.12 * k), base - h * (0.55 - 0.13 * k))])}" fill="{col}"/>'
                      for k in range(4)))


def camera(s, lx, ly):
    """The camera body behind its lens, seen from the front-left; the lens faces the fox."""
    s.a(f'<rect x="{lx + 30}" y="{ly - 110}" width="230" height="200" rx="26" fill="#1c1f28" stroke="#3a3f4c" stroke-width="4"/>',
        f'<rect x="{lx + 90}" y="{ly - 150}" width="120" height="44" rx="12" fill="#22262f" stroke="#3a3f4c" stroke-width="4"/>',
        f'<rect x="{lx + 150}" y="{ly + 90}" width="56" height="96" rx="16" fill="#1a1d25" stroke="#3a3f4c" stroke-width="4"/>',
        f'<circle cx="{lx + 228}" cy="{ly - 80}" r="8" fill="#ff5a2a" opacity="0.9"/>')
    s.a(lens(lx, ly, 98, tilt=0.12))


def build():
    s = Svg("Ge", COLOR)
    gdefs(s)
    background(s, glows=[(620, 230, 300, 0.5)], seed=37, stars=70, star_box=(0, 0, 1200, 330), bokeh=3, tint=0.62)
    # the moon, top right
    s.a(glow(1110, 90, 60, "#ffe8c8", 0.35, "s16"), '<circle cx="1110" cy="90" r="26" fill="#e8dcc8"/>',
        '<circle cx="1122" cy="82" r="24" fill="#2a2440"/>')
    # the forest: far trees, then the ground
    for (x, h, w) in ((40, 300, 130), (150, 360, 150), (280, 280, 120), (420, 330, 130), (1150, 320, 130)):
        s.a(tree(x, 560, h, w, "#151a30"))
    s.d(lin("ground", [(0, "#1a2036"), (1, "#0e1222")], x1=0, y1=0, x2=0, y2=1))
    s.a('<path d="M0,520 Q300,500 600,530 T1200,520 L1200,800 L0,800Z" fill="url(#ground)"/>')
    # the fox, barely seen in the dark
    FX, FY, K = 330, 456, 1.3
    s.a(fox(FX, FY, K, "#2a2c44", "#2e3048", "#262840", "#2a2c44", "#30324a", "#8a90b0", op=0.95))
    for (x, h, lean) in ((180, 120, -30), (230, 90, 20), (470, 110, 26), (520, 80, -20), (130, 70, 10)):
        s.a(fern(x, 560, h, lean, "#1e2a3a"))

    # the camera on the right, its lens facing the fox
    LX, LY = 780, 420
    camera(s, LX, LY)
    # infrared from the fox into the lens; the moon's light bouncing off it
    for k, dy in enumerate((-40, 0, 40)):
        s.a(wave(FX + 80, FY - 70 + dy * 0.6, LX - 92, LY - 10 + dy, 7, 30, IR, w=5, op=0.85))
    s.a(f'<line x1="1090" y1="110" x2="{LX + 30}" y2="{LY - 60}" stroke="#ffe8b8" stroke-width="4" stroke-dasharray="2 10" '
        'stroke-linecap="round" opacity="0.8"/>',
        arrow([(LX + 30, LY - 60), (LX + 70, LY - 180), (LX + 90, LY - 300)], "#ffe8b8", w=4, op=0.7))

    # what the camera sees: the fox in heat colours
    s.d(rad("hotHead", [(0, "#ffe070"), (0.6, "#ffa830"), (1, "#ff6a2a")], cx=0.6, cy=0.45, r=0.6),
        rad("hotBody", [(0, "#ff9a30"), (0.7, "#e0402a"), (1, "#a02060")], cx=0.6, cy=0.4, r=0.7),
        lin("coolTail", [(0, "#6a1a8a"), (1, "#c02a5a")], x1=0, y1=0, x2=1, y2=0))
    o, c = magnifier(s, "cam", 560, 220, 150, COLOR, src=(LX, LY, 60), inner="#1a0a30")
    s.a(o)
    s.a('<rect x="400" y="60" width="320" height="320" fill="#24104a"/>',
        '<path d="M400,300 Q560,290 720,306 L720,380 L400,380Z" fill="#3a1660"/>')
    for (x, h, lean) in ((440, 70, -14), (680, 60, 14)):
        s.a(fern(x, 330, h, lean, "#5a1a7a"))
    s.a(fox(530, 250, 0.9, "url(#hotBody)", "url(#hotHead)", "url(#coolTail)", "#c83a4a", "#ffb040", "#fff0a0", legs="#c8402a"))
    s.a(c)
    finish(s)
    s.save("heat")


if __name__ == "__main__":
    build()
