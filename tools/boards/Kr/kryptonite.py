"""Board 'kryptonite': fiction and fact side by side, split by a comic panel's jagged edge. On the left, a
comic page: halftone dots, a caped hero flying across a big moon, and a cluster of glowing green crystals
on a rock in a starburst (made up). On the right, a museum case at night: the real mineral jadarite, a
white, earthy lump under a glass dome on its plinth, and beside it a clear flask of real krypton, which
looks like nothing at all; a close-up of the flask shows its atoms flying about."""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from krkit import *  # noqa: E402,F401

COLOR = "#5cf27a"
GREEN = "#5cf27a"
SPLIT = [(600, 0), (572, 120), (622, 230), (580, 350), (628, 470), (590, 624), (600, 800)]


def comic(s):
    """The left half: a comic panel with halftone dots, a moon, a flying caped hero and the green crystals."""
    s.d('<pattern id="dots" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="8" cy="8" r="3.2" fill="#5cf27a" opacity="0.22"/></pattern>',
        lin("comicSky", [(0, "#163a4a"), (1, "#0e2032")], x1=0, y1=0, x2=0, y2=1),
        f'<clipPath id="left"><polygon points="{P([(0, 0)] + SPLIT + [(0, 800)])}"/></clipPath>')
    body = [f'<rect width="700" height="800" fill="url(#comicSky)"/>', '<rect width="700" height="800" fill="url(#dots)"/>']
    # the moon (comic yellow, kept under the bloom) and the hero across it
    mx, my = 220, 170
    body.append(glow(mx, my, 120, "#d4b450", 0.35, "s16"))
    body.append(f'<circle cx="{mx}" cy="{my}" r="104" fill="#d0ae4c"/>')
    body.append(f'<circle cx="{mx}" cy="{my}" r="104" fill="url(#dots)"/>')
    hero = (f'M{mx - 120},{my + 34} Q{mx - 60},{my + 2} {mx - 10},{my - 6} L{mx + 46},{my - 22} L{mx + 92},{my - 46} '
            f'L{mx + 98},{my - 40} L{mx + 56},{my - 12} Q{mx + 44},{my + 4} {mx + 22},{my + 10} L{mx - 20},{my + 22} '
            f'Q{mx - 70},{my + 40} {mx - 128},{my + 58} Z')
    cape = (f'M{mx - 6},{my - 4} Q{mx - 70},{my - 46} {mx - 150},{my - 30} Q{mx - 110},{my - 10} {mx - 160},{my + 8} '
            f'Q{mx - 90},{my + 16} {mx - 20},{my + 18} Z')
    body.append(f'<path d="{cape}" fill="#a02a3a"/>')
    body.append(f'<path d="{hero}" fill="#141a36"/>')
    body.append(f'<circle cx="{mx + 44}" cy="{my - 32}" r="15" fill="#141a36"/>')
    # speed lines behind
    for k in range(4):
        y = my - 30 + k * 18
        body.append(f'<line x1="{mx - 300}" y1="{y + k * 4}" x2="{mx - 180}" y2="{y}" stroke="#e8f0ff" stroke-width="3" opacity="0.35" '
                    'stroke-linecap="round"/>')
    # the starburst and the crystals on their rock
    cx, cy = 300, 470
    body.append(star_burst(cx, cy - 30, 210, 120, 14, "#d8e84a", 0.28, rot=8))
    body.append(star_burst(cx, cy - 30, 150, 96, 14, "#e8f06a", 0.3, rot=-4))
    body.append(glow(cx, cy - 40, 120, GREEN, 0.55, "s30"))
    body.append(f'<path d="M{cx - 150},{cy + 64} Q{cx - 120},{cy + 10} {cx - 40},{cy + 14} Q{cx + 40},{cy + 2} {cx + 110},{cy + 20} '
                f'Q{cx + 160},{cy + 40} {cx + 150},{cy + 64} Z" fill="#3a3440"/>')
    for (x, h, a, w) in [(cx - 56, 120, -24, 30), (cx - 14, 170, -6, 36), (cx + 30, 136, 14, 32), (cx + 70, 96, 32, 26), (cx - 92, 80, -40, 24)]:
        base = cy + 20
        pts = [(x - w / 2, base), (x - w / 2, base - h * 0.78), (x, base - h), (x + w / 2, base - h * 0.78), (x + w / 2, base)]
        body.append(f'<g transform="rotate({a} {x} {base})">'
                    f'<polygon points="{P(pts)}" fill="#2fb84a"/>'
                    f'<polygon points="{P([(x - w / 2, base), (x - w / 2, base - h * 0.78), (x, base - h), (x, base)])}" fill="{GREEN}"/>'
                    f'<line x1="{x - w / 4}" y1="{base - 8}" x2="{x - w / 4}" y2="{base - h * 0.7}" stroke="#d8ffd0" stroke-width="3" opacity="0.6"/>'
                    '</g>')
    body.append(sparkle(cx - 30, cy - 160, 14, "#eaffd8", 0.9))
    body.append(sparkle(cx + 60, cy - 110, 10, "#eaffd8", 0.8))
    s.a('<g clip-path="url(#left)">' + "".join(body) + "</g>")
    # the panel's edge
    s.a(f'<path d="{poly(SPLIT, closed=False)}" fill="none" stroke="#0b0f24" stroke-width="14" stroke-linejoin="round"/>',
        f'<path d="{poly(SPLIT, closed=False)}" fill="none" stroke="#e8f0ff" stroke-width="4" stroke-linejoin="round" opacity="0.8"/>')


def museum(s):
    """The right half: a plinth with jadarite under a glass dome, and a flask of krypton beside it."""
    s.d(lin("plinth", [(0, "#3a3450"), (1, "#1c1a2c")], x1=0, y1=0, x2=0, y2=1),
        rad("jad", [(0, "#cfc9bb"), (0.35, "#b4ad9e"), (0.8, "#7c7668"), (1, "#545046")], cx=0.38, cy=0.3, r=0.75),
        rad("spot", [(0, "#ffffff", 0.22), (1, "#ffffff", 0)]))
    px, py = 830, 470
    # a spotlight from above
    s.a(f'<polygon points="{P([(px - 30, 0), (px + 30, 0), (px + 150, py + 10), (px - 150, py + 10)])}" fill="#e8f0ff" opacity="0.05"/>')
    s.a(f'<ellipse cx="{px}" cy="{py - 4}" rx="150" ry="26" fill="url(#spot)"/>')
    s.a(f'<rect x="{px - 120}" y="{py}" width="240" height="160" fill="url(#plinth)"/>',
        f'<ellipse cx="{px}" cy="{py}" rx="120" ry="20" fill="#4a4466"/>',
        f'<rect x="{px - 120}" y="{py + 30}" width="240" height="6" fill="#d8b85a" opacity="0.6"/>')
    # the lump: soft, earthy, white (drawn grey-white so the bloom keeps it white, not a blur)
    lump = smooth([(px - 70, py - 4), (px - 78, py - 40), (px - 50, py - 74), (px - 8, py - 82), (px + 40, py - 70), (px + 74, py - 44),
                   (px + 72, py - 6)])
    s.a(f'<path d="{lump}" fill="url(#jad)"/>')
    r = rng(2007)
    for _ in range(40):
        x, y = px + r.uniform(-60, 60), py + r.uniform(-70, -10)
        s.a(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r.uniform(1.5, 4))}" fill="{r.choice(["#8a8476", "#d6d0c2"])}" opacity="0.6"/>')
    # the glass dome over it
    s.a(glass_edges(f"M{px - 104},{py - 6} L{px - 104},{py - 130} Q{px - 104},{py - 200} {px},{py - 200} Q{px + 104},{py - 200} "
                    f"{px + 104},{py - 130} L{px + 104},{py - 6} Z", "#d8e6ff", 3, 0.7, "#b8d0ff", 0.06),
        f'<path d="M{px - 80},{py - 150} Q{px - 70},{py - 186} {px - 30},{py - 192}" fill="none" stroke="#ffffff" stroke-width="5" '
        'stroke-linecap="round" opacity="0.35"/>')
    # the flask of krypton on a small stand: clear glass, nothing to see
    fx, fy = 1070, 470
    s.a(f'<rect x="{fx - 60}" y="{fy}" width="120" height="160" fill="url(#plinth)"/>',
        f'<ellipse cx="{fx}" cy="{fy}" rx="60" ry="12" fill="#4a4466"/>')
    s.a(glass_edges(f"M{fx - 12},{fy - 160} L{fx - 12},{fy - 110} Q{fx - 58},{fy - 96} {fx - 56},{fy - 50} Q{fx - 52},{fy - 4} {fx},{fy - 2} "
                    f"Q{fx + 52},{fy - 4} {fx + 56},{fy - 50} Q{fx + 58},{fy - 96} {fx + 12},{fy - 110} L{fx + 12},{fy - 160} Z",
                    "#d8e6ff", 3, 0.85, KR, 0.08))
    s.a(f'<rect x="{fx - 16}" y="{fy - 176}" width="32" height="18" rx="5" fill="#6a6290"/>')


def closeup(s):
    """The flask's krypton magnified: atoms flying about, nothing green, nothing glowing."""
    cx, cy, R = 1060, 150, 112
    opening, closing = magnifier(s, "magK", cx, cy, R, KR, src=(1070, 420, 26), inner="#122434")
    body = []
    for (x, y, ang) in [(cx - 50, cy - 40, 20), (cx + 40, cy - 60, 150), (cx - 10, cy + 20, 250), (cx + 60, cy + 40, 200),
                        (cx - 66, cy + 56, 320)]:
        body.append(streak(x, y, 22, ang, 26, "#bfefff", 0.5, 3) + kball(x, y, 22, "Kr"))
    s.a(opening, "".join(body), closing)


def build():
    s = Svg("Kr", COLOR)
    kdefs(s)
    background(s, glows=[(900, 380, 300, 0.3)], seed=1943, stars=50, star_box=(620, 0, 1200, 560), bokeh=2)
    comic(s)
    museum(s)
    closeup(s)
    finish(s)
    s.save("kryptonite")


if __name__ == "__main__":
    build()
