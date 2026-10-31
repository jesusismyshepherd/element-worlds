"""Board 'hands': krypton holding hands. In the middle a big krypton atom, its full outer shell of eight
electrons round it, holds a fluorine on each side: krypton difluoride, F-Kr-F in a line. Below on the left,
a glass bulb in a frosty cold bath with the colourless crystals of it at the bottom. On the right a laser
stands on its stage and fires an ultraviolet beam down through a lens onto a wafer of chips; a close-up of
the laser's gas shows a krypton and a fluorine clinging together for a moment, and another pair springing
apart with a violet flash."""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from krkit import *  # noqa: E402,F401

COLOR = "#ff5fb0"
UV = "#b46cff"
ELEC = "#a8ecff"
MX, MY = 520, 290   # the molecule's centre


def molecule(s):
    """F-Kr-F, big, with krypton's full shell drawn round it."""
    s.a(glow(MX, MY, 260, COLOR, 0.25, "s30"))
    for sgn in (-1, 1):
        fx = MX + sgn * 230
        # the bond: a thick glowing stick
        s.a(f'<line x1="{MX + sgn * 70}" y1="{MY}" x2="{fx - sgn * 40}" y2="{MY}" stroke="{COLOR}" stroke-width="30" opacity="0.35" '
            'filter="url(#s4)" stroke-linecap="round"/>',
            f'<line x1="{MX + sgn * 70}" y1="{MY}" x2="{fx - sgn * 40}" y2="{MY}" stroke="#ffd0ea" stroke-width="14" stroke-linecap="round"/>')
    for sgn in (-1, 1):
        fx = MX + sgn * 230
        s.a(glow(fx, MY, 80, "#90e050", 0.35, "s16"), kball(fx, MY, 62, "F"))
    # the outer shell: eight electrons on a tilted ring, full; the ring's far half passes behind the atom
    rx, ry, rot = 150, 56, -14
    t = math.radians(rot)

    def at(a):
        x, y = math.cos(a) * rx, math.sin(a) * ry
        return MX + x * math.cos(t) - y * math.sin(t), MY + x * math.sin(t) + y * math.cos(t)

    def arc(a0, a1):
        pts = [at(a0 + (a1 - a0) * i / 40) for i in range(41)]
        return (f'<path d="{smooth(pts, closed=False)}" fill="none" stroke="{ELEC}" stroke-width="3" opacity="0.75" '
                'stroke-linecap="round"/>')

    def electron(a):
        px, py = at(a)
        return glow(px, py, 12, ELEC, 0.6, "s2") + f'<circle cx="{f(px)}" cy="{f(py)}" r="7" fill="{ELEC}"/>'

    # all eight where they show: four in front of the atom, four behind it but out past its edge
    angles = [math.radians(d) for d in (25, 65, 115, 155, 190, 215, 325, 350)]
    s.a(arc(math.pi, 2 * math.pi), *[electron(a) for a in angles if math.sin(a) < 0])
    s.a(glow(MX, MY, 110, KR, 0.4, "s16"), kball(MX, MY, 96, "Kr"))
    s.a(arc(0, math.pi), *[electron(a) for a in angles if math.sin(a) >= 0])


def cold_bulb(s):
    """A glass bulb standing in a frosty bath, white-ish crystals at its bottom (kept dim: bloom)."""
    bx, by = 170, 470
    s.d(lin("dewarK", [(0, "#2a3454"), (0.4, "#6a7aa4"), (1, "#1e2640")], x1=0, y1=0, x2=1, y2=0))
    out = [f'<ellipse cx="{bx}" cy="{by + 92}" rx="96" ry="12" fill="#000" opacity="0.35"/>',
           f'<rect x="{bx - 80}" y="{by - 10}" width="160" height="100" rx="14" fill="url(#dewarK)"/>',
           f'<ellipse cx="{bx}" cy="{by - 10}" rx="80" ry="14" fill="#9ab0dc"/>',
           f'<ellipse cx="{bx}" cy="{by - 8}" rx="68" ry="9" fill="#1a2240"/>']
    # frost and cold mist
    r = rng(78)
    for _ in range(30):
        x, y = r.uniform(bx - 74, bx + 74), r.uniform(by, by + 84)
        out.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r.uniform(1.5, 3.5))}" fill="#dfe8ff" opacity="{r.uniform(0.25, 0.6):.2f}"/>')
    for k in range(4):
        out.append(f'<ellipse cx="{bx - 40 + k * 28}" cy="{by - 24 - k * 4}" rx="34" ry="10" fill="#dfe8ff" opacity="0.1" filter="url(#s4)"/>')
    # the bulb: neck out of the bath, a round body half in it
    out.append(glass_edges(f"M{bx - 10},{by - 150} L{bx - 10},{by - 70} Q{bx - 62},{by - 50} {bx - 60},{by + 6} "
                           f"Q{bx - 50},{by + 50} {bx},{by + 52} Q{bx + 50},{by + 50} {bx + 60},{by + 6} Q{bx + 62},{by - 50} "
                           f"{bx + 10},{by - 70} L{bx + 10},{by - 150} Z", "#d8e6ff", 3, 0.85, "#b8d0ff", 0.1))
    # crystals in the bulb's bottom (seen above the bath's rim through the glass): little pale prisms
    for (x, y, h, a) in [(bx - 30, by - 22, 26, -12), (bx - 10, by - 18, 34, 6), (bx + 14, by - 22, 28, 18), (bx + 32, by - 16, 20, -4),
                         (bx - 20, by - 14, 18, 30), (bx + 4, by - 12, 22, -24)]:
        out.append(f'<g transform="rotate({a} {x} {y})"><polygon points="{P([(x - 6, y), (x - 4, y - h), (x, y - h - 7), (x + 4, y - h), (x + 6, y)])}" '
                   'fill="#c8c0de" stroke="#ece6ff" stroke-width="1.4" opacity="0.92"/></g>')
    out.append(f'<rect x="{bx - 14}" y="{by - 162}" width="28" height="14" rx="4" fill="#6a6290"/>')
    s.a("".join(out))


def laser(s):
    """An excimer laser standing upright on the right, its UV beam down through a lens onto a wafer of chips."""
    lx0, lx1, ly0, ly1 = 1040, 1140, 230, 440
    s.d(lin("laserB", [(0, "#4a3a6a"), (0.5, "#8a7aaa"), (1, "#3a2c56")], x1=0, y1=0, x2=1, y2=0))
    out = [f'<rect x="{lx0}" y="{ly0}" width="{lx1 - lx0}" height="{ly1 - ly0}" rx="10" fill="url(#laserB)"/>',
           f'<rect x="{lx0 + 14}" y="{ly0 + 24}" width="{lx1 - lx0 - 28}" height="40" rx="5" fill="#140f24"/>',
           f'<rect x="{lx0 + 20}" y="{ly0 + 34}" width="{lx1 - lx0 - 40}" height="20" rx="4" fill="{UV}" opacity="0.6" filter="url(#g2)"/>',
           f'<rect x="{lx0}" y="{ly0}" width="{lx1 - lx0}" height="5" fill="#c8b8ee" opacity="0.6"/>']
    for k in range(3):
        out.append(f'<rect x="{lx0 + 20}" y="{ly0 + 90 + k * 18}" width="{lx1 - lx0 - 40}" height="6" rx="3" fill="#2a2040" opacity="0.8"/>')
    # the beam down, a lens, the wafer on its stage
    cx = (lx0 + lx1) / 2
    wy = 560
    out.append(f'<rect x="{cx - 16}" y="{ly1}" width="32" height="44" fill="{UV}" opacity="0.28" filter="url(#s4)"/>'
               f'<rect x="{cx - 6}" y="{ly1}" width="12" height="44" fill="#e0c8ff" opacity="0.8"/>')
    out.append(f'<ellipse cx="{cx}" cy="{ly1 + 50}" rx="40" ry="9" fill="#bfe0ff" opacity="0.5" stroke="#e6f2ff" stroke-width="2"/>')
    out.append(f'<polygon points="{P([(cx - 30, ly1 + 56), (cx + 30, ly1 + 56), (cx + 6, wy - 12), (cx - 6, wy - 12)])}" fill="{UV}" opacity="0.4" '
               'filter="url(#s2)"/>')
    out.append(f'<rect x="{cx - 120}" y="{wy + 14}" width="240" height="24" rx="6" fill="#3a3456"/>')
    s.d(lin("wafer", [(0, "#5a6aa8"), (0.5, "#a8b4e8"), (1, "#4a5490")], x1=0, y1=0, x2=1, y2=0))
    out.append(f'<ellipse cx="{cx}" cy="{wy}" rx="104" ry="24" fill="url(#wafer)" stroke="#c8d0f4" stroke-width="2"/>')
    for i in range(-4, 5):
        for j in range(-1, 2):
            x, y = cx + i * 20, wy + j * 9
            if ((x - cx) / 96) ** 2 + ((y - wy) / 20) ** 2 < 1:
                out.append(f'<rect x="{f(x - 8)}" y="{f(y - 3)}" width="16" height="6" fill="#ffd27a" opacity="0.45"/>')
    out.append(glow(cx, wy - 6, 16, "#e0c8ff", 0.9, "s4"))
    s.a("".join(out))


def closeup(s):
    """The laser's gas magnified: a krypton and a fluorine clinging for a moment, another pair bursting apart."""
    cx, cy, R = 960, 140, 112
    opening, closing = magnifier(s, "magX", cx, cy, R, COLOR, src=(1090, 274, 20), inner="#1c1236")
    body = [glow(cx - 40, cy - 30, 54, COLOR, 0.5, "s8"),
            kball(cx - 60, cy - 30, 34, "Kr"), kball(cx - 18, cy - 34, 24, "F"),
            f'<line x1="{cx - 32}" y1="{cy - 32}" x2="{cx - 40}" y2="{cy - 31}" stroke="#ffd0ea" stroke-width="6"/>']
    # the other pair flying apart, a violet flash between them
    fx, fy = cx + 30, cy + 46
    body.append(star_burst(fx, fy, 40, 12, 8, UV, 0.85) + glow(fx, fy, 24, "#e8d8ff", 0.9, "s4"))
    body.append(streak(fx - 56, fy + 10, 28, 190, 22, "#bfefff", 0.6) + kball(fx - 56, fy + 10, 28, "Kr"))
    body.append(streak(fx + 60, fy - 10, 20, -10, 22, "#e6ffd0", 0.6) + kball(fx + 60, fy - 10, 20, "F"))
    s.a(opening, "".join(body), closing)


def build():
    s = Svg("Kr", COLOR)
    kdefs(s)
    background(s, glows=[(MX, MY, 360, 0.5), (1000, 420, 220, 0.35)], seed=1963, stars=60, star_box=(0, 0, 1200, 560), bokeh=3)
    molecule(s)
    cold_bulb(s)
    laser(s)
    closeup(s)
    finish(s)
    s.save("hands")


if __name__ == "__main__":
    build()
