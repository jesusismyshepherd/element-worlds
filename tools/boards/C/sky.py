"""Board 'sky': the Earth wrapped in a warm CO2 blanket (greenhouse effect), heat bouncing back, a thermometer."""
import math
from lib import Svg, f, mix, poly, smooth

C = "#ff8a5c"
s = Svg(C, seed=71)
s.background(focus=(600, 360), focus_r=640, strength=.34, stars=85, bokeh=4)

EX, EY, ER = 590, 366, 196
LON0, LAT0 = 8, 18


def proj(lon, lat):
    l, p = math.radians(lon - LON0), math.radians(lat)
    p0 = math.radians(LAT0)
    x = math.cos(p) * math.sin(l)
    y = math.cos(p0) * math.sin(p) - math.sin(p0) * math.cos(p) * math.cos(l)
    z = math.sin(p0) * math.sin(p) + math.cos(p0) * math.cos(p) * math.cos(l)
    if z < 0:  # behind: push onto the rim
        n = math.hypot(x, y) or 1
        x, y = x / n, y / n
    return EX + x * ER, EY - y * ER


def land(pts):
    dense = []
    for i in range(len(pts)):
        a, b = pts[i], pts[(i + 1) % len(pts)]
        for k in range(1):
            u = k / 1
            dense.append(proj(a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u))
    return smooth(dense, tension=.6)


AFRICA = [(-6, 35.8), (10, 37.2), (11, 33), (20, 30.5), (25, 31.5), (32, 31.2), (34, 28), (36, 22), (38.5, 18),
          (43.3, 12.5), (51, 11.8), (49, 7), (44, 1), (40, -3), (39.5, -7), (40.5, -11), (40.5, -15), (35, -20),
          (35.5, -24), (32.5, -28.5), (28, -33), (22, -34.5), (18.5, -34.2), (17.5, -30), (15, -26.5), (13, -22),
          (11.8, -17), (13.5, -11), (12, -5), (9, -1), (9.5, 3), (8.5, 4.5), (5, 6), (1, 5.8), (-3, 5), (-7.5, 4.4),
          (-11, 6.8), (-13.5, 9.5), (-16.8, 12.5), (-17.4, 14.7), (-16.5, 19.5), (-17, 21), (-15, 24), (-13, 27.5),
          (-9.8, 29.5), (-9.5, 32.5)]
MADAGASCAR = [(49.3, -12), (50.5, -15.5), (47.2, -25), (44, -24.5), (43.5, -20), (44.5, -16.5)]
EURASIA = [(-9.5, 37), (-6, 36.4), (-2, 36.8), (0, 39), (3.2, 42.2), (6, 43.1), (8.8, 44.4), (12, 42), (15.8, 38.3),
           (18.4, 40.1), (16, 41.6), (13.6, 43.6), (12.4, 45.4), (14.5, 45.2), (19.4, 41.9), (21.2, 38.3), (23, 36.5),
           (24.5, 38.3), (23.2, 40.2), (26.4, 40.5), (26.5, 39), (27.5, 37), (30.5, 36.3), (36, 36.6), (35.8, 34.5),
           (34.2, 31.3), (34.9, 29.5), (37, 25.5), (39, 21.5), (42.7, 16), (43.4, 12.7), (45, 12.8), (52, 15.5),
           (55.5, 17.5), (58.5, 20.5), (59.8, 22.5), (56.4, 26.4), (54, 24.2), (51.5, 25.5), (50, 26.5), (48, 29.5),
           (50.5, 30), (54.5, 26.8), (57.3, 25.7), (61.6, 25.2), (66.5, 25.4), (68.5, 23.5), (72.6, 21.5), (72.9, 19),
           (74.5, 15), (76.5, 9.2), (77.5, 8.1), (79.8, 10.3), (80.2, 13.5), (82.3, 17), (86.5, 20), (88.5, 21.8),
           (91.8, 22.4), (94.3, 18), (97.6, 16.5), (100, 30), (100, 72), (80, 73), (68, 69), (60, 68.5), (50, 68),
           (40, 66.5), (33, 69.2), (28, 71), (20, 70), (14, 68), (10.5, 64), (5, 62), (5.5, 58.5), (8, 58), (10.5, 59.3),
           (11, 58.5), (12.5, 56), (10.6, 57.7), (8.5, 57), (8.1, 55.5), (8.6, 53.9), (7, 53.5), (4.8, 52.9), (3.5, 51.4),
           (1.6, 50.9), (-1.4, 49.6), (-4.6, 48.4), (-1.2, 46.2), (-1.4, 44), (-1.8, 43.4), (-8, 43.7), (-9.3, 43),
           (-8.8, 41.5), (-9.5, 39)]
BRITAIN = [(-5.7, 50), (1.4, 51.2), (1.7, 52.7), (0, 53.5), (-1.6, 55.6), (-2, 57.5), (-3.5, 58.6), (-5, 58.6),
           (-6.2, 56.5), (-4.8, 55), (-3, 53.8), (-4.6, 53.3), (-4.5, 51.7)]
IRELAND = [(-6, 52.2), (-6.2, 54), (-7.5, 55.2), (-10, 54.2), (-10.2, 51.7), (-8, 51.6)]
SAMERICA = [(-35, -5.5), (-37, -10), (-39, -14), (-39.5, -18), (-41, -22), (-44, -23), (-48.5, -26), (-48.7, -28.5),
            (-51, -31), (-53, -33.8), (-57, -35), (-57.5, -38), (-62, -39), (-65, -41), (-65, -45), (-68, -50),
            (-70, -53), (-75, -50), (-75, -40), (-73.5, -30), (-70.5, -18), (-76, -13.5), (-80.5, -5.5), (-80, 0),
            (-77.5, 7.5), (-75, 10.5), (-71.5, 12), (-68, 10.5), (-62, 10.7), (-60, 8.5), (-57, 6), (-52, 5), (-50, 2),
            (-50, -.5), (-44, -2.5), (-40, -2.8)]
GREENLAND = [(-73, 78), (-60, 82), (-30, 83), (-20, 81), (-18, 75), (-22, 70), (-32, 68), (-40, 65), (-43, 60),
             (-48, 61), (-52, 65), (-54, 69), (-56, 74), (-66, 76.5)]
NAMERICA = [(-52.6, 47.5), (-56, 51.5), (-61, 56), (-64.5, 60.3), (-70, 61), (-78, 62.5), (-82, 60), (-82, 30),
            (-81, 25), (-80, 31.5), (-76, 35), (-74, 40.5), (-70, 41.5), (-66, 44.5), (-61, 45.5)]
LANDS = [AFRICA, MADAGASCAR, EURASIA, BRITAIN, IRELAND, SAMERICA, GREENLAND, NAMERICA]

# ------------------------------------------------------------------ the sun (top left) and its light
SX, SY = 128, 118
s.rad("sunHalo", [(0, "#ffe680", .7), (.4, "#ffc94d", .25), (1, "#ffc94d", 0)])
s.add(f'<circle cx="{SX}" cy="{SY}" r="160" fill="url(#sunHalo)"/>')
s.rad("sunG", [(0, "#fffbe0"), (.6, "#ffe066"), (1, "#ffb300")], cx=.42, cy=.4, r=.6)
s.add(f'<circle cx="{SX}" cy="{SY}" r="54" fill="url(#sunG)" filter="url(#glow)"/>')

# ------------------------------------------------------------------ the warm blanket (behind the globe)
BR_IN, BR_OUT = ER + 6, ER + 66
s.rad("blanket", [(0, C, 0), (ER / BR_OUT, "#ffb36b", .95), ((ER + 36) / BR_OUT, C, .7), (1, "#ff6a3c", 0)],
      cx=EX, cy=EY, r=BR_OUT, user=True)
s.add(f'<circle cx="{EX}" cy="{EY}" r="{BR_OUT + 30}" fill="{C}" opacity=".35" filter="url(#blur30)"/>')
s.add(f'<circle cx="{EX}" cy="{EY}" r="{BR_OUT}" fill="url(#blanket)"/>')
# quilted look: a wavy stitched hem
hem = []
for i in range(73):
    a = 2 * math.pi * i / 72
    r = ER + 50 + 4 * math.sin(a * 12)
    hem.append((EX + r * math.cos(a), EY + r * math.sin(a)))
s.add(f'<path d="{smooth(hem[:-1])}" fill="none" stroke="#ffe0c2" stroke-width="3.5" stroke-dasharray="10 9" '
      f'stroke-linecap="round" opacity=".75"/>')

# ------------------------------------------------------------------ the globe
s.rad("ocean", [(0, "#5cc2ff"), (.55, "#1f78d1"), (1, "#0b3a85")], cx=.4, cy=.36, r=.7)
s.add(f'<circle cx="{EX}" cy="{EY}" r="{ER}" fill="url(#ocean)"/>')
s.add_def("globe", f'<clipPath id="globe"><circle cx="{EX}" cy="{EY}" r="{ER}"/></clipPath>')
land_d = "".join(land(p) for p in LANDS)
s.add_def("landClip", f'<clipPath id="landClip"><path d="{land_d}"/></clipPath>')
s.lin("landG", [(0, "#8fe07a"), (1, "#2f9a45")], x1=0, y1=0, x2=.4, y2=1)
s.add(f'<g clip-path="url(#globe)"><g clip-path="url(#landClip)"><rect x="{EX - ER}" y="{EY - ER}" width="{2 * ER}" height="{2 * ER}" fill="url(#landG)"/></g>')
# deserts (Sahara, Arabia) in sand colour, clipped to the land
desert = [proj(lon, lat) for lon, lat in ((-16, 16), (35, 15), (56, 17), (56, 28), (40, 31), (10, 31), (-10, 29))]
s.add(f'<g clip-path="url(#landClip)"><path d="{smooth(desert)}" fill="#f2d28b" opacity=".85"/></g>')
# arctic ice
cap = [proj(lon, 74 + 3 * math.sin(lon / 25)) for lon in range(-100, 121, 8)]
s.add(f'<path d="{smooth(cap, closed=False)} L{f(EX + ER)} {f(EY - ER)} L{f(EX - ER)} {f(EY - ER)}Z" fill="#f4fbff" opacity=".95"/>')
# clouds
for (lon, lat, w, h) in ((-30, 30, 22, 5), (20, 52, 26, 4), (-5, -15, 20, 4), (55, -5, 18, 4), (-35, -30, 16, 4),
                         (30, 10, 10, 3)):
    cx, cy = proj(lon, lat)
    s.add(f'<ellipse cx="{f(cx)}" cy="{f(cy)}" rx="{w * 2.2}" ry="{h * 2.2}" fill="#ffffff" opacity=".75"/>')
s.add("</g>")
# day/night shading and rim light
s.rad("globeShade", [(0, "#ffffff", .25), (.45, "#ffffff", 0), (.85, "#06122e", .35), (1, "#06122e", .65)],
      cx=.36, cy=.32, r=.75)
s.add(f'<circle cx="{EX}" cy="{EY}" r="{ER}" fill="url(#globeShade)"/>')
s.add(f'<circle cx="{EX}" cy="{EY}" r="{ER}" fill="none" stroke="#bfe6ff" stroke-width="3" opacity=".7"/>')


# ------------------------------------------------------------------ things standing on the globe
def on_globe(deg, inner_svg, scale=1.0):
    """Place a group standing upright on the globe at screen angle deg (0 = right, 90 = top)."""
    a = math.radians(deg)
    x, y = EX + (ER - 3) * math.cos(a), EY - (ER - 3) * math.sin(a)
    rot = 90 - deg
    s.add(f'<g transform="translate({f(x)} {f(y)}) rotate({f(rot)}) scale({scale})">{inner_svg}</g>')


factory = (
    '<path d="M-46 0V-34L-30 -44V-34L-14 -44V-34L2 -44V-34L18 -44V0Z" fill="#8a93a8"/>'
    '<path d="M-46 0V-34L-30 -44V-34L-14 -44V-34L2 -44V-34L18 -44V0Z" fill="none" stroke="#5b6274" stroke-width="2"/>'
    '<rect x="22" y="-74" width="12" height="74" fill="#6f7890"/><rect x="38" y="-60" width="10" height="60" fill="#6f7890"/>'
    '<rect x="22" y="-74" width="12" height="7" fill="#ff6a4d"/><rect x="38" y="-60" width="10" height="6" fill="#ff6a4d"/>'
    '<g fill="#ffd36b"><rect x="-38" y="-24" width="9" height="9"/><rect x="-22" y="-24" width="9" height="9"/>'
    '<rect x="-6" y="-24" width="9" height="9"/></g>'
    '<g fill="#9aa2b4" opacity=".85"><circle cx="30" cy="-88" r="10"/><circle cx="38" cy="-104" r="13"/>'
    '<circle cx="48" cy="-124" r="16"/><circle cx="45" cy="-74" r="8"/><circle cx="52" cy="-90" r="11"/></g>'
)
car = (
    '<path d="M-26 -8C-26 -16 -20 -18 -14 -19L-8 -28H12L20 -19C26 -18 28 -15 28 -8V-4H-26Z" fill="#4d7dff"/>'
    '<path d="M-5 -25H3V-19H-11ZM6 -25H11L16 -19H6Z" fill="#cfe6ff"/>'
    '<circle cx="-14" cy="-4" r="6" fill="#1b2250"/><circle cx="16" cy="-4" r="6" fill="#1b2250"/>'
    '<g fill="#9aa2b4" opacity=".8"><circle cx="-34" cy="-8" r="5"/><circle cx="-43" cy="-13" r="7"/></g>'
)
turbine = (
    '<path d="M-3 0L-1.5 -78H1.5L3 0Z" fill="#f4f6fb"/>'
    '<g transform="translate(0 -80)"><g fill="#ffffff">'
    '<path d="M0 0L-4 -40Q0 -46 4 -40Z"/><path d="M0 0L-4 -40Q0 -46 4 -40Z" transform="rotate(120)"/>'
    '<path d="M0 0L-4 -40Q0 -46 4 -40Z" transform="rotate(240)"/></g><circle r="5" fill="#cfd6e8"/></g>'
)
tree = (
    '<rect x="-4" y="-26" width="8" height="26" fill="#8a5a2e"/>'
    '<circle cy="-40" r="20" fill="#3fbf5a"/><circle cx="-12" cy="-30" r="13" fill="#34a84e"/>'
    '<circle cx="12" cy="-30" r="13" fill="#34a84e"/><circle cx="-6" cy="-46" r="7" fill="#8fe07a" opacity=".6"/>'
)
panel = (
    '<path d="M-2 0V-12H2V0Z" fill="#cfd6e8"/><path d="M-20 -12L-14 -28H18L12 -12Z" fill="#2f5fd0" stroke="#cfe6ff" stroke-width="2"/>'
    '<path d="M-17 -20H15M-4 -28L-6 -12M8 -28L6 -12" stroke="#cfe6ff" stroke-width="1.5"/>'
)
on_globe(140, factory)
on_globe(118, car)
on_globe(66, tree)
on_globe(50, turbine)
on_globe(80, turbine, .8)
on_globe(36, panel)

# CO2 molecules floating in the blanket


def co2(x, y, ang, r=10):
    a = math.radians(ang)
    d = r * 1.75
    s.ball(x - d * math.cos(a), y - d * math.sin(a), r * .88, "O")
    s.ball(x + d * math.cos(a), y + d * math.sin(a), r * .88, "O")
    s.ball(x, y, r, "C")


for deg in (158, 200, 252, 300, 348, 100):
    a = math.radians(deg)
    rr = ER + 36
    co2(EX + rr * math.cos(a), EY - rr * math.sin(a), math.degrees(math.atan2(-math.cos(a), -math.sin(a))), 9.5)

# ------------------------------------------------------------------ light in, heat bouncing back
def arrow_head(x, y, ang, size, col):
    pts = [(x + size * math.cos(ang), y + size * math.sin(ang)),
           (x + size * .8 * math.cos(ang + 2.5), y + size * .8 * math.sin(ang + 2.5)),
           (x + size * .8 * math.cos(ang - 2.5), y + size * .8 * math.sin(ang - 2.5))]
    s.add(f'<path d="{poly(pts)}" fill="{col}"/>')


# sunlight: straight yellow arrows into the globe
for (tx, ty) in ((414, 392), (446, 462)):
    a = math.atan2(ty - SY, tx - SX)
    x0, y0 = SX + 68 * math.cos(a), SY + 68 * math.sin(a)
    s.add(f'<line x1="{f(x0)}" y1="{f(y0)}" x2="{f(tx - 14 * math.cos(a))}" y2="{f(ty - 14 * math.sin(a))}" stroke="#ffe680" '
          f'stroke-width="7" stroke-linecap="round" filter="url(#glowS)"/>')
    arrow_head(tx - 14 * math.cos(a), ty - 14 * math.sin(a), a, 20, "#ffe680")


# heat: wavy red arrows from the ground up into the blanket, turning back down
def bounce(deg, spread=16):
    """heat leaves the ground as a wave, hits the blanket and turns back down."""
    a0 = math.radians(deg)
    a1 = math.radians(deg + spread)
    top = ER + 54
    pts = []
    # out: a wavy radial line
    for i in range(31):
        t = i / 30
        r = ER + 4 + (top - ER - 4) * t
        w = .045 * math.sin(t * 5 * math.pi) * (1 - t)
        pts.append((EX + r * math.cos(a0 + w), EY - r * math.sin(a0 + w)))
    # turn along the blanket
    for i in range(1, 13):
        t = i / 12
        a = a0 + (a1 - a0) * t
        r = top + 6 * math.sin(math.pi * t)
        pts.append((EX + r * math.cos(a), EY - r * math.sin(a)))
    # back down
    for i in range(1, 15):
        t = i / 14
        r = top - (top - ER - 16) * t
        pts.append((EX + r * math.cos(a1), EY - r * math.sin(a1)))
    d = smooth(pts, closed=False)
    s.add(f'<path d="{d}" stroke="#ff4a2a" stroke-width="11" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity=".45" filter="url(#blur4)"/>')
    s.add(f'<path d="{d}" stroke="#ff5a36" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>')
    s.add(f'<path d="{d}" stroke="#ffd2b0" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity=".8"/>')
    (x1, y1), (x2, y2) = pts[-3], pts[-1]
    arrow_head(x2, y2, math.atan2(y2 - y1, x2 - x1), 17, "#ff5a36")


for deg in (170, 214, 266, 314, 4):
    bounce(deg, 18)
# one heat arrow escaping to space (thin)
a = math.radians(-20)
x0, y0 = EX + (ER + 8) * math.cos(a), EY - (ER + 8) * math.sin(a)
s.add(f'<path d="M{f(x0)} {f(y0)}l{f(110 * math.cos(a))} {f(-110 * math.sin(a))}" stroke="#ffb08a" stroke-width="3" '
      f'stroke-dasharray="6 7" stroke-linecap="round" opacity=".7"/>')

# ------------------------------------------------------------------ thermometer
TX, TTOP, TBOT = 1012, 120, 500
s.add(f'<rect x="{TX - 26}" y="{TTOP - 10}" width="52" height="{TBOT - TTOP + 20}" rx="26" fill="#ffffff" opacity=".12"/>')
s.add(f'<rect x="{TX - 17}" y="{TTOP}" width="34" height="{TBOT - TTOP}" rx="17" fill="#eef3ff" stroke="#ffffff" stroke-width="4"/>')
s.add(f'<circle cx="{TX}" cy="{TBOT + 12}" r="36" fill="#eef3ff" stroke="#ffffff" stroke-width="4"/>')
s.lin("merc", [(0, "#ffb347"), (1, "#ff3b30")], x1=0, y1=0, x2=0, y2=1)
lvl = TTOP + (TBOT - TTOP) * .3
s.add(f'<rect x="{TX - 9}" y="{f(lvl)}" width="18" height="{f(TBOT - lvl + 20)}" rx="9" fill="url(#merc)"/>')
s.add(f'<circle cx="{TX}" cy="{TBOT + 12}" r="26" fill="#ff3b30"/>')
s.add(f'<circle cx="{TX - 8}" cy="{TBOT + 4}" r="7" fill="#fff" opacity=".5"/>')
s.add('<g stroke="#9aa6c8" stroke-width="3" stroke-linecap="round">' +
      "".join(f'<line x1="{TX + 17}" y1="{y}" x2="{TX + (30 if i % 2 == 0 else 25)}" y2="{y}"/>'
              for i, y in enumerate(range(TTOP + 30, TBOT, 36))) + '</g>')
# rising arrow beside it
s.add(f'<path d="M{TX - 58} {TBOT - 40}V{TTOP + 90}" stroke="{C}" stroke-width="8" stroke-linecap="round"/>')
arrow_head(TX - 58, TTOP + 80, -math.pi / 2, 22, C)

for (x, y, sz) in ((EX + 250, EY - 250, 12), (EX + 300, EY - 140, 9), (EX - 290, EY - 210, 10)):
    s.sparkle(x, y, sz, "#ffffff", .85)

s.calm_bottom(615)
s.save("sky")
