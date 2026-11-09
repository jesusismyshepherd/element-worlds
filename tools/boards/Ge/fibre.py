"""Board 'fibre': the ocean cut open. Above, a dusk sky and the sea's surface with a cable ship; below, the
water darkening to the deep sea floor, where a cable runs from one shore's slope to the other, a repeater bulging
on it halfway, pulses of light travelling along it. A few fish and a glowing jellyfish. A close-up of one glass
thread, lengthwise: a glowing core in pale cladding, germanium atoms dotted through the core, a ray of light
zigzagging along it, bouncing back at the edge every time, its pulses bright. Beside it, the cable cut through:
black skin, steel wires, a copper tube, and in the middle the glass threads."""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gekit import *  # noqa: E402,F401

COLOR = "#3ce0c8"
LIGHT = "#bfffe8"
SEA = 140


def ship(s, x, y):
    s.a(f'<path d="M{x - 90},{y - 6} L{x + 90},{y - 6} L{x + 70},{y + 16} L{x - 80},{y + 16}Z" fill="#2a2e40"/>',
        f'<rect x="{x - 40}" y="{y - 34}" width="60" height="28" fill="#c8ccd8" opacity="0.8"/>',
        f'<rect x="{x - 34}" y="{y - 28}" width="10" height="8" fill="#ffd27a"/>',
        f'<rect x="{x - 18}" y="{y - 28}" width="10" height="8" fill="#ffd27a"/>',
        f'<path d="M{x + 60},{y - 6} L{x + 82},{y - 52} L{x + 86},{y - 6}" fill="none" stroke="#c8ccd8" stroke-width="4"/>',
        f'<circle cx="{x + 82}" cy="{y - 52}" r="4" fill="#ff5a5a"/>')


def fish(x, y, k, col, flip=1):
    return (f'<g transform="translate({f(x)} {f(y)}) scale({f(k * flip)} {f(k)})">'
            f'<path d="M-20,0 Q0,-12 20,0 Q0,12 -20,0Z" fill="{col}"/><path d="M-18,0 L-32,-10 L-30,0 L-32,10Z" fill="{col}"/>'
            '<circle cx="12" cy="-2" r="2" fill="#0b0f24"/></g>')


def jelly(x, y, r):
    out = [glow(x, y, r * 1.6, COLOR, 0.35, "s16"),
           f'<path d="M{f(x - r)},{f(y)} Q{f(x - r)},{f(y - r * 1.1)} {f(x)},{f(y - r * 1.1)} Q{f(x + r)},{f(y - r * 1.1)} {f(x + r)},{f(y)}Z" '
           f'fill="#9ae8ff" opacity="0.55"/>']
    for k in range(5):
        tx = x - r * 0.7 + k * r * 0.35
        out.append(f'<path d="M{f(tx)},{f(y)} q{f(r * 0.2)},{f(r * 0.6)} 0,{f(r * 1.2)} t0,{f(r * 1.0)}" fill="none" stroke="#9ae8ff" '
                   f'stroke-width="2" opacity="0.5"/>')
    return "".join(out)


def build():
    s = Svg("Ge", COLOR)
    gdefs(s)
    background(s, glows=[(620, 300, 360, 0.45)], seed=1988, stars=30, star_box=(0, 0, 1200, 110), bokeh=0, tint=0.55)
    # dusk sky band and the sea
    s.d(lin("dusk", [(0, "#ff9a7a", 0), (1, "#ffb08a", 0.4)], x1=0, y1=0, x2=0, y2=1),
        lin("sea", [(0, "#1a6a7a"), (0.35, "#123c5a"), (1, "#0a1630")], x1=0, y1=0, x2=0, y2=1),
        lin("floor", [(0, "#3a3a50"), (1, "#14142a")], x1=0, y1=0, x2=0, y2=1))
    s.a(f'<rect x="0" y="40" width="1200" height="{SEA - 40}" fill="url(#dusk)"/>',
        f'<rect x="0" y="{SEA}" width="1200" height="{800 - SEA}" fill="url(#sea)"/>')
    wv = [(x, SEA + 4 * math.sin(x / 40)) for x in range(0, 1220, 20)]
    s.a(f'<polyline points="{P(wv)}" fill="none" stroke="#8ae8e0" stroke-width="3" opacity="0.6"/>')
    # sun shafts in the water
    for x in (200, 380, 900):
        s.a(f'<polygon points="{P([(x, SEA), (x + 50, SEA), (x + 140, 420), (x + 40, 420)])}" fill="#8ae8e0" opacity="0.05"/>')
    ship(s, 820, SEA)
    # the shores' slopes and the sea floor
    s.a('<path d="M-20,250 Q60,300 120,420 Q160,500 260,540 Q600,560 940,540 Q1060,500 1100,400 Q1150,300 1220,260 L1220,800 L-20,800Z" fill="url(#floor)"/>')
    rnd = rng(8)
    for _ in range(26):
        x = rnd.uniform(200, 1000)
        s.a(f'<ellipse cx="{f(x)}" cy="{f(548 + rnd.uniform(-4, 6))}" rx="{f(rnd.uniform(6, 16))}" ry="4" fill="#4a4a62" opacity="0.6"/>')
    # the cable along the floor, the repeater, the pulses
    cable = [(-20, 270), (70, 330), (140, 450), (240, 528), (420, 540), (620, 534), (820, 540), (980, 520), (1080, 420), (1140, 320), (1220, 280)]
    s.a(f'<path d="{smooth(cable, closed=False)}" fill="none" stroke="#0e1018" stroke-width="12" stroke-linecap="round"/>',
        f'<path d="{smooth(cable, closed=False)}" fill="none" stroke="{COLOR}" stroke-width="2.5" stroke-dasharray="2 34" '
        'stroke-linecap="round" opacity="0.9" filter="url(#g1)"/>')
    s.a('<g transform="rotate(-1 700 534)"><rect x="640" y="520" width="120" height="30" rx="15" fill="#3a4050" stroke="#6a7080" stroke-width="3"/>'
        '<rect x="660" y="520" width="6" height="30" fill="#6a7080"/><rect x="734" y="520" width="6" height="30" fill="#6a7080"/></g>',
        glow(700, 535, 40, COLOR, 0.3, "s8"))
    # life
    s.a(fish(160, 220, 1.1, "#4aa8b8"), fish(200, 250, 0.8, "#4aa8b8"), fish(1020, 230, 1.0, "#3a8aa0", -1),
        fish(1060, 260, 0.7, "#3a8aa0", -1), jelly(1000, 360, 28))

    # the close-up: one glass thread lengthwise
    o, c = magnifier(s, "fib", 600, 300, 175, COLOR, src=(400, 538, 30), inner="#0c1a30")
    s.a(o)
    top, bot = 222, 378
    core0, core1 = 270, 330
    s.d(lin("clad", [(0, "#2a6a7a"), (0.5, "#3a8a98"), (1, "#2a6a7a")], x1=0, y1=0, x2=0, y2=1),
        lin("core", [(0, "#4ac8c0"), (0.5, "#6ae8d8"), (1, "#4ac8c0")], x1=0, y1=0, x2=0, y2=1))
    s.a(f'<rect x="400" y="{top}" width="400" height="{bot - top}" fill="url(#clad)" opacity="0.75"/>',
        f'<rect x="400" y="{core0}" width="400" height="{core1 - core0}" fill="url(#core)" opacity="0.6"/>',
        f'<line x1="400" y1="{core0}" x2="800" y2="{core0}" stroke="#bff8f0" stroke-width="2" opacity="0.6"/>',
        f'<line x1="400" y1="{core1}" x2="800" y2="{core1}" stroke="#bff8f0" stroke-width="2" opacity="0.6"/>')
    # a pinch of germanium in the core
    rnd = rng(32)
    for _ in range(9):
        s.a(gball(rnd.uniform(430, 780), rnd.uniform(core0 + 11, core1 - 11), 9, "Ge"))
    # the ray bouncing along the core
    zig = []
    x = 410
    up = True
    while x < 800:
        zig.append((x, core0 + 4 if up else core1 - 4))
        x += 96
        up = not up
    s.a(f'<polyline points="{P(zig)}" fill="none" stroke="{LIGHT}" stroke-width="5" stroke-linejoin="round" filter="url(#g1)" opacity="0.9"/>')
    for (zx, zy) in zig[1:-1]:
        s.a(star_burst(zx, zy, 9, 3, 4, "#e8fff8", 0.8))
    for t in (0.18, 0.5, 0.82):
        i = int(t * (len(zig) - 1))
        (x0, y0), (x1, y1) = zig[i], zig[i + 1]
        s.a(glow((x0 + x1) / 2, (y0 + y1) / 2, 16, "#e8fff8", 0.9, "s4"))
    s.a(c)

    # the cable cut through, beside the close-up
    for (r, col) in ((56, "#16181e"), (48, "#3a3e48"), (40, "#5a606c"), (28, "#c87a3a"), (22, "#2a3a48"), (12, "#bff8f0")):
        s.a(f'<circle cx="230" cy="470" r="{r}" fill="{col}"/>')
    for k in range(16):
        a = k / 16 * math.tau
        s.a(f'<circle cx="{f(230 + 35 * math.cos(a))}" cy="{f(470 + 35 * math.sin(a))}" r="5" fill="#8a929e" stroke="#2a2e38" stroke-width="1"/>')
    for k in range(6):
        a = k / 6 * math.tau
        s.a(f'<circle cx="{f(230 + 8 * math.cos(a))}" cy="{f(470 + 8 * math.sin(a))}" r="3" fill="{COLOR}"/>')
    s.a(glow(230, 470, 16, COLOR, 0.5, "s4"))
    finish(s)
    s.save("fibre")


if __name__ == "__main__":
    build()
