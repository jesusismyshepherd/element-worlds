"""Board 'photo': a darkroom under a red safelight. Prints hang to dry on a line with pegs; on the left the
enlarger shines its beam down onto a sheet of paper; on the bench three trays, and in the first, the developer,
a picture of a cat is coming up out of the blank paper. A close-up: a crystal of silver bromide, silver and
bromine atoms in a checkerboard, a ray of light striking it and a speck of four silver atoms on its face."""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from agkit import *  # noqa: E402,F401

COLOR = "#ff5f6d"
PAPER = "#d8a0a6"  # white paper under the red lamp: kept under the bloom
INK = "#3a1418"


def room(s):
    """Dark walls, a tiled wall behind the bench, the bench top, the safelight glowing red."""
    s.d(lin("bench", [(0, "#4a2026"), (1, "#24101a")], x1=0, y1=0, x2=0, y2=1),
        rad("safe", [(0, "#ff8a8a"), (0.5, "#e83a46"), (1, "#7a1018")], cx=0.45, cy=0.4, r=0.6))
    for j in range(5):
        for i in range(16):
            x, y = i * 80 + (j % 2) * 40 - 40, 300 + j * 34
            s.a(f'<rect x="{x}" y="{y}" width="76" height="30" rx="3" fill="#3a1822" opacity="0.55"/>')
    s.a('<rect x="0" y="470" width="1200" height="330" fill="url(#bench)"/>',
        '<rect x="0" y="466" width="1200" height="8" fill="#6a2a32"/>')
    # the safelight
    lx, ly = 150, 120
    s.a(glow(lx, ly, 160, "#ff3a4a", 0.45, "s30"))
    s.a(f'<line x1="{lx}" y1="0" x2="{lx}" y2="{ly - 40}" stroke="#1a0a10" stroke-width="5"/>',
        f'<path d="M{lx - 48},{ly - 6} Q{lx},{ly - 70} {lx + 48},{ly - 6} Z" fill="#2a1018"/>',
        f'<ellipse cx="{lx}" cy="{ly}" rx="46" ry="20" fill="url(#safe)"/>')


def prints_line(s):
    """A line across the top with pegs and three prints drying: a mountain, a house, a sailing boat."""
    pts = [(250, 64), (560, 96), (870, 84), (1220, 60)]
    s.a(f'<path d="{smooth(pts, closed=False)}" fill="none" stroke="#c88a90" stroke-width="2.5" opacity="0.7"/>')

    def frame(x, y, ang, draw):
        g = [f'<g transform="rotate({ang} {x} {y})">',
             f'<rect x="{x - 64}" y="{y + 8}" width="128" height="96" fill="{PAPER}" opacity="0.92"/>',
             f'<rect x="{x - 56}" y="{y + 16}" width="112" height="80" fill="#c08890"/>']
        g.append(draw(x, y + 16))
        g.append(f'<rect x="{x - 8}" y="{y - 8}" width="16" height="26" rx="3" fill="#8a5a3a"/>')
        g.append("</g>")
        return "".join(g)

    def mountain(x, y):
        return (f'<circle cx="{x + 30}" cy="{y + 22}" r="11" fill="#f0c0c4" opacity="0.8"/>'
                f'<polygon points="{P([(x - 56, y + 80), (x - 14, y + 26), (x + 14, y + 56), (x + 30, y + 40), (x + 56, y + 80)])}" fill="{INK}"/>')

    def house(x, y):
        return (f'<rect x="{x - 26}" y="{y + 40}" width="52" height="40" fill="{INK}"/>'
                f'<polygon points="{P([(x - 34, y + 42), (x, y + 14), (x + 34, y + 42)])}" fill="#5a2028"/>'
                f'<rect x="{x - 8}" y="{y + 56}" width="16" height="24" fill="{PAPER}" opacity="0.7"/>')

    def boat(x, y):
        return (f'<rect x="{x - 56}" y="{y + 62}" width="112" height="18" fill="#7a3a42"/>'
                f'<path d="M{x - 34},{y + 58} L{x + 34},{y + 58} L{x + 24},{y + 70} L{x - 24},{y + 70} Z" fill="{INK}"/>'
                f'<polygon points="{P([(x - 2, y + 10), (x - 2, y + 56), (x - 34, y + 56)])}" fill="#5a2028"/>'
                f'<polygon points="{P([(x + 2, y + 18), (x + 2, y + 56), (x + 28, y + 56)])}" fill="{INK}"/>')

    s.a(frame(400, 82, -3, mountain), frame(590, 96, 2, house), frame(770, 90, -2, boat))


def enlarger(s):
    """The enlarger: a column on its baseboard, the lamp head and bellows, its beam down onto the paper."""
    bx = 250
    s.a(f'<rect x="{bx - 120}" y="470" width="260" height="22" rx="4" fill="#1a0c12"/>',
        f'<rect x="{bx + 90}" y="200" width="18" height="276" fill="#2a1420"/>',
        f'<rect x="{bx - 46}" y="230" width="150" height="16" fill="#2a1420"/>')
    s.a(f'<rect x="{bx - 70}" y="186" width="100" height="58" rx="10" fill="#3a1a26"/>',
        f'<path d="M{bx - 56},244 L{bx + 16},244 L{bx + 6},290 L{bx - 46},290 Z" fill="#24101a"/>')
    for k in range(4):
        s.a(f'<line x1="{bx - 54 + k * 2}" y1="{252 + k * 10}" x2="{bx + 14 - k * 2}" y2="{252 + k * 10}" stroke="#4a2430" stroke-width="2"/>')
    s.a(f'<rect x="{bx - 32}" y="290" width="28" height="18" rx="4" fill="#1a0a10"/>')
    # the beam: the one white light in the room
    s.a(f'<polygon points="{P([(bx - 26, 308), (bx - 10, 308), (bx + 60, 468), (bx - 96, 468)])}" fill="#fff0d8" opacity="0.16"/>')
    s.a(f'<rect x="{bx - 100}" y="462" width="164" height="10" fill="{PAPER}" opacity="0.9"/>')


def trays(s):
    """Three trays on the bench, the developer first, a cat coming up in it; tongs."""
    out = []
    specs = [(560, 520, 250, 100, "#6a5a2a"), (800, 520, 190, 86, "#3a4a5a"), (1010, 520, 190, 86, "#4a3a5a")]
    for k, (x, y, w, h, liquid) in enumerate(specs):
        sk = 26
        out.append(f'<path d="M{x - w / 2},{y - h / 2} L{x + w / 2},{y - h / 2} L{x + w / 2 + sk},{y + h / 2} L{x - w / 2 - sk},{y + h / 2} Z" '
                   'fill="#d8d0d4" opacity="0.18"/>')
        out.append(f'<path d="M{x - w / 2 + 8},{y - h / 2 + 6} L{x + w / 2 - 8},{y - h / 2 + 6} L{x + w / 2 + sk - 12},{y + h / 2 - 6} '
                   f'L{x - w / 2 - sk + 12},{y + h / 2 - 6} Z" fill="{liquid}" opacity="0.85"/>')
        out.append(f'<path d="M{x - w / 2 - sk},{y + h / 2} L{x + w / 2 + sk},{y + h / 2} L{x + w / 2 + sk},{y + h / 2 + 12} '
                   f'L{x - w / 2 - sk},{y + h / 2 + 12} Z" fill="#2a1418"/>')
    s.a("".join(out))
    # the print in the developer: the paper, and the cat coming up on it (half there)
    x, y = 560, 520
    s.a(f'<path d="M{x - 92},{y - 40} L{x + 92},{y - 40} L{x + 106},{y + 36} L{x - 106},{y + 36} Z" fill="{PAPER}"/>')
    cat = (f'<g opacity="0.62" transform="translate({x},{y})">'
           '<ellipse cx="0" cy="12" rx="40" ry="20" fill="#3a1418"/>'
           '<circle cx="-30" cy="-12" r="17" fill="#3a1418"/>'
           '<polygon points="-44,-22 -40,-40 -30,-26" fill="#3a1418"/><polygon points="-26,-26 -18,-40 -16,-22" fill="#3a1418"/>'
           '<path d="M38,14 Q66,10 60,-14" fill="none" stroke="#3a1418" stroke-width="8" stroke-linecap="round"/>'
           '<circle cx="-36" cy="-14" r="3" fill="#d8a0a6"/><circle cx="-24" cy="-14" r="3" fill="#d8a0a6"/>'
           '</g>')
    s.a(cat)
    # ripples on the developer
    for k in range(3):
        s.a(f'<ellipse cx="{x + 60}" cy="{y + 20}" rx="{16 + k * 14}" ry="{5 + k * 4}" fill="none" stroke="#e8c8a0" stroke-width="2" '
            f'opacity="{0.45 - k * 0.12:.2f}"/>')
    # the tongs
    s.a(f'<path d="M{x + 110},{y - 70} L{x + 60},{y + 10}" stroke="#c8b8a0" stroke-width="7" stroke-linecap="round"/>',
        f'<path d="M{x + 124},{y - 66} L{x + 70},{y + 12}" stroke="#a89880" stroke-width="7" stroke-linecap="round"/>')
    return (x - 20, y)


def closeup(s, src):
    """Silver bromide magnified: a checkerboard of silver and bromine atoms; light strikes and a speck of four
    silver atoms forms on its face."""
    cx, cy, R = 985, 230, 140
    opening, closing = magnifier(s, "magAgBr", cx, cy, R, COLOR, src=(src[0], src[1], 22), inner="#24101a")
    body = []
    step = 34
    for j in range(5):
        for i in range(-5, 6):
            x, y = cx + i * step, cy + 4 + j * step
            el = "Ag" if (i + j) % 2 == 0 else "Br"
            body.append(aball(x, y, 13 if el == "Ag" else 16, el))
    # the speck: four silver atoms on the face, glowing a little
    sx, sy = cx - 6, cy - 26
    body.append(glow(sx + 14, sy + 6, 40, "#ffffff", 0.25, "s8"))
    for (dx, dy) in ((0, 0), (26, 0), (13, -20), (13, 20)):
        body.append(aball(sx + dx, sy + dy - 10, 12, "Ag"))
    # the light coming in
    body.append(f'<path d="{wave(cx - 130, cy - 130, sx - 8, sy - 22, 6, 4)}" fill="none" stroke="#8ab8ff" stroke-width="4" '
                'stroke-linecap="round"/>')
    body.append(sparkle(sx - 8, sy - 22, 12, "#e6f0ff", 0.9))
    s.a(opening, "".join(body), closing)


def build():
    s = Svg("Ag", COLOR)
    adefs(s)
    background(s, glows=[(160, 140, 300, 0.6), (600, 420, 360, 0.3)], seed=1839, stars=0, bokeh=5, tint=0.55)
    room(s)
    prints_line(s)
    enlarger(s)
    src = trays(s)
    closeup(s, src)
    finish(s)
    s.save("photo")


if __name__ == "__main__":
    build()
