"""Board 'snow': a November morning over Mount Greylock, its memorial tower on the summit. A long grey-blue cloud
lies across the sky; a little high-winged plane flies over it scattering dry ice, and under the part it has
seeded, curtains of snow hang from the cloud and fade before they reach the ground. On the right, Schaefer's
freezer with its lid open, ice crystals sparkling in a lamp's beam. A close-up: a crystal of silver iodide, its
silver and iodine atoms in a honeycomb, and on it water molecules lining up into a ring of ice."""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from agkit import *  # noqa: E402,F401

COLOR = "#5fd3ff"


def mountains(s):
    """Greylock: a broad rounded mountain with the memorial tower on top; a lower ridge in front."""
    s.d(lin("mtn", [(0, "#2a3a6a"), (1, "#141c3c")], x1=0, y1=0, x2=0, y2=1),
        lin("mtn2", [(0, "#1e2a52"), (1, "#0e142e")], x1=0, y1=0, x2=0, y2=1))
    s.a('<path d="M-20,624 Q120,520 300,470 Q360,456 420,468 Q620,520 820,560 Q1000,590 1220,580 L1220,800 L-20,800 Z" fill="url(#mtn)"/>')
    # a dusting of snow on the summit, kept grey-blue under the bloom
    s.a('<path d="M220,492 Q300,466 360,462 Q420,466 470,482 Q420,478 380,486 Q330,474 280,494 Z" fill="#8aa0c4" opacity="0.7"/>')
    # the memorial tower: a slim round tower with a lamp globe on top
    tx, ty = 362, 462
    s.a(f'<rect x="{tx - 9}" y="{ty - 70}" width="18" height="70" fill="#4a5a86"/>',
        f'<rect x="{tx - 13}" y="{ty - 74}" width="26" height="8" fill="#5a6a96"/>',
        f'<circle cx="{tx}" cy="{ty - 84}" r="9" fill="#ffe9a8"/>',
        glow(tx, ty - 84, 20, "#ffe9a8", 0.6, "s4"))
    s.a('<path d="M600,624 Q760,570 920,590 Q1060,600 1220,570 L1220,800 L600,800 Z" fill="url(#mtn2)"/>')
    # bare November trees along the ridges
    for (x, y, h) in ((150, 548, 26), (190, 532, 30), (500, 506, 24), (560, 518, 22), (700, 548, 26), (760, 556, 22)):
        s.a(f'<line x1="{x}" y1="{y}" x2="{x}" y2="{y - h}" stroke="#0e1430" stroke-width="3"/>')
        for k in (-1, 1):
            s.a(f'<line x1="{x}" y1="{y - h * 0.5}" x2="{x + k * 8}" y2="{y - h * 0.9}" stroke="#0e1430" stroke-width="2"/>')


def cloud(s, rnd):
    """The long cloud: a lumpy top, a flatter base; the seeded part glittering, snow hanging under it."""
    # a big pale cloud blooms on the wall: kept grey-blue, under the bloom
    s.d(lin("cloud", [(0, "#a6b8d6"), (0.6, "#8a9ec2"), (1, "#6a7ea6")], x1=0, y1=0, x2=0, y2=1),
        lin("virga", [(0, "#b8cae6", 0.6), (1, "#b8cae6", 0)], x1=0, y1=0, x2=0, y2=1))
    top = []
    for k in range(25):
        x = 120 + k * 36
        top.append((x, 250 - 26 * abs(math.sin(k * 1.3)) - 10 * math.sin(k * 0.5)))
    base = [(1000, 318), (820, 326), (600, 322), (380, 328), (130, 316)]
    s.a(f'<path d="{smooth(top + base)}" fill="url(#cloud)" opacity="0.95"/>')
    for (x, y, r) in ((240, 250, 40), (420, 240, 46), (640, 236, 50), (860, 246, 40)):
        s.a(f'<circle cx="{x}" cy="{y}" r="{r}" fill="#c0cfe6" opacity="0.3" filter="url(#s8)"/>')
    # the seeded stretch: sparkling ice crystals inside, soft curtains of snow below that fade into the air
    x0, x1 = 470, 780
    s.a(f'<path d="M{x0},318 L{x1},318 Q{x1 - 20},420 {x1 - 70},470 L{x0 - 60},470 Q{x0 - 30},400 {x0},318 Z" fill="url(#virga)" '
        'filter="url(#s16)"/>')
    for k in range(6):
        x = x0 + 20 + k * (x1 - x0 - 40) / 5 + rnd.uniform(-8, 8)
        L = rnd.uniform(110, 150)
        s.a(f'<path d="M{f(x)},322 Q{f(x - 10)},{f(322 + L * 0.5)} {f(x - 34)},{f(322 + L)}" fill="none" stroke="#c8d8f0" '
            f'stroke-width="16" stroke-linecap="round" opacity="0.25" filter="url(#s4)"/>')
    for _ in range(26):
        x, y = rnd.uniform(x0 - 30, x1), rnd.uniform(330, 470)
        s.a(snowflake(x, y, rnd.uniform(4, 8), "#e2ecff", rnd.uniform(0.35, 0.8), rot=rnd.uniform(0, 60)))
    for _ in range(14):
        x, y = rnd.uniform(x0, x1), rnd.uniform(240, 312)
        s.a(sparkle(x, y, rnd.uniform(4, 8), "#ffffff", rnd.uniform(0.6, 0.95)))


def plane(s, x, y):
    """A small high-winged monoplane flying right, dry ice falling from it into the cloud."""
    out = [f'<g transform="translate({x},{y}) rotate(-4)">']
    out.append('<path d="M-70,0 Q-60,-14 -20,-14 L50,-12 Q72,-10 76,0 Q70,10 50,10 L-20,10 Q-60,10 -70,0 Z" fill="#2c3a66"/>')
    out.append('<path d="M-70,0 L-96,-22 L-84,-22 L-56,-6 Z" fill="#2c3a66"/>')
    out.append('<path d="M-90,-2 L-60,-2 L-60,4 L-90,4 Z" fill="#24305a"/>')
    out.append('<rect x="-30" y="-26" width="96" height="9" rx="4" fill="#3a4a7e"/>')
    out.append('<line x1="0" y1="-18" x2="10" y2="6" stroke="#24305a" stroke-width="3"/>')
    out.append('<path d="M10,-11 L36,-11 L40,-2 L14,-2 Z" fill="#9fd0ff" opacity="0.8"/>')
    out.append('<ellipse cx="80" cy="0" rx="4" ry="22" fill="#c8d8ff" opacity="0.45"/>')
    out.append('<circle cx="78" cy="0" r="5" fill="#24305a"/>')
    out.append('<line x1="-4" y1="10" x2="-10" y2="22" stroke="#24305a" stroke-width="3"/>'
               '<circle cx="-10" cy="24" r="5" fill="#141c3c"/>')
    out.append("</g>")
    s.a("".join(out))
    # the dry ice: crushed pieces falling behind and below it
    rnd = rng(13)
    for k in range(34):
        t = rnd.uniform(0, 1)
        px = x - 20 - t * 170 + rnd.uniform(-12, 12)
        py = y + 14 + t * 90 + rnd.uniform(-6, 6)
        s.a(f'<rect x="{f(px)}" y="{f(py)}" width="{f(rnd.uniform(3, 6))}" height="{f(rnd.uniform(3, 6))}" fill="#e0e8f8" '
            f'opacity="{0.9 - t * 0.5:.2f}" transform="rotate({f(rnd.uniform(0, 90))} {f(px)} {f(py)})"/>')


def freezer(s, x, y):
    """Schaefer's freezer: an open chest, dark inside, a lamp's beam, ice crystals sparkling in it."""
    s.a(f'<ellipse cx="{x}" cy="{y + 100}" rx="140" ry="16" fill="#000" opacity="0.35" filter="url(#s8)"/>')
    # the lid standing open at the back
    s.a(f'<path d="M{x - 120},{y - 6} L{x - 100},{y - 96} L{x + 120},{y - 96} L{x + 120},{y - 6} Z" fill="#8a98b2"/>',
        f'<path d="M{x - 108},{y - 16} L{x - 92},{y - 86} L{x + 110},{y - 86} L{x + 110},{y - 16} Z" fill="#6c7a94"/>')
    # the chest: front and top rim, black velvet inside
    s.a(f'<rect x="{x - 130}" y="{y}" width="260" height="96" rx="8" fill="#9aa8c2"/>',
        f'<rect x="{x - 130}" y="{y}" width="260" height="12" rx="4" fill="#b0bcd2"/>',
        f'<path d="M{x - 118},{y + 4} L{x + 118},{y + 4} L{x + 108},{y - 30} L{x - 108},{y - 30} Z" fill="#0c1020"/>')
    s.a(f'<rect x="{x - 100}" y="{y + 30}" width="40" height="10" rx="4" fill="#6c7a94"/>')
    # the lamp's beam slanting in, and the sparkles in it
    s.a(f'<polygon points="{P([(x - 150, y - 150), (x - 120, y - 168), (x + 60, y - 4), (x - 10, y + 2)])}" fill="#fff6d8" opacity="0.18"/>')
    s.a(f'<rect x="{x - 176}" y="{y - 186}" width="44" height="30" rx="6" fill="#3a4a7e" transform="rotate(38 {x - 154} {y - 171})"/>')
    rnd = rng(1946)
    for _ in range(16):
        t = rnd.uniform(0.35, 1)
        px = x - 140 + t * 170 + rnd.uniform(-14, 14)
        py = y - 160 + t * 150 + rnd.uniform(-10, 10)
        s.a(sparkle(px, py, rnd.uniform(4, 8), "#ffffff", rnd.uniform(0.6, 1.0)))


def closeup(s):
    """Silver iodide magnified: a honeycomb of silver and iodine atoms, water molecules lining up on it as ice."""
    cx, cy, R = 990, 196, 138
    opening, closing = magnifier(s, "magIce", cx, cy, R, COLOR, src=(620, 290, 22), inner="#122038")
    body = []
    # the crystal: two rows of a honeycomb, silver and iodine taking turns
    for j in range(3):
        y = cy + 52 + j * 30
        for i in range(-5, 6):
            x = cx + i * 32 + (j % 2) * 16
            el = "Ag" if (i + j) % 2 == 0 else "I"
            body.append(aball(x, y, 15 if el == "I" else 12, el))
    # the ice ring on top: six water molecules at the corners of a hexagon
    hx, hy, hr = cx, cy - 18, 56
    corners = [(hx + math.cos(math.radians(60 * k + 30)) * hr, hy + math.sin(math.radians(60 * k + 30)) * hr * 0.62) for k in range(6)]
    for k in range(6):
        a, b = corners[k], corners[(k + 1) % 6]
        body.append(f'<line x1="{f(a[0])}" y1="{f(a[1])}" x2="{f(b[0])}" y2="{f(b[1])}" stroke="#bfe6ff" stroke-width="3" '
                    'stroke-dasharray="5 5" opacity="0.8"/>')
    for k, (x, y) in enumerate(corners):
        body.append(h2o(x, y, 13, ang=60 * k + 120))
    body.append(snowflake(hx, hy - 80, 22, "#e6f2ff", 0.9))
    body.append(arrow([(hx, hy - 50), (hx, hy - 60)], "#e6f2ff", w=3, op=0.6))
    s.a(opening, "".join(body), closing)


def build():
    s = Svg("Ag", COLOR)
    adefs(s)
    background(s, glows=[(560, 260, 420, 0.55)], seed=1113, stars=24, star_box=(0, 0, 1200, 200), bokeh=5)
    rnd = rng(1946)
    mountains(s)
    cloud(s, rnd)
    plane(s, 640, 176)
    freezer(s, 1020, 486)
    closeup(s)
    finish(s)
    s.save("snow")


if __name__ == "__main__":
    build()
