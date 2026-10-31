"""Board 'water': the Sahara at dusk, cut open. Above, dunes and an oasis with palms where a well brings up
water to a green field. Below, the ground in section: sand, then a thick layer of sandstone soaked with water
like a sponge, then dark bedrock; a dashed path shows the water's slow journey north from where it fell as
rain long ago (a faded window onto the green Sahara: a rain cloud, an acacia and a giraffe). A close-up of
the well's water: water molecules and krypton atoms, and one rare krypton-81 caught glowing where three
laser beams cross."""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from krkit import *  # noqa: E402,F401

COLOR = "#35d3c0"
SURF = 318      # the ground's surface (dunes rise above it)
AQ0, AQ1 = 392, 540  # the water-bearing sandstone
WELL = 930


def sky_and_dunes(s):
    s.d(lin("dusk", [(0, "#14284a", 0), (0.6, "#ff9a5a", 0.18), (1, "#ffb86a", 0.3)], x1=0, y1=0, x2=0, y2=1),
        lin("dune", [(0, "#c8905a"), (1, "#8a5a32")], x1=0, y1=0, x2=0, y2=1),
        lin("dune2", [(0, "#a8744a"), (1, "#6a4426")], x1=0, y1=0, x2=0, y2=1))
    s.a(f'<rect x="0" y="0" width="1200" height="{SURF}" fill="url(#dusk)"/>')
    # a thin crescent moon
    s.a(f'<circle cx="1080" cy="80" r="22" fill="#f4e6c8"/>', f'<circle cx="1090" cy="74" r="20" fill="#24385a"/>')
    # far dunes, then near ones
    s.a(f'<path d="M0,{SURF - 40} Q160,{SURF - 86} 330,{SURF - 44} T680,{SURF - 50} T1000,{SURF - 62} T1200,{SURF - 40} '
        f'L1200,{SURF} L0,{SURF} Z" fill="url(#dune2)" opacity="0.85"/>')
    s.a(f'<path d="M0,{SURF - 6} Q240,{SURF - 52} 470,{SURF - 10} T900,{SURF - 18} T1200,{SURF - 8} L1200,{SURF + 8} L0,{SURF + 8} Z" '
        'fill="url(#dune)"/>')


def oasis(s):
    """Palms by a pool, the well head with its pipe, a green field watered from it."""
    s.d(lin("pool", [(0, "#4ad8d0"), (1, "#1a7a8a")], x1=0, y1=0, x2=0, y2=1))
    s.a(f'<ellipse cx="1020" cy="{SURF - 4}" rx="90" ry="14" fill="url(#pool)"/>',
        f'<ellipse cx="1020" cy="{SURF - 7}" rx="60" ry="5" fill="#bff4ee" opacity="0.35"/>')
    # a field of green in neat rows
    for k in range(6):
        s.a(f'<rect x="{770 + k * 20}" y="{SURF - 10}" width="14" height="10" rx="4" fill="#4cb84a"/>')
    # palms
    for (x, h, lean) in [(1080, 150, 12), (1130, 120, -10), (990, 132, -16)]:
        top = (x + lean, SURF - h)
        s.a(f'<path d="M{x},{SURF - 2} Q{x + lean * 0.2},{SURF - h * 0.5} {top[0]},{top[1]}" fill="none" stroke="#6a4a2a" stroke-width="9" '
            'stroke-linecap="round"/>')
        for a in range(7):
            ang = math.radians(-180 + a * 30 + (8 if a % 2 else -6))
            ex, ey = top[0] + math.cos(ang) * 58, top[1] + math.sin(ang) * 30 + 18
            s.a(f'<path d="M{top[0]},{top[1]} Q{f((top[0] + ex) / 2)},{f(top[1] - 18)} {f(ex)},{f(ey)}" fill="none" stroke="#2f8a3a" '
                'stroke-width="9" stroke-linecap="round"/>')
    # the well head: a small concrete block, a pipe spout pouring into a channel to the field
    s.a(f'<rect x="{WELL - 22}" y="{SURF - 40}" width="44" height="40" rx="4" fill="#a8a094"/>',
        f'<rect x="{WELL - 30}" y="{SURF - 46}" width="60" height="10" rx="3" fill="#8a8276"/>',
        f'<path d="M{WELL - 22},{SURF - 30} L{WELL - 52},{SURF - 30} L{WELL - 52},{SURF - 20}" fill="none" stroke="#6a6a7a" stroke-width="8"/>',
        f'<path d="M{WELL - 52},{SURF - 16} q-4,8 -2,14" fill="none" stroke="#7ae8e0" stroke-width="5" stroke-linecap="round"/>',
        f'<rect x="770" y="{SURF - 2}" width="{WELL - 820}" height="5" fill="#4ad8d0" opacity="0.8"/>')


def ground(s):
    """The section: sand, the water-soaked sandstone with its pores, the bedrock; the shaft of the well."""
    s.d(lin("sandS", [(0, "#a87a4a"), (1, "#7a5432")], x1=0, y1=0, x2=0, y2=1),
        lin("stone", [(0, "#8a4a3a"), (1, "#5a2c26")], x1=0, y1=0, x2=0, y2=1),
        lin("bed", [(0, "#3a2c3a"), (1, "#1a1422")], x1=0, y1=0, x2=0, y2=1))
    s.a(f'<rect x="0" y="{SURF + 4}" width="1200" height="{AQ0 - SURF - 4}" fill="url(#sandS)"/>',
        f'<rect x="0" y="{AQ0}" width="1200" height="{AQ1 - AQ0}" fill="url(#stone)"/>',
        f'<rect x="0" y="{AQ1}" width="1200" height="{800 - AQ1}" fill="url(#bed)"/>')
    # the sandstone as a sponge: water (teal) everywhere between packed reddish grains
    s.a(f'<rect x="0" y="{AQ0}" width="1200" height="{AQ1 - AQ0}" fill="#1f8a86"/>',
        f'<rect x="0" y="{AQ0}" width="1200" height="{AQ1 - AQ0}" fill="{COLOR}" opacity="0.25"/>')
    r = rng(81)
    grains = []
    y = AQ0 + 8
    row = 0
    while y < AQ1 - 4:
        x = -10 + (row % 2) * 9
        while x < 1210:
            rr = r.uniform(6.5, 9.5)
            grains.append(f'<circle cx="{f(x + r.uniform(-2, 2))}" cy="{f(y + r.uniform(-2, 2))}" r="{f(rr)}" '
                          f'fill="{r.choice(["#9a5240", "#a85e48", "#8a4636", "#b06a4e"])}"/>')
            x += 19 + r.uniform(-1.5, 2.5)
        y += 16.5
        row += 1
    s.a("<g>" + "".join(grains) + "</g>")
    # glints of water between the grains
    for _ in range(140):
        x, y = r.uniform(0, 1200), r.uniform(AQ0 + 6, AQ1 - 6)
        s.a(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r.uniform(1.5, 2.6))}" fill="#9ff4ea" opacity="{r.uniform(0.5, 0.9):.2f}"/>')
    # sand grains and bedding lines
    for _ in range(80):
        x, y = r.uniform(0, 1200), r.uniform(SURF + 10, AQ0 - 6)
        s.a(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r.uniform(1.5, 3))}" fill="#c89a62" opacity="0.5"/>')
    s.a(f'<path d="M0,{AQ0} L1200,{AQ0}" stroke="#c87a5a" stroke-width="3" opacity="0.6"/>',
        f'<path d="M0,{AQ1} L1200,{AQ1}" stroke="#2a1a24" stroke-width="4"/>')
    # the well's shaft down into the water
    s.a(f'<rect x="{WELL - 9}" y="{SURF}" width="18" height="{AQ0 - SURF + 70}" fill="#3a3a4a"/>',
        f'<rect x="{WELL - 5}" y="{SURF}" width="10" height="{AQ0 - SURF + 70}" fill="#7ae8e0" opacity="0.55"/>')
    # the water's slow way north: from where the rain soaked in, along the sandstone, to the well
    s.a(arrow([(150, SURF + 10), (190, AQ0 + 20), (330, AQ0 + 70), (560, AQ0 + 80), (780, AQ0 + 76), (WELL - 26, AQ0 + 72)],
              "#bff4ee", 5, op=0.85, dash="14 10"))


def past(s):
    """A faded window onto the green Sahara long ago: rain over grass, an acacia, a giraffe."""
    cx, cy, rx, ry = 190, 150, 160, 108
    s.d(f'<clipPath id="pastC"><ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}"/></clipPath>',
        lin("pastSky", [(0, "#5a7aa0"), (1, "#a8c0b0")], x1=0, y1=0, x2=0, y2=1))
    body = [f'<rect x="{cx - rx}" y="{cy - ry}" width="{2 * rx}" height="{2 * ry}" fill="url(#pastSky)"/>',
            f'<path d="M{cx - rx},{cy + 40} Q{cx - 40},{cy + 10} {cx + 60},{cy + 34} T{cx + rx},{cy + 30} L{cx + rx},{cy + ry} L{cx - rx},{cy + ry} Z" '
            'fill="#5aa84a"/>',
            f'<path d="M{cx - rx},{cy + 62} Q{cx},{cy + 44} {cx + rx},{cy + 66} L{cx + rx},{cy + ry} L{cx - rx},{cy + ry} Z" fill="#3a8a3a"/>']
    # a rain cloud and its rain
    for (x, y, r_) in [(cx - 60, cy - 54, 30), (cx - 26, cy - 66, 38), (cx + 14, cy - 56, 30), (cx - 30, cy - 44, 34)]:
        body.append(f'<circle cx="{x}" cy="{y}" r="{r_}" fill="#7a88a0"/>')
    for k in range(12):
        x = cx - 86 + k * 11
        body.append(f'<line x1="{x}" y1="{cy - 26}" x2="{x - 8}" y2="{cy + 30}" stroke="#cfe0ff" stroke-width="2.4" opacity="0.7"/>')
    # an acacia: a flat crown on a thin trunk
    ax, ay = cx + 92, cy + 34
    body.append(f'<path d="M{ax},{ay} L{ax - 4},{ay - 44}" stroke="#4a3220" stroke-width="5"/>'
                f'<ellipse cx="{ax - 4}" cy="{ay - 50}" rx="40" ry="11" fill="#2f7a34"/>')
    # a giraffe
    gx, gy = cx + 30, cy + 46
    body.append(f'<ellipse cx="{gx}" cy="{gy - 26}" rx="18" ry="10" fill="#d8a04a"/>'
                f'<path d="M{gx + 12},{gy - 30} L{gx + 22},{gy - 70}" stroke="#d8a04a" stroke-width="7" stroke-linecap="round"/>'
                f'<ellipse cx="{gx + 26}" cy="{gy - 72}" rx="8" ry="5" fill="#d8a04a"/>')
    for lx in (gx - 12, gx - 4, gx + 6, gx + 14):
        body.append(f'<line x1="{lx}" y1="{gy - 20}" x2="{lx}" y2="{gy + 4}" stroke="#c8903a" stroke-width="4"/>')
    for (px, py) in ((gx - 6, gy - 28), (gx + 6, gy - 24), (gx + 16, gy - 46)):
        body.append(f'<circle cx="{px}" cy="{py}" r="3" fill="#8a5a22"/>')
    s.a(f'<g opacity="0.7"><g clip-path="url(#pastC)">' + "".join(body) + "</g></g>",
        f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="none" stroke="#bff4ee" stroke-width="4" stroke-dasharray="10 8" opacity="0.8"/>')
    # rain soaking down from the window to the ground
    s.a(arrow([(cx - 40, cy + ry - 6), (150, SURF - 20), (150, SURF + 8)], "#bff4ee", 5, op=0.85, dash="14 10"))


def closeup(s):
    """The well's water magnified: water molecules, krypton atoms, one krypton-81 caught by crossed lasers."""
    cx, cy, R = 600, 172, 140
    opening, closing = magnifier(s, "magA", cx, cy, R, COLOR, src=(WELL, AQ0 + 40, 22), inner="#11263a")
    body = []
    r = rng(229)
    for _ in range(14):
        x, y = cx + r.uniform(-R, R), cy + r.uniform(-R, R)
        if math.hypot(x - cx, y - cy) < 60:
            continue
        body.append(h2o(x, y, 14, r.uniform(0, 360), op=0.75))
    for (x, y) in ((cx - 92, cy + 58), (cx + 88, cy - 70), (cx + 100, cy + 62)):
        body.append(kball(x, y, 18, "Kr", op=0.9))
    # three laser beams crossing at the centre, the caught atom glowing there
    for ang in (0, 60, 120):
        a = math.radians(ang)
        dx, dy = math.cos(a) * R, math.sin(a) * R
        body.append(f'<line x1="{f(cx - dx)}" y1="{f(cy - dy)}" x2="{f(cx + dx)}" y2="{f(cy + dy)}" stroke="#ff4a6a" stroke-width="10" '
                    'opacity="0.25" filter="url(#s2)"/>'
                    f'<line x1="{f(cx - dx)}" y1="{f(cy - dy)}" x2="{f(cx + dx)}" y2="{f(cy + dy)}" stroke="#ff7a90" stroke-width="3" opacity="0.8"/>')
    body.append(glow(cx, cy, 44, "#ffb84a", 0.75, "s8"))
    body.append(kball(cx, cy, 22, gid="kKrHot"))
    for k in range(8):
        a = math.radians(k * 45 + 22)
        body.append(f'<line x1="{f(cx + math.cos(a) * 30)}" y1="{f(cy + math.sin(a) * 30)}" x2="{f(cx + math.cos(a) * 42)}" '
                    f'y2="{f(cy + math.sin(a) * 42)}" stroke="#ffd08a" stroke-width="3" stroke-linecap="round" opacity="0.85"/>')
    s.a(opening, "".join(body), closing)


def build():
    s = Svg("Kr", COLOR)
    kdefs(s)
    background(s, glows=[(600, 170, 260, 0.45)], seed=81, stars=70, star_box=(0, 0, 1200, 240), bokeh=2)
    sky_and_dunes(s)
    past(s)
    ground(s)
    oasis(s)
    closeup(s)
    finish(s)
    s.save("water")


if __name__ == "__main__":
    build()
