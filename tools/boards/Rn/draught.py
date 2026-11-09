"""Board 'draught': Montreal, winter 1899, Rutherford's physics laboratory at night. The door at the far end
stands open and a cold draught swirls in with a few snowflakes, across the bench to the apparatus: two
brass plates on black posts, a dish of white thorium oxide on the lower one, and the gas it gives off
(teal wisps) blown out sideways from between the plates. A wire runs to a gold-leaf electroscope whose
leaves droop as the gas is carried away; a wall clock for the minute it takes to lose half its power; a
tall window onto snowy roofs and a church spire."""
import math
import os
import random
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from rnkit import *  # noqa: E402,F401,F403

COLOR = "#74b9ff"
BENCH = 520


def build():
    s = Svg("Rn", COLOR)
    setup(s)
    background(s, glows=[(560, 380, 330, 0.55), (960, 240, 240, 0.5)], seed=1899, stars=0, bokeh=4, wash=True)
    rnd = random.Random(1899)
    s.d(lin("panel", [(0, "#4a3020"), (1, "#2a1a10")], x1=0, y1=0, x2=0, y2=1),
        lin("plaster", [(0, "#2b3456"), (1, "#222a48")], x1=0, y1=0, x2=0, y2=1),
        lin("benchD", [(0, "#7a5034"), (0.1, "#5a3a24"), (1, "#24170e")], x1=0, y1=0, x2=0, y2=1),
        lin("night", [(0, "#0e1838"), (1, "#24386a")], x1=0, y1=0, x2=0, y2=1),
        lin("brass", [(0, "#f0cd7a"), (0.5, "#b8892e"), (1, "#7a5a1e")], x1=0, y1=0, x2=0, y2=1),
        rad("lampG", [(0, "#ffe7a6", 0.6), (0.4, "#ffc95e", 0.22), (1, "#ffb84d", 0)]),
        lin("corr", [(0, "#4a6aa8"), (1, "#1e2c58")], x1=0, y1=0, x2=0, y2=1))

    # ---------- the room: plaster above, dark wood panelling below
    s.a('<rect x="0" y="0" width="1200" height="400" fill="url(#plaster)" opacity="0.85"/>',
        '<rect x="0" y="380" width="1200" height="260" fill="url(#panel)"/>',
        '<rect x="0" y="376" width="1200" height="8" fill="#6b4630"/>')
    for x in range(20, 1200, 120):
        s.a(f'<rect x="{x}" y="398" width="96" height="110" rx="4" fill="none" stroke="#1e130c" stroke-width="3" opacity="0.6"/>')

    # ---------- the window: snowy roofs, a spire, snow falling
    wx0, wy0, wx1, wy1 = 850, 80, 1080, 400
    s.d(f'<clipPath id="win"><path d="M{wx0},{wy1} L{wx0},{wy0 + 60} Q{(wx0 + wx1) / 2},{wy0 - 30} {wx1},{wy0 + 60} L{wx1},{wy1}Z"/></clipPath>')
    s.a('<g clip-path="url(#win)">', f'<rect x="{wx0}" y="{wy0 - 40}" width="{wx1 - wx0}" height="{wy1 - wy0 + 40}" fill="url(#night)"/>')
    for (x, w, h) in ((850, 60, 90), (905, 50, 70), (950, 70, 110), (1015, 70, 80)):
        top = wy1 - h
        s.a(f'<path d="M{x},{wy1} L{x},{top + 18} L{x + w / 2},{top} L{x + w},{top + 18} L{x + w},{wy1}Z" fill="#141c3a"/>',
            f'<path d="M{x - 2},{top + 20} L{x + w / 2},{top + 1} L{x + w + 2},{top + 20} L{x + w + 2},{top + 26} L{x + w / 2},{top + 9} L{x - 2},{top + 26}Z" fill="#a9b8d8"/>')
        for k in range(2):
            s.a(f'<rect x="{x + 10 + k * (w - 30)}" y="{top + 36}" width="10" height="14" fill="#ffc95e" opacity="0.7"/>')
    s.a(f'<path d="M1000,{wy1 - 110} L1010,{wy1 - 220} L1020,{wy1 - 110}Z" fill="#141c3a"/>',
        f'<path d="M1003,{wy1 - 150} L1010,{wy1 - 220} L1017,{wy1 - 150}Z" fill="#a9b8d8" opacity="0.8"/>')
    for _ in range(40):
        x, y = rnd.uniform(wx0, wx1), rnd.uniform(wy0 - 20, wy1)
        s.a(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(rnd.uniform(1.4, 3.2))}" fill="#dfe8ff" opacity="{rnd.uniform(0.5, 0.9):.2f}"/>')
    s.a("</g>")
    s.a(f'<path d="M{wx0},{wy1} L{wx0},{wy0 + 60} Q{(wx0 + wx1) / 2},{wy0 - 30} {wx1},{wy0 + 60} L{wx1},{wy1}" fill="none" '
        f'stroke="#5a3a26" stroke-width="12"/>',
        f'<line x1="{(wx0 + wx1) / 2}" y1="{wy0 + 16}" x2="{(wx0 + wx1) / 2}" y2="{wy1}" stroke="#5a3a26" stroke-width="7"/>',
        f'<line x1="{wx0}" y1="{wy0 + 170}" x2="{wx1}" y2="{wy0 + 170}" stroke="#5a3a26" stroke-width="7"/>',
        f'<rect x="{wx0 - 14}" y="{wy1}" width="{wx1 - wx0 + 28}" height="12" fill="#6b4630"/>',
        f'<path d="M{wx0 + 6},{wy1} Q{wx0 + 40},{wy1 - 12} {wx0 + 80},{wy1 - 4} Q{wx0 + 140},{wy1 - 14} {wx1 - 6},{wy1}Z" fill="#a9b8d8" opacity="0.8"/>')

    # ---------- the door at the far end, open: the cold corridor beyond, the door leaf swung in
    dx0, dy0, dx1 = 70, 140, 230
    s.a(f'<rect x="{dx0 - 14}" y="{dy0 - 14}" width="{dx1 - dx0 + 28}" height="{BENCH + 80 - dy0 + 14}" fill="#5a3a26"/>',
        f'<rect x="{dx0}" y="{dy0}" width="{dx1 - dx0}" height="{BENCH + 80 - dy0}" fill="url(#corr)"/>',
        f'<rect x="{dx0}" y="{dy0 + 260}" width="{dx1 - dx0}" height="6" fill="#8aa6e0" opacity="0.4"/>')
    leaf = [(dx1, dy0), (dx1 + 92, dy0 - 30), (dx1 + 92, BENCH + 110), (dx1, BENCH + 80)]
    s.a(f'<polygon points="{P(leaf)}" fill="#6b4630"/>',
        f'<polygon points="{P([(dx1 + 16, dy0 + 20), (dx1 + 78, dy0), (dx1 + 78, dy0 + 170), (dx1 + 16, dy0 + 180)])}" fill="#5a3a26"/>',
        f'<polygon points="{P([(dx1 + 16, dy0 + 220), (dx1 + 78, dy0 + 206), (dx1 + 78, BENCH + 70), (dx1 + 16, BENCH + 60)])}" fill="#5a3a26"/>',
        f'<circle cx="{dx1 + 80}" cy="{dy0 + 250}" r="6" fill="url(#brass)"/>')

    # ---------- the lamp over the bench, the clock on the wall
    s.a('<circle cx="560" cy="220" r="230" fill="url(#lampG)"/>',
        '<line x1="560" y1="0" x2="560" y2="150" stroke="#1a120c" stroke-width="3"/>',
        '<path d="M520,180 L600,180 L582,150 L538,150Z" fill="#2f5a3a"/>',
        glow(560, 186, 16, "#fff0c0", 0.9, "s4"))
    cx, cy = 740, 190
    s.a(f'<rect x="{cx - 34}" y="{cy - 50}" width="68" height="170" rx="8" fill="#5a3a26"/>',
        f'<circle cx="{cx}" cy="{cy}" r="28" fill="#e9dfc6"/><circle cx="{cx}" cy="{cy}" r="28" fill="none" stroke="#b8892e" stroke-width="4"/>',
        f'<line x1="{cx}" y1="{cy}" x2="{cx}" y2="{cy - 20}" stroke="#2a1d14" stroke-width="3" stroke-linecap="round"/>',
        f'<line x1="{cx}" y1="{cy}" x2="{cx + 14}" y2="{cy + 6}" stroke="#2a1d14" stroke-width="3" stroke-linecap="round"/>',
        f'<rect x="{cx - 20}" y="{cy + 36}" width="40" height="76" rx="4" fill="#1e130c"/>',
        f'<line x1="{cx}" y1="{cy + 38}" x2="{cx + 10}" y2="{cy + 96}" stroke="url(#brass)" stroke-width="2.5"/>',
        f'<circle cx="{cx + 10}" cy="{cy + 98}" r="8" fill="url(#brass)"/>')
    for k in range(12):
        a = math.radians(k * 30)
        s.a(f'<circle cx="{f(cx + math.cos(a) * 22)}" cy="{f(cy + math.sin(a) * 22)}" r="1.6" fill="#2a1d14"/>')

    # ---------- the bench
    s.a(f'<rect x="300" y="{BENCH}" width="900" height="{800 - BENCH}" fill="url(#benchD)"/>',
        f'<rect x="300" y="{BENCH}" width="900" height="5" fill="#a87a52" opacity="0.7"/>')

    # ---------- the plates on their posts, the dish of thorium oxide
    px, pw = 560, 230
    lo, hi = BENCH - 46, BENCH - 128
    for x in (px - pw / 2 + 16, px + pw / 2 - 16):
        s.a(f'<rect x="{x - 7}" y="{hi}" width="14" height="{BENCH - hi}" rx="4" fill="#1a1a20"/>')
    s.a(f'<rect x="{px - pw / 2}" y="{lo}" width="{pw}" height="10" rx="3" fill="url(#brass)"/>',
        f'<rect x="{px - pw / 2}" y="{hi}" width="{pw}" height="10" rx="3" fill="url(#brass)"/>',
        f'<rect x="{px - pw / 2 - 6}" y="{BENCH - 8}" width="{pw + 12}" height="10" rx="3" fill="#2a2a32"/>')
    s.a(f'<path d="M{px - 54},{lo} L{px + 54},{lo} L{px + 44},{lo - 12} L{px - 44},{lo - 12}Z" fill="#9aa3b8"/>',
        f'<ellipse cx="{px}" cy="{lo - 12}" rx="44" ry="6" fill="#d4cfc4"/>')
    # the emanation: rising from the powder and blown out to the right by the draught
    for k in range(5):
        x0 = px - 34 + k * 17
        pts = [(x0, lo - 14), (x0 + 30, lo - 36 - k * 4), (px + pw / 2 + 30 + k * 18, lo - 50 - k * 6),
               (px + pw / 2 + 120 + k * 24, lo - 40 - k * 12)]
        s.a(wisp(pts, w=8, op=0.3))
    for (x, y, r, o) in ((px - 10, lo - 32, 7, 0.95), (px + 60, lo - 52, 7, 0.9), (px + 150, lo - 62, 6.5, 0.8),
                         (px + 210, lo - 70, 6, 0.65), (px + 280, lo - 64, 5.5, 0.5), (px + 340, lo - 86, 5, 0.35)):
        s.a(radon(x, y, r, o))

    # ---------- the draught: cold swirls from the door across the bench, carrying snowflakes
    for k, (y0, y1) in enumerate(((260, 330), (330, 380), (400, 420))):
        pts = [(dx1 - 10, y0), (380, y0 + 30), (470, y1 - 10), (560, y1 + 10 + k * 8), (700, y1 + 4 + k * 10), (860, y1 - 20 + k * 14)]
        s.a(arrow(pts, "#b8d4ff", w=5, op=0.5 - k * 0.08, dash="16 10"))
    for (x, y, r) in ((300, 300, 9), (360, 350, 7), (420, 300, 6), (480, 380, 7), (330, 420, 6)):
        s.a(snowflake(x, y, r, "#dfeaff", 0.8))

    # ---------- the wire to the electroscope: its leaves only a little apart now
    ex, ey = 920, BENCH
    s.a(f'<path d="M{px + pw / 2},{hi + 5} C{px + pw / 2 + 60},{hi - 40} {ex - 80},{ey - 230} {ex},{ey - 214}" fill="none" '
        f'stroke="#c8783a" stroke-width="3"/>')
    s.a(f'<rect x="{ex - 50}" y="{ey - 12}" width="100" height="14" rx="4" fill="#3a2a20"/>',
        f'<path d="M{ex - 44},{ey - 12} L{ex - 44},{ey - 130} Q{ex - 44},{ey - 190} {ex},{ey - 190} Q{ex + 44},{ey - 190} {ex + 44},{ey - 130} L{ex + 44},{ey - 12}" '
        f'fill="#bfe0ff" fill-opacity="0.08" stroke="#d8ecff" stroke-width="3" stroke-opacity="0.7"/>',
        f'<rect x="{ex - 3}" y="{ey - 214}" width="6" height="130" fill="url(#brass)"/>',
        f'<circle cx="{ex}" cy="{ey - 216}" r="9" fill="url(#brass)"/>')
    for sgn in (-1, 1):
        s.a(f'<path d="M{ex},{ey - 86} L{ex + sgn * 14},{ey - 40} L{ex + sgn * 8},{ey - 38}Z" fill="#f2c040"/>')
    s.a(f'<rect x="{ex - 52}" y="{ey - 216}" width="104" height="0" fill="none"/>')
    # a battery of cells
    for k in range(3):
        x = 1040 + k * 34
        s.a(f'<rect x="{x}" y="{BENCH - 56}" width="28" height="56" rx="4" fill="#3a5a8a" opacity="0.9"/>',
            f'<rect x="{x + 10}" y="{BENCH - 66}" width="8" height="10" fill="url(#brass)"/>')

    finish(s)
    s.save("draught")


if __name__ == "__main__":
    build()
