"""Board 'dollar': the deck of a Spanish galleon at night under a full moon. An open chest heaped with big
silver coins, more spilling over the planks; in front, one coin cut into eight pieces like a pie (the pieces of
eight, cut for change). Beyond the rail, the moonlit sea, a second galleon under sail, and on the far shore a
cone-shaped mountain, the silver mountain of Potosí. A close-up of a coin's metal: silver atoms with a few
copper atoms among them."""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from agkit import *  # noqa: E402,F401

COLOR = "#36c9b5"
HORIZON = 300
RAIL = 410


def sky_and_sea(s, rnd):
    """The moon, the far shore with its mountain, the sea with the moon's path on it."""
    s.d(lin("sea", [(0, "#1a4a5a"), (1, "#0a1c2a")], x1=0, y1=0, x2=0, y2=1),
        rad("moon", [(0, "#d6dce6"), (0.7, "#b4bccb"), (1, "#8e98aa")], cx=0.42, cy=0.38, r=0.65))
    mx, my = 230, 120
    s.a(glow(mx, my, 110, "#cfe6ff", 0.35, "s30"))
    s.a(f'<circle cx="{mx}" cy="{my}" r="58" fill="url(#moon)"/>')
    for (dx, dy, r) in ((-18, -10, 11), (14, 12, 8), (20, -20, 6), (-8, 22, 7)):
        s.a(f'<circle cx="{mx + dx}" cy="{my + dy}" r="{r}" fill="#9aa4b6" opacity="0.45"/>')
    # the far shore and the silver mountain, a few lights of a town at its foot
    s.a(f'<path d="M0,{HORIZON} L0,{HORIZON - 34} Q60,{HORIZON - 40} 110,{HORIZON - 52} L190,{HORIZON - 150} L270,{HORIZON - 52} '
        f'Q330,{HORIZON - 36} 420,{HORIZON - 22} L520,{HORIZON} Z" fill="#3a2a3a"/>',
        # the cone itself a little redder than the coast (Cerro Rico's reddish rock), lit on its moon side
        f'<path d="M110,{HORIZON - 52} L190,{HORIZON - 150} L270,{HORIZON - 52} Z" fill="#4e2c34"/>',
        f'<path d="M190,{HORIZON - 150} L110,{HORIZON - 52} L150,{HORIZON - 52} Z" fill="#6a3c40" opacity="0.7"/>')
    for (x0, y0) in ((176, HORIZON - 110), (204, HORIZON - 100), (160, HORIZON - 80), (226, HORIZON - 74)):
        s.a(f'<circle cx="{x0}" cy="{y0}" r="2.6" fill="#ffd68a" opacity="0.7"/>')
    for _ in range(12):
        x = rnd.uniform(90, 330)
        s.a(f'<circle cx="{f(x)}" cy="{f(HORIZON - rnd.uniform(6, 28))}" r="1.8" fill="#ffd68a" opacity="0.8"/>')
    s.a(f'<rect x="0" y="{HORIZON}" width="1200" height="{RAIL - HORIZON + 40}" fill="url(#sea)"/>')
    # the moon's path on the water
    for k in range(16):
        y = HORIZON + 6 + k * 7
        w = 30 + k * 9
        s.a(f'<rect x="{f(mx - w / 2 + rnd.uniform(-10, 10))}" y="{y}" width="{f(w * rnd.uniform(0.4, 0.9))}" height="2.5" rx="1" '
            f'fill="#cfe2f0" opacity="{0.5 - k * 0.025:.2f}"/>')
    for k in range(10):
        y = HORIZON + 14 + k * 11
        s.a(f'<path d="M{rnd.uniform(400, 1150):.0f},{y} q14,-4 28,0" fill="none" stroke="#3a7a8a" stroke-width="2" opacity="0.5"/>')


def galleon(s, x, y, k=1.0):
    """A galleon under sail: a high stern with lit windows, three masts of square sails, pennants."""
    out = [f'<g transform="translate({x},{y}) scale({k})">']
    out.append('<path d="M-150,0 L150,0 L170,-36 L120,-40 L120,-70 L-110,-40 L-150,-44 Z" fill="#2a1a1a"/>')
    out.append('<path d="M-150,0 L150,0 L136,14 L-136,14 Z" fill="#1a1012"/>')
    for i in range(4):
        out.append(f'<rect x="{96 - i * 14}" y="-62" width="8" height="10" fill="#ffc86a" opacity="0.9"/>')
    for i in range(7):
        out.append(f'<rect x="{-100 + i * 30}" y="-24" width="10" height="7" fill="#ffc86a" opacity="0.55"/>')
    for (mx, h) in ((-70, 190), (10, 220), (90, 160)):
        out.append(f'<line x1="{mx}" y1="-40" x2="{mx}" y2="{-40 - h}" stroke="#1a1012" stroke-width="5"/>')
        for j, (w, top, hh) in enumerate(((60, -40 - h * 0.92, h * 0.3), (72, -40 - h * 0.6, h * 0.34))):
            out.append(f'<path d="M{mx - w / 2},{f(top)} L{mx + w / 2},{f(top)} Q{mx + w / 2 + 8},{f(top + hh / 2)} {mx + w / 2},{f(top + hh)} '
                       f'L{mx - w / 2},{f(top + hh)} Q{mx - w / 2 + 8},{f(top + hh / 2)} {mx - w / 2},{f(top)} Z" fill="#a8a294" '
                       'stroke="#5a5448" stroke-width="2"/>')
        out.append(f'<path d="M{mx},{-40 - h} L{mx + 26},{-36 - h} L{mx},{-30 - h} Z" fill="#c83a3a"/>')
    out.append('<path d="M-150,-44 L-210,-80" stroke="#1a1012" stroke-width="4"/>')
    out.append('<path d="M-190,-70 L-150,-46 L-150,-74 Z" fill="#a8a294" stroke="#5a5448" stroke-width="2"/>')
    out.append("</g>")
    s.a("".join(out))


def deck(s):
    """The deck in front: the rail with its balusters, planks running away, a lantern."""
    s.d(lin("plank", [(0, "#5a3a24"), (1, "#2a1a12")], x1=0, y1=0, x2=0, y2=1))
    s.a(f'<rect x="0" y="{RAIL}" width="1200" height="{800 - RAIL}" fill="url(#plank)"/>')
    for k in range(-8, 9):
        s.a(f'<line x1="{600 + k * 60}" y1="{RAIL + 30}" x2="{600 + k * 200}" y2="800" stroke="#1e120c" stroke-width="3" opacity="0.6"/>')
    for k in range(4):
        y = RAIL + 60 + k * k * 22 + k * 30
        s.a(f'<line x1="0" y1="{y}" x2="1200" y2="{y}" stroke="#1e120c" stroke-width="2" opacity="0.35"/>')
    # the rail
    s.a(f'<rect x="0" y="{RAIL - 70}" width="1200" height="14" fill="#4a2e1c"/>',
        f'<rect x="0" y="{RAIL - 70}" width="1200" height="4" fill="#8a5a34" opacity="0.7"/>',
        f'<rect x="0" y="{RAIL - 4}" width="1200" height="34" fill="#3a2416"/>')
    for k in range(25):
        x = 10 + k * 50
        s.a(f'<rect x="{x}" y="{RAIL - 56}" width="12" height="54" rx="5" fill="#3a2416"/>')
    # a lantern on a post
    lx, ly = 1110, 300
    s.a(f'<rect x="{lx - 5}" y="{ly + 30}" width="10" height="{RAIL - ly - 40}" fill="#2a1a12"/>',
        glow(lx, ly, 70, "#ffb050", 0.55, "s16"),
        f'<rect x="{lx - 18}" y="{ly - 26}" width="36" height="50" rx="6" fill="#ffc86a" opacity="0.85"/>',
        f'<path d="M{lx - 22},{ly - 26} L{lx},{ly - 46} L{lx + 22},{ly - 26} Z" fill="#2a1a12"/>',
        f'<rect x="{lx - 22}" y="{ly + 22}" width="44" height="8" fill="#2a1a12"/>')


def chest(s, rnd):
    """The open chest heaped with coins, more spilling onto the deck."""
    x, y, w, h = 250, 470, 280, 120
    s.d(lin("wood", [(0, "#7a4a28"), (1, "#3a2010")], x1=0, y1=0, x2=0, y2=1))
    s.a(f'<ellipse cx="{x + 20}" cy="{y + h + 8}" rx="{w * 0.62}" ry="20" fill="#000" opacity="0.45" filter="url(#s8)"/>')
    # the lid, open behind
    s.a(f'<path d="M{x - w / 2 + 6},{y - 6} L{x - w / 2 - 14},{y - 110} Q{x},{y - 160} {x + w / 2 + 14},{y - 110} L{x + w / 2 - 6},{y - 6} Z" '
        'fill="url(#wood)" stroke="#2a160a" stroke-width="4"/>')
    for t in (0.3, 0.7):
        s.a(f'<line x1="{x - w / 2 + w * t - 4}" y1="{y - 140 + 20 * abs(t - 0.5)}" x2="{x - w / 2 + w * t + 2}" y2="{y - 6}" '
            'stroke="#b08a3a" stroke-width="10"/>')
    # the heap of coins
    for _ in range(60):
        cx = x + rnd.uniform(-w / 2 + 24, w / 2 - 24)
        cy = y - 8 - rnd.uniform(0, 46) * (1 - abs(cx - x) / (w * 0.6))
        s.a(coin_face(cx, cy, 22, rnd.uniform(9, 14), rot=rnd.uniform(-20, 20), edge=4, emblem="pillars" if rnd.random() < 0.5 else None))
    # the chest's front
    s.a(f'<rect x="{x - w / 2}" y="{y}" width="{w}" height="{h}" rx="8" fill="url(#wood)" stroke="#2a160a" stroke-width="4"/>')
    for t in (0.2, 0.8):
        s.a(f'<rect x="{x - w / 2 + w * t - 7}" y="{y}" width="14" height="{h}" fill="#b08a3a"/>')
    s.a(f'<rect x="{x - 18}" y="{y + 30}" width="36" height="40" rx="5" fill="#c8a04a"/>',
        f'<circle cx="{x}" cy="{y + 46}" r="6" fill="#3a2010"/>')
    # coins spilled on the deck
    for (cx, cy, rot) in ((420, 580, 10), (470, 560, -14), (110, 590, 4), (80, 560, 20), (500, 596, 0)):
        s.a(coin_face(cx, cy, 30, 15, rot=rot, edge=5, emblem="pillars"))
    for (cx, cy) in ((150, 510), (390, 520)):
        s.a(sparkle(cx, cy, 12, "#ffffff", 0.9))


def pieces_of_eight(s):
    """One big coin cut into eight wedges, lying a little apart like a pie."""
    cx, cy, rx, ry = 720, 520, 120, 56
    out = []
    for k in range(8):
        a0, a1 = k * math.tau / 8 + 0.02, (k + 1) * math.tau / 8 - 0.02
        mid = (a0 + a1) / 2
        ox, oy = math.cos(mid) * 12, math.sin(mid) * 7
        pts = [(cx + ox, cy + oy)] + [(cx + ox + math.cos(a0 + (a1 - a0) * t / 8) * rx, cy + oy + math.sin(a0 + (a1 - a0) * t / 8) * ry)
                                     for t in range(9)]
        out.append(f'<path d="{poly([(px, py + 7) for px, py in pts])}" fill="#2c313b"/>')
        out.append(f'<path d="{poly(pts)}" fill="url(#agBand)" stroke="#2c313b" stroke-width="2"/>')
        # a bit of the rim's beading on each piece
        for t in (2, 4, 6):
            a = a0 + (a1 - a0) * t / 8
            out.append(f'<circle cx="{f(cx + ox + math.cos(a) * rx * 0.9)}" cy="{f(cy + oy + math.sin(a) * ry * 0.9)}" r="2.4" '
                       'fill="#2c313b" opacity="0.35"/>')
    # the cutter's chisel lying beside them
    out.append(f'<path d="M{cx + 150},{cy + 30} L{cx + 250},{cy - 10}" stroke="#8a8f9a" stroke-width="10" stroke-linecap="round"/>')
    out.append(f'<path d="M{cx + 230},{cy - 2} L{cx + 290},{cy - 26}" stroke="#6a4a2a" stroke-width="16" stroke-linecap="round"/>')
    s.a("".join(out))
    s.a(sparkle(cx - 40, cy - 30, 14, "#ffffff", 0.9))
    return (cx - 30, cy - 10)


def closeup(s, src):
    """The coin's metal magnified: silver atoms, with a few copper atoms among them (93% silver)."""
    cx, cy, R = 985, 200, 135
    opening, closing = magnifier(s, "magCoin", cx, cy, R, COLOR, src=(src[0], src[1], 22), inner="#0e2a2a")
    body = []
    copper = {(-2, 1), (2, -1), (0, 3), (3, 2)}
    for j in range(-4, 5):
        for i in range(-5, 6):
            x, y = cx + i * 32 + (j % 2) * 16, cy + j * 28
            body.append(aball(x, y, 15, "Cu" if (i, j) in copper else "Ag"))
    s.a(opening, "".join(body), closing)


def build():
    s = Svg("Ag", COLOR)
    adefs(s)
    background(s, glows=[(230, 130, 260, 0.6), (700, 260, 300, 0.3)], seed=1520, stars=70, star_box=(0, 0, 1200, 280), bokeh=5)
    rnd = rng(1792)
    sky_and_sea(s, rnd)
    galleon(s, 690, 330, 0.62)
    deck(s)
    chest(s, rnd)
    src = pieces_of_eight(s)
    closeup(s, src)
    finish(s)
    s.save("dollar")


if __name__ == "__main__":
    build()
