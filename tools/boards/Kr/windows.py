"""Board 'windows': a window cut through, between a snowy night and a warm room. Outside: snow falling on
spruces under the moon. The window: three panes of glass, the two narrow gaps between them filled with
krypton atoms. Inside: a lamp, an armchair, a cat asleep, a steaming mug; the room's heat drifts to the
window in warm wavy arrows and most of it bounces back. A close-up of a gap: big, slow krypton atoms
between two panes, a warm wave dying away as it tries to cross."""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from krkit import *  # noqa: E402,F401

COLOR = "#ffc24a"
WARM = "#ff9a3c"
PANES = [486, 560, 634]   # left edge of each pane
PW = 12                   # pane thickness
TOPF, BOTF = 128, 540     # the frame's inner top and bottom
FLOOR = 560


def outside(s):
    """Snowy night: sky, moon, spruces, snow on the ground (mid-toned: white snow blooms on the wall)."""
    s.d(lin("night", [(0, "#16204a"), (1, "#2a3a6a")], x1=0, y1=0, x2=0, y2=1),
        lin("snow", [(0, "#8a9cc8"), (1, "#56638e")], x1=0, y1=0, x2=0, y2=1))
    s.a(f'<rect x="0" y="0" width="{PANES[0]}" height="{FLOOR + 64}" fill="url(#night)" opacity="0.75"/>')
    s.a(glow(120, 110, 60, "#cfe0ff", 0.4, "s16"), f'<circle cx="120" cy="110" r="30" fill="#d8e2f4"/>',
        f'<circle cx="132" cy="102" r="26" fill="#2a3666" opacity="0.25"/>')
    r = rng(2)
    for (x, h, w) in [(40, 230, 70), (150, 300, 92), (290, 250, 80), (390, 190, 60)]:
        base = FLOOR - 6
        tiers = 5
        for k in range(tiers):
            ty = base - h + k * h / tiers
            tw = w * (0.35 + 0.65 * (k + 1) / tiers)
            s.a(f'<polygon points="{P([(x, ty - 10), (x - tw / 2, ty + h / tiers + 10), (x + tw / 2, ty + h / tiers + 10)])}" fill="#14243c"/>',
                f'<path d="M{f(x - tw / 2 + 6)},{f(ty + h / tiers + 6)} Q{x},{f(ty + h / tiers - 4)} {f(x + tw / 2 - 6)},{f(ty + h / tiers + 6)}" '
                f'fill="none" stroke="#8a9cc8" stroke-width="5" stroke-linecap="round" opacity="0.8"/>')
        s.a(f'<rect x="{x - 6}" y="{base}" width="12" height="14" fill="#2a1c14"/>')
    s.a(f'<path d="M0,{FLOOR - 4} Q120,{FLOOR - 30} 250,{FLOOR - 8} T{PANES[0]},{FLOOR - 14} L{PANES[0]},{FLOOR + 64} L0,{FLOOR + 64} Z" '
        'fill="url(#snow)"/>')
    for _ in range(46):
        x, y = r.uniform(10, PANES[0] - 14), r.uniform(20, FLOOR - 20)
        rr = r.uniform(3, 8)
        s.a(snowflake(x, y, rr, "#c8d6f4", r.uniform(0.45, 0.85), r.uniform(0, 60)))


def room(s):
    """The warm room: wallpaper, floor, a lamp, an armchair, a sleeping cat, a mug."""
    x0 = PANES[2] + PW
    s.d(lin("wall", [(0, "#6a3a2a"), (1, "#3a1e18")], x1=0, y1=0, x2=0, y2=1),
        lin("floorW", [(0, "#5a3420"), (1, "#2a160c")], x1=0, y1=0, x2=0, y2=1),
        lin("chair", [(0, "#c0504a"), (1, "#6a2224")], x1=0, y1=0, x2=0, y2=1))
    s.a(f'<rect x="{x0}" y="0" width="{1200 - x0}" height="{FLOOR}" fill="url(#wall)"/>')
    # wallpaper stripes
    for x in range(x0 + 24, 1200, 48):
        s.a(f'<rect x="{x}" y="0" width="10" height="{FLOOR}" fill="#ffb07a" opacity="0.06"/>')
    s.a(f'<rect x="{x0}" y="{FLOOR}" width="{1200 - x0}" height="{800 - FLOOR}" fill="url(#floorW)"/>')
    # the lamp's warm pool of light
    s.a(glow(1110, 250, 230, WARM, 0.45, "s30"))
    # a standard lamp
    s.a(f'<rect x="1136" y="250" width="8" height="{FLOOR - 250}" fill="#3a2418"/>',
        f'<ellipse cx="1140" cy="{FLOOR - 2}" rx="34" ry="8" fill="#2a1a10"/>',
        f'<path d="M1090,250 L1190,250 L1168,180 L1112,180 Z" fill="#ffcf7a"/>',
        f'<path d="M1090,250 L1190,250 L1184,240 L1096,240 Z" fill="#ffe6b0" opacity="0.6"/>')
    # an armchair facing the window
    ax = 880
    s.a(f'<rect x="{ax - 80}" y="{FLOOR - 170}" width="60" height="170" rx="24" fill="url(#chair)"/>',
        f'<rect x="{ax - 70}" y="{FLOOR - 92}" width="190" height="64" rx="20" fill="url(#chair)"/>',
        f'<rect x="{ax - 86}" y="{FLOOR - 112}" width="40" height="84" rx="16" fill="#a83c38"/>',
        f'<rect x="{ax + 100}" y="{FLOOR - 112}" width="40" height="84" rx="16" fill="#a83c38"/>',
        f'<rect x="{ax - 64}" y="{FLOOR - 30}" width="12" height="30" fill="#2a160c"/>',
        f'<rect x="{ax + 108}" y="{FLOOR - 30}" width="12" height="30" fill="#2a160c"/>')
    # the cat asleep on the cushion: a curled loaf, ears, a tail round it
    cx, cy = ax + 30, FLOOR - 104
    s.a(f'<ellipse cx="{cx}" cy="{cy}" rx="52" ry="26" fill="#e08a3a"/>',
        f'<circle cx="{cx - 40}" cy="{cy - 8}" r="20" fill="#e89a4a"/>',
        f'<polygon points="{P([(cx - 54, cy - 20), (cx - 50, cy - 40), (cx - 40, cy - 24)])}" fill="#e08a3a"/>',
        f'<polygon points="{P([(cx - 36, cy - 24), (cx - 28, cy - 42), (cx - 24, cy - 22)])}" fill="#e08a3a"/>',
        f'<path d="M{cx - 48},{cy - 8} q5,4 10,0" fill="none" stroke="#5a2a10" stroke-width="2.4" stroke-linecap="round"/>',
        f'<path d="M{cx + 46},{cy + 6} Q{cx + 30},{cy + 30} {cx - 20},{cy + 22}" fill="none" stroke="#c8722a" stroke-width="12" stroke-linecap="round"/>')
    for k in range(3):
        s.a(f'<path d="M{cx - 30 + k * 22},{cy - 4} q6,-4 0,-8" fill="none" stroke="#b8621e" stroke-width="3" opacity="0.6"/>')
    # a little table with a steaming mug
    tx = 1066
    s.a(f'<rect x="{tx - 40}" y="{FLOOR - 92}" width="80" height="10" rx="3" fill="#4a2c1c"/>',
        f'<rect x="{tx - 4}" y="{FLOOR - 82}" width="8" height="82" fill="#3a2214"/>',
        f'<rect x="{tx - 16}" y="{FLOOR - 124}" width="30" height="32" rx="5" fill="#4aa0d8"/>',
        f'<path d="M{tx + 14},{FLOOR - 116} q14,2 0,18" fill="none" stroke="#4aa0d8" stroke-width="5"/>')
    for k in range(3):
        sx = tx - 8 + k * 8
        s.a(f'<path d="M{sx},{FLOOR - 130} q-8,-14 0,-28 q8,-14 0,-28" fill="none" stroke="#ffe0c0" stroke-width="3" opacity="0.45" '
            'stroke-linecap="round"/>')


def window(s):
    """Three panes in a frame, the two gaps full of krypton."""
    s.d(lin("glassP", [(0, "#9ad0ff", 0.55), (0.5, "#cfe8ff", 0.35), (1, "#9ad0ff", 0.55)], x1=0, y1=0, x2=1, y2=0),
        lin("frame", [(0, "#e8e2d8"), (1, "#a8a090")], x1=0, y1=0, x2=0, y2=1))
    x0, x1 = PANES[0] - 18, PANES[2] + PW + 18
    out = [f'<rect x="{x0}" y="{TOPF - 40}" width="{x1 - x0}" height="40" rx="4" fill="#7a7468"/>',
           f'<rect x="{x0}" y="{BOTF}" width="{x1 - x0}" height="44" rx="4" fill="#7a7468"/>',
           f'<rect x="{x0}" y="{TOPF - 40}" width="{x1 - x0}" height="8" fill="#b4ac9c"/>',
           f'<rect x="{x0}" y="{BOTF}" width="{x1 - x0}" height="8" fill="#b4ac9c"/>']
    # spacer bars sealing each gap top and bottom
    for i in range(2):
        gx0, gx1 = PANES[i] + PW, PANES[i + 1]
        out.append(f'<rect x="{gx0}" y="{TOPF}" width="{gx1 - gx0}" height="12" fill="#8a8fa0"/>'
                   f'<rect x="{gx0}" y="{BOTF - 12}" width="{gx1 - gx0}" height="12" fill="#8a8fa0"/>')
        # the gap's krypton, a soft teal haze and the atoms
        out.append(f'<rect x="{gx0}" y="{TOPF + 12}" width="{gx1 - gx0}" height="{BOTF - TOPF - 24}" fill="{KR}" opacity="0.12"/>')
        r = rng(36 + i)
        cols = 2
        rows = 9
        for row in range(rows):
            for c in range(cols):
                ax = gx0 + (c + 0.5) * (gx1 - gx0) / cols + r.uniform(-7, 7)
                ay = TOPF + 34 + row * (BOTF - TOPF - 68) / (rows - 1) + r.uniform(-8, 8)
                ang = r.uniform(0, 360)
                out.append(streak(ax, ay, 11, ang, 8, "#bfefff", 0.45, 2) + kball(ax, ay, 11, "Kr"))
    for x in PANES:
        out.append(f'<rect x="{x}" y="{TOPF - 32}" width="{PW}" height="{BOTF - TOPF + 64}" fill="url(#glassP)"/>'
                   f'<rect x="{x}" y="{TOPF - 32}" width="2" height="{BOTF - TOPF + 64}" fill="#e8f4ff" opacity="0.7"/>')
    # the coatings: a faint gold shimmer on the faces towards the gaps
    for x in (PANES[0] + PW - 2, PANES[2]):
        out.append(f'<rect x="{x}" y="{TOPF}" width="2" height="{BOTF - TOPF}" fill="#ffd27a" opacity="0.55"/>')
    s.a("".join(out))


def wall(s):
    """The house wall cut through above and below the window: brick with a layer of insulation."""
    x0, x1 = PANES[0] - 22, PANES[2] + PW + 22
    s.d(f'<pattern id="brick" width="44" height="24" patternUnits="userSpaceOnUse">'
        '<rect width="44" height="24" fill="#6a4a40"/><rect x="1" y="1" width="42" height="10" fill="#7e5a4c"/>'
        '<rect x="-21" y="13" width="42" height="10" fill="#7e5a4c"/><rect x="23" y="13" width="42" height="10" fill="#7e5a4c"/></pattern>')
    for (y0, y1) in ((0, TOPF - 40), (BOTF + 44, 800)):
        s.a(f'<rect x="{x0}" y="{y0}" width="{x1 - x0}" height="{y1 - y0}" fill="url(#brick)"/>',
            f'<rect x="{(x0 + x1) / 2 - 22}" y="{y0}" width="44" height="{y1 - y0}" fill="#d8b85a" opacity="0.5"/>',
            f'<rect x="{x0}" y="{y0}" width="4" height="{y1 - y0}" fill="#000" opacity="0.3"/>',
            f'<rect x="{x1 - 4}" y="{y0}" width="4" height="{y1 - y0}" fill="#000" opacity="0.3"/>')


def heat(s):
    """Warm waves from the room to the window; most bounce back, a faint one gets through."""
    x_in = PANES[2] + PW
    for (y, start) in [(190, 1000), (290, 1020), (380, 960)]:
        d = wave(start, y, x_in + 26, y, 9, 4.5)
        s.a(f'<path d="{d}" fill="none" stroke="{WARM}" stroke-width="16" opacity="0.2" filter="url(#s4)"/>',
            f'<path d="{d}" fill="none" stroke="#ffb46a" stroke-width="6" stroke-linecap="round"/>')
        tip = (x_in + 14, y)
        s.a(f'<polygon points="{P([tip, (x_in + 34, y - 13), (x_in + 34, y + 13)])}" fill="#ffb46a"/>')
        # bouncing back
        s.a(arrow([(x_in + 40, y + 16), (x_in + 74, y + 38), (x_in + 124, y + 42)], "#ffd08a", 5, op=0.85))
    # what little gets out: a faint, short wave outside
    d = wave(PANES[0] - 6, 290, PANES[0] - 80, 290, 5, 2)
    s.a(f'<path d="{d}" fill="none" stroke="#ffb46a" stroke-width="3" opacity="0.35" stroke-linecap="round"/>')


def closeup(s):
    """A gap magnified: two panes, big slow krypton atoms, a warm wave fading as it tries to cross."""
    cx, cy, R = 270, 300, 150
    gx = (PANES[0] + PW + PANES[1]) / 2
    opening, closing = magnifier(s, "magW", cx, cy, R, COLOR, src=(gx, 300, 24), inner="#162038")
    body = [f'<rect x="{cx - R}" y="{cy - R}" width="70" height="{2 * R}" fill="url(#glassP)"/>',
            f'<rect x="{cx + R - 70}" y="{cy - R}" width="70" height="{2 * R}" fill="url(#glassP)"/>',
            f'<rect x="{cx - R + 66}" y="{cy - R}" width="4" height="{2 * R}" fill="#e8f4ff" opacity="0.6"/>',
            f'<rect x="{cx + R - 70}" y="{cy - R}" width="4" height="{2 * R}" fill="#ffd27a" opacity="0.7"/>',
            f'<rect x="{cx - R + 70}" y="{cy - R}" width="{2 * R - 140}" height="{2 * R}" fill="{KR}" opacity="0.1"/>']
    # the warm wave entering from the right pane and dying out
    pts = []
    for i in range(60):
        t = i / 59
        x = cx + R - 70 - t * 120
        pts.append((x, cy - 20 + math.sin(t * 5 * math.tau) * 12 * (1 - t)))
    body.append(f'<path d="{smooth(pts, closed=False)}" fill="none" stroke="#ffb46a" stroke-width="6" stroke-linecap="round" opacity="0.9"/>')
    for (x, y, ang) in [(cx - 40, cy - 78, 200), (cx + 20, cy + 10, 30), (cx - 30, cy + 80, 120), (cx + 40, cy - 94, 300),
                        (cx - 52, cy + 4, 80), (cx + 36, cy + 92, 250)]:
        body.append(streak(x, y, 24, ang, 14, "#bfefff", 0.5, 3) + glow(x, y, 30, KR, 0.3, "s8") + kball(x, y, 24, "Kr"))
    s.a(opening, "".join(body), closing)


def build():
    s = Svg("Kr", COLOR)
    kdefs(s)
    background(s, glows=[(1000, 260, 320, 0.5)], seed=95, stars=40, star_box=(0, 0, 470, 320), bokeh=3, wash=False)
    outside(s)
    room(s)
    wall(s)
    window(s)
    heat(s)
    closeup(s)
    finish(s)
    s.save("windows")


if __name__ == "__main__":
    build()
