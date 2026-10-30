"""Board 'silicone': a kitchen counter. A bright pink silicone muffin tray, held up by its ends and bending
in the middle like rubber, golden muffins in its cups; beside it a ball of bouncing putty, caught three
times on its way down and back up, squashed where it hits the counter. A close-up of silicone: a long
chain of silicon and oxygen, silicon and oxygen, with little methyl groups (carbon and hydrogen) sticking
out on both sides; the chain wiggles, so silicone bends."""
import math
import os
import random
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from lib.style import *  # noqa: E402,F401

PINK = "#ff6fa8"
COUNTER = 548


def tray(s, x0, x1, y0, sag):
    """The muffin tray, seen from the side, bending: its rim follows a curve that sags in the middle, its
    three cups hang under the rim, each turned with the curve, a muffin rising out of each."""
    s.d(lin("tray", [(0, "#ff5a8e"), (0.5, "#e8336e"), (1, "#a81a4a")], x1=0, y1=0, x2=0, y2=1),
        rad("muffin", [(0, "#f0b860"), (0.6, "#c8803a"), (1, "#8a4a1e")], cx=0.4, cy=0.3, r=0.75))

    def at(u):
        x = x0 + (x1 - x0) * u
        y = y0 + sag * math.sin(math.pi * u)
        dy = sag * math.pi * math.cos(math.pi * u) / (x1 - x0)
        return x, y, math.degrees(math.atan(dy))

    out = []
    # the shadow on the counter
    out.append(f'<ellipse cx="{f((x0 + x1) / 2)}" cy="{COUNTER + 6}" rx="{f((x1 - x0) * 0.5)}" ry="14" fill="#000" opacity="0.3" filter="url(#s8)"/>')
    # the cups and their muffins
    for u in (0.17, 0.5, 0.83):
        x, y, a = at(u)
        cup = "M-64,0 L64,0 L50,92 Q48,104 36,104 L-36,104 Q-48,104 -50,92Z"
        ribs = "".join(f'<line x1="{f(-56 + k * 16)}" y1="6" x2="{f(-44 + k * 12.6)}" y2="100" stroke="#a81a4a" stroke-width="3" opacity="0.55"/>'
                       for k in range(8))
        top = "M-60,4 C-64,-40 -30,-64 0,-64 C30,-64 64,-40 60,4Z"
        out.append(f'<g transform="translate({f(x)} {f(y)}) rotate({f(a)})">'
                   f'<path d="{cup}" fill="url(#tray)" stroke="#8a1240" stroke-width="3"/>{ribs}'
                   f'<path d="{top}" fill="url(#muffin)"/>'
                   f'<ellipse cx="-18" cy="-40" rx="18" ry="8" fill="#ffd890" opacity="0.6"/>'
                   + "".join(f'<circle cx="{f(cx)}" cy="{f(cy)}" r="4" fill="#5a2a12"/>' for cx, cy in ((-24, -18), (14, -30), (30, -8), (-4, -6)))
                   + "</g>")
    # the rim: a thick band along the curve
    top_pts, bot_pts = [], []
    for i in range(41):
        x, y, a = at(i / 40)
        n = (-math.sin(math.radians(a)), math.cos(math.radians(a)))
        top_pts.append((x - n[0] * 10, y - n[1] * 10))
        bot_pts.append((x + n[0] * 12, y + n[1] * 12))
    band = smooth(top_pts, closed=False) + " L" + " L".join(f"{f(x)},{f(y)}" for x, y in reversed(bot_pts)) + "Z"
    out.append(f'<path d="{band}" fill="#ff5a8e" stroke="#8a1240" stroke-width="3" stroke-linejoin="round"/>')
    out.append(f'<path d="{smooth(top_pts, closed=False)}" fill="none" stroke="#ffb0cc" stroke-width="4" opacity="0.7"/>')
    # its two ends, bent up, and curved arrows showing the bend
    for u, side in ((0, -1), (1, 1)):
        x, y, a = at(u)
        out.append(arrow([(x + side * 30, y + 60), (x + side * 46, y + 10), (x + side * 30, y - 40)], "#ffd0e0", w=6, head=20, op=0.85))
    s.a("".join(out))


def putty(s, rnd):
    """The bouncing putty: a blue ball falling, squashed on the counter, flying up again; dashed arcs."""
    s.d(rad("putty", [(0, "#a8e0ff"), (0.35, "#3aa8f0"), (1, "#1a5aa8")], cx=0.38, cy=0.32, r=0.75))
    path = f"M930,110 Q975,170 1005,{COUNTER - 40} Q1060,250 1120,232 Q1160,228 1180,300"
    s.a(f'<path d="{path}" fill="none" stroke="#bfe6ff" stroke-width="4" stroke-dasharray="4 14" stroke-linecap="round" opacity="0.8"/>')
    for (x, y, r, op) in ((930, 112, 32, 0.5), (1120, 232, 36, 0.8)):
        s.a(f'<g opacity="{op}"><circle cx="{x}" cy="{y}" r="{r}" fill="url(#putty)"/>'
            f'<ellipse cx="{x - r * 0.35}" cy="{y - r * 0.4}" rx="{r * 0.3}" ry="{r * 0.18}" fill="#ffffff" opacity="0.6"/></g>')
    # squashed where it hits the counter, with little lines of the bounce
    bx, by = 1005, COUNTER - 22
    s.a(f'<ellipse cx="{bx}" cy="{COUNTER + 2}" rx="54" ry="8" fill="#000" opacity="0.35"/>',
        f'<ellipse cx="{bx}" cy="{by}" rx="50" ry="24" fill="url(#putty)"/>',
        f'<ellipse cx="{bx - 18}" cy="{by - 10}" rx="16" ry="6" fill="#ffffff" opacity="0.55"/>')
    for a in (-160, -130, -50, -20):
        t = math.radians(a)
        s.a(f'<line x1="{f(bx + math.cos(t) * 62)}" y1="{f(by + math.sin(t) * 36)}" x2="{f(bx + math.cos(t) * 84)}" '
            f'y2="{f(by + math.sin(t) * 50)}" stroke="#bfe6ff" stroke-width="5" stroke-linecap="round"/>')


def methyl(x, y, ang, r):
    """A methyl group: a dark carbon with three small white hydrogens, pointing out at `ang`."""
    out = []
    for d in (-55, 0, 55):
        t = math.radians(ang + d)
        out.append(ball(x + math.cos(t) * r * 1.15, y + math.sin(t) * r * 1.15, r * 0.55, "H"))
    return "".join(out) + ball(x, y, r, "C")


def build():
    s = Svg("Si", PINK)
    background(s, glows=[(380, 360, 380, 0.7), (1000, 300, 280, 0.5)], seed=1943, stars=20, star_box=(0, 0, 1200, 200), bokeh=5, tint=0.6)
    rnd = random.Random(1901)
    # the kitchen's tiled wall, faint
    for j in range(7):
        for i in range(13):
            s.a(f'<rect x="{i * 96 + (j % 2) * 48 - 48}" y="{j * 80}" width="92" height="76" rx="6" fill="#ffffff" opacity="0.025"/>')
    # the counter
    s.d(lin("counter", [(0, "#8a5a3a"), (0.1, "#6b4428"), (1, "#2e1c12")], x1=0, y1=0, x2=0, y2=1))
    s.a(f'<rect x="0" y="{COUNTER}" width="1200" height="{800 - COUNTER}" fill="url(#counter)"/>',
        f'<rect x="0" y="{COUNTER}" width="1200" height="5" fill="#c08a5a" opacity="0.7"/>')

    tray(s, 120, 600, 300, 120)
    putty(s, rnd)

    # ---------- a close-up of silicone: the chain of silicon and oxygen, methyl groups on each silicon
    cx, cy, r = 720, 170, 132
    opening, closing = magnifier(s, "zoomChain", cx, cy, r, PINK, src=(360, 478, 28))
    s.a(opening)
    chain = []
    for k in range(-5, 6):
        x = cx + k * 34
        y = cy + (16 if k % 2 else -16) + 22 * math.sin(k * 0.55)
        chain.append((x, y, "Si" if k % 2 == 0 else "O"))
    for a, b in zip(chain, chain[1:]):
        s.a(bond(a[0], a[1], b[0], b[1], 7, "#9a7a8a"))
    for (x, y, el) in chain:
        if el == "Si":
            s.a(bond(x, y, x, y - 42, 6, "#6a6a7a"), bond(x, y, x, y + 42, 6, "#6a6a7a"))
            s.a(methyl(x, y - 46, -90, 13), methyl(x, y + 46, 90, 13))
    for (x, y, el) in chain:
        s.a(ball(x, y, 17 if el == "Si" else 13, el))
    s.a(closing)
    finish(s)
    s.save("silicone")


if __name__ == "__main__":
    build()
