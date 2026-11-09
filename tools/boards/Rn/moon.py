"""Board 'moon': radon on the Moon. The grey plains under a black sky, the Earth hanging above; in the middle
distance the bright crater Aristarchus with its central peak; a crack in the ground in front, out of which
radon atoms hop in long arcs (no air to carry them), each landing leaving a little amber dot behind (what
radon turns into stays put for years). Above, the Apollo 15 spaceship in orbit with its instrument bay
open, the cone of its alpha-particle counter aimed at the crater."""
import math
import os
import random
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from rnkit import *  # noqa: E402,F401,F403

COLOR = "#b39dff"
HORIZON = 372


def csm(s, x, y, k=1.0, ang=-10):
    """The Apollo command and service module: a silver cone, a cylinder with its instrument bay open, the
    engine bell."""
    s.d(lin("csmS", [(0, "#d6dae4"), (0.5, "#9aa0ae"), (1, "#5a5f6c")], x1=0, y1=0, x2=0, y2=1),
        lin("csmC", [(0, "#e2e6ee"), (0.6, "#a8aebb"), (1, "#6a707e")], x1=0, y1=0, x2=0, y2=1))
    L, R = 150 * k, 34 * k
    out = [f'<g transform="translate({f(x)},{f(y)}) rotate({ang})">']
    # the service module
    out.append(f'<rect x="{f(-L / 2)}" y="{f(-R)}" width="{f(L)}" height="{f(2 * R)}" fill="url(#csmS)"/>')
    for i in range(1, 6):
        out.append(f'<line x1="{f(-L / 2 + i * L / 6)}" y1="{f(-R)}" x2="{f(-L / 2 + i * L / 6)}" y2="{f(R)}" stroke="#5a5f6c" stroke-width="1.2" opacity="0.6"/>')
    # the instrument bay, open: dark, gold instruments in it
    out.append(f'<rect x="{f(-L * 0.22)}" y="{f(-R * 0.15)}" width="{f(L * 0.4)}" height="{f(R * 1.1)}" fill="#141824"/>')
    out.append(f'<rect x="{f(-L * 0.18)}" y="{f(R * 0.25)}" width="{f(L * 0.13)}" height="{f(R * 0.6)}" fill="#d8a83a"/>'
               f'<rect x="{f(-L * 0.02)}" y="{f(R * 0.4)}" width="{f(L * 0.12)}" height="{f(R * 0.45)}" fill="#c8963a"/>')
    # the engine bell at the back, the cone at the front
    out.append(f'<path d="M{f(-L / 2)},{f(-R * 0.4)} L{f(-L / 2 - 42 * k)},{f(-R * 0.9)} L{f(-L / 2 - 42 * k)},{f(R * 0.9)} L{f(-L / 2)},{f(R * 0.4)}Z" fill="#4a4f5c"/>')
    out.append(f'<path d="M{f(L / 2)},{f(-R)} L{f(L / 2 + 64 * k)},{f(-R * 0.18)} L{f(L / 2 + 64 * k)},{f(R * 0.18)} L{f(L / 2)},{f(R)}Z" fill="url(#csmC)"/>')
    out.append(f'<rect x="{f(L / 2 - 4)}" y="{f(-R)}" width="8" height="{f(2 * R)}" fill="#c8ccd6"/>')
    out.append("</g>")
    s.a("".join(out))


def build():
    s = Svg("Rn", COLOR)
    setup(s)
    background(s, glows=[(640, 380, 360, 0.45)], seed=1971, stars=110, star_box=(0, 0, 1200, HORIZON), bokeh=3, tint=0.75)
    rnd = random.Random(15)
    s.d(lin("plain", [(0, "#6a6678"), (0.25, "#4a4758"), (1, "#22202c")], x1=0, y1=0, x2=0, y2=1),
        rad("earthO", [(0, "#6fb2ff"), (0.6, "#2d6cc8"), (1, "#123a7a")], cx=0.65, cy=0.4, r=0.7),
        rad("ari", [(0, "#5a5668"), (0.75, "#7a768c"), (0.92, "#b4b0c8"), (1, "#8a869c")]))

    # ---------- the Earth, lit from the right, half in shadow
    ex, ey, er = 170, 140, 56
    s.a(glow(ex, ey, er * 1.5, "#6fb2ff", 0.25, "s16"),
        f'<circle cx="{ex}" cy="{ey}" r="{er}" fill="url(#earthO)"/>')
    s.d(f'<clipPath id="earthC"><circle cx="{ex}" cy="{ey}" r="{er}"/></clipPath>')
    s.a('<g clip-path="url(#earthC)">',
        f'<path d="M{ex - 40},{ey - 20} q20,-14 44,-6 q14,8 34,0" fill="none" stroke="#e6eefc" stroke-width="7" stroke-linecap="round" opacity="0.8"/>',
        f'<path d="M{ex - 20},{ey + 22} q24,-8 50,4" fill="none" stroke="#e6eefc" stroke-width="6" stroke-linecap="round" opacity="0.7"/>',
        f'<path d="M{ex + 4},{ey - 4} q-8,14 6,26 q14,-6 8,-22Z" fill="#5a9a4a" opacity="0.9"/>',
        f'<circle cx="{ex - 34}" cy="{ey + 6}" r="{er}" fill="#05070f" opacity="0.72"/>',
        '</g>')

    # ---------- the plain to the horizon
    s.a(f'<path d="M-20,{HORIZON + 12} Q600,{HORIZON - 24} 1220,{HORIZON + 12} L1220,800 L-20,800Z" fill="url(#plain)"/>')
    # small craters scattered on the plain, smaller toward the horizon
    for _ in range(26):
        y = rnd.uniform(HORIZON + 10, 600)
        k = (y - HORIZON) / (600 - HORIZON)
        x = rnd.uniform(0, 1200)
        r = 6 + k * rnd.uniform(10, 34)
        s.a(f'<ellipse cx="{f(x)}" cy="{f(y)}" rx="{f(r)}" ry="{f(r * 0.28)}" fill="#2a2834" opacity="0.6"/>',
            f'<path d="M{f(x - r)},{f(y)} A{f(r)},{f(r * 0.28)} 0 0 0 {f(x + r)},{f(y)}" fill="none" stroke="#8a869a" stroke-width="2" opacity="0.6"/>')

    # ---------- Aristarchus: a bright rim, a darker floor, its central peak, bright rays
    ax, ay, arx, ary = 650, 430, 190, 50
    for k in range(9):
        a = math.radians(-170 + k * 22 + rnd.uniform(-6, 6))
        l = rnd.uniform(1.25, 1.9)
        s.a(f'<path d="M{f(ax + math.cos(a) * arx)},{f(ay + math.sin(a) * ary)} L{f(ax + math.cos(a) * arx * l)},{f(ay + math.sin(a) * ary * l)}" '
            f'stroke="#a6a2ba" stroke-width="{f(rnd.uniform(6, 14))}" stroke-linecap="round" opacity="0.18" filter="url(#s4)"/>')
    # the ejecta round it, the raised rim, the far inner wall lit, the near inner wall in shadow, the floor
    s.a(f'<ellipse cx="{ax}" cy="{ay + 4}" rx="{arx + 46}" ry="{ary + 16}" fill="#8a869e" opacity="0.35" filter="url(#s8)"/>',
        f'<ellipse cx="{ax}" cy="{ay}" rx="{arx + 12}" ry="{ary + 7}" fill="#a29eb6"/>',
        f'<ellipse cx="{ax}" cy="{ay}" rx="{arx}" ry="{ary}" fill="#3e3b4c"/>')
    s.d(f'<clipPath id="ariIn"><ellipse cx="{ax}" cy="{ay}" rx="{arx}" ry="{ary}"/></clipPath>')
    s.a('<g clip-path="url(#ariIn)">',
        f'<ellipse cx="{ax}" cy="{ay + ary * 0.55}" rx="{arx * 0.98}" ry="{ary * 1.05}" fill="#b4b0c8"/>',
        f'<ellipse cx="{ax}" cy="{ay + ary * 0.75}" rx="{arx * 0.8}" ry="{ary * 0.75}" fill="#6a6680"/>',
        f'<path d="M{ax - 34},{ay + 22} L{ax - 6},{ay - 2} L{ax + 8},{ay + 4} L{ax + 30},{ay + 22}Z" fill="#a8a4bc"/>',
        f'<path d="M{ax - 6},{ay - 2} L{ax + 8},{ay + 4} L{ax + 30},{ay + 22} L{ax + 2},{ay + 22}Z" fill="#4a4758"/>',
        '</g>')
    # a faint glow of radon over the crater's floor
    s.a(glow(ax + 30, ay - 10, 90, RN_GLOW, 0.25, "s16"))
    for (x, y, r) in ((ax - 60, ay - 14, 5), (ax + 50, ay - 26, 5), (ax + 110, ay - 8, 4.5), (ax + 10, ay - 40, 4.5)):
        s.a(radon(x, y, r, 0.85))

    # ---------- the crack in front, and radon hopping out of it in long arcs
    crack = [(120, 620), (260, 580), (380, 560), (470, 520), (560, 488)]
    s.a(f'<path d="{smooth(crack, closed=False)}" fill="none" stroke="#14121a" stroke-width="9" stroke-linecap="round"/>',
        f'<path d="{smooth(crack, closed=False)}" fill="none" stroke="#8a869a" stroke-width="2" stroke-linecap="round" opacity="0.5" transform="translate(0,5)"/>')
    hops = [((250, 584), (420, 596), 150), ((372, 562), (560, 590), 180), ((470, 522), (610, 548), 120),
            ((300, 576), (180, 600), 110), ((520, 500), (760, 560), 210), ((420, 596), (520, 610), 70)]
    for (p0, p1, h) in hops:
        mx = (p0[0] + p1[0]) / 2
        top = min(p0[1], p1[1]) - h
        d = f"M{f(p0[0])},{f(p0[1])} Q{f(mx)},{f(top - h * 0.6)} {f(p1[0])},{f(p1[1])}"
        s.a(f'<path d="{d}" fill="none" stroke="{RN_GLOW}" stroke-width="3" stroke-dasharray="2 9" stroke-linecap="round" opacity="0.75"/>')
        # the footprint it leaves: a small amber dot on the ground
        s.a(f'<ellipse cx="{f(p1[0])}" cy="{f(p1[1])}" rx="9" ry="3.5" fill="#ffb347" opacity="0.85"/>',
            glow(p1[0], p1[1], 12, "#ffb347", 0.4, "s4"))
        # the atom, high on its arc
        t = 0.45
        bx = (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * mx + t * t * p1[0]
        by = (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * (top - h * 0.6) + t * t * p1[1]
        s.a(radon(bx, by, 10))

    # ---------- Apollo 15 overhead, its counter looking down at the crater
    sx, sy = 930, 140
    s.a(f'<polygon points="{P([(sx - 10, sy + 20), (ax - 60, ay - 30), (ax + 140, ay - 20)])}" fill="{COLOR}" opacity="0.08"/>',
        f'<path d="M{sx - 10},{sy + 20} L{ax - 60},{ay - 30} M{sx - 10},{sy + 20} L{ax + 140},{ay - 20}" stroke="{COLOR}" stroke-width="2.5" '
        f'stroke-dasharray="8 8" opacity="0.6"/>')
    csm(s, sx, sy, 1.0, -8)
    s.a(arrow([(sx - 150, sy + 60), (sx - 260, sy + 90), (sx - 360, sy + 104)], "#d6dae4", w=3, op=0.35, dash="6 8"))

    finish(s)
    s.save("moon")


if __name__ == "__main__":
    build()
