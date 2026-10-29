"""Board 'leaf': photosynthesis. CO2 in, O2 out, sunlight, a sugar ring inside the leaf."""
import math
from lib import Svg, f, mix, poly, smooth

C = "#8be37a"
s = Svg(C, seed=37)
s.background(focus=(640, 330), focus_r=680, strength=.40, stars=70, bokeh=6)

# ------------------------------------------------------------------ hills and trees far away (calm band)
s.add(f'<path d="M0 640C180 590 330 600 470 625S800 600 960 585S1130 600 1200 590V800H0Z" fill="#12361f" opacity=".75"/>')
s.add(f'<path d="M0 680C220 650 420 670 640 660S1000 640 1200 655V800H0Z" fill="#0d2617" opacity=".9"/>')


def tree(x, y, h, col, op):
    s.add(f'<g opacity="{op}"><rect x="{f(x - h * .05)}" y="{f(y - h * .45)}" width="{f(h * .1)}" height="{f(h * .45)}" fill="{mix(col, "#000000", .3)}"/>'
          f'<circle cx="{f(x)}" cy="{f(y - h * .62)}" r="{f(h * .3)}" fill="{col}"/>'
          f'<circle cx="{f(x - h * .2)}" cy="{f(y - h * .5)}" r="{f(h * .22)}" fill="{col}"/>'
          f'<circle cx="{f(x + h * .2)}" cy="{f(y - h * .5)}" r="{f(h * .22)}" fill="{col}"/></g>')


tree(1060, 600, 150, "#1f5a2c", .9)
tree(1130, 598, 95, "#1a4d26", .8)
tree(90, 640, 110, "#1a4d26", .8)

# ------------------------------------------------------------------ the sun
SX, SY = 150, 132
s.rad("sunG", [(0, "#fffbe0"), (.55, "#ffe066"), (1, "#ffb300")], cx=.42, cy=.4, r=.6)
s.rad("sunHalo", [(0, "#ffe066", .65), (.4, "#ffd23f", .25), (1, "#ffd23f", 0)])
s.add(f'<circle cx="{SX}" cy="{SY}" r="190" fill="url(#sunHalo)"/>')
rays = []
for k in range(14):
    a = 2 * math.pi * k / 14 + .1
    r1, r2 = 78, 112 if k % 2 else 98
    w = 9 if k % 2 else 6
    rays.append(f'<line x1="{f(SX + r1 * math.cos(a))}" y1="{f(SY + r1 * math.sin(a))}" x2="{f(SX + r2 * math.cos(a))}" '
                f'y2="{f(SY + r2 * math.sin(a))}" stroke-width="{w}"/>')
s.add(f'<g stroke="#ffe680" stroke-linecap="round" opacity=".95">{"".join(rays)}</g>')
s.add(f'<circle cx="{SX}" cy="{SY}" r="64" fill="url(#sunG)" filter="url(#glow)"/>')
s.add(f'<ellipse cx="{SX - 20}" cy="{SY - 24}" rx="20" ry="12" fill="#fff" opacity=".6" transform="rotate(-30 {SX - 20} {SY - 24})"/>')

# ------------------------------------------------------------------ the leaf
BX, BY = 400, 486        # base
TX, TY = 948, 176        # tip
L = math.hypot(TX - BX, TY - BY)
ANG = math.degrees(math.atan2(TY - BY, TX - BX))
Wd = 300


def lp(x, y):
    """leaf-local (x along midrib from the base, y across) -> screen."""
    a = math.radians(ANG)
    return BX + x * math.cos(a) - y * math.sin(a), BY + x * math.sin(a) + y * math.cos(a)


s.lin("leafG", [(0, "#b8f27a"), (.45, "#5fcf4f"), (1, "#23843a")], x1=0, y1=0, x2=0, y2=1)
s.lin("leafG2", [(0, "#d8ff9e", .55), (1, "#d8ff9e", 0)], x1=0, y1=0, x2=1, y2=1)
s.add(f'<g transform="translate({BX} {BY}) rotate({f(ANG)})">')
leaf_d = (f"M0 0C{f(.12 * L)} {f(-.62 * Wd)} {f(.68 * L)} {f(-.52 * Wd)} {f(L)} 0"
          f"C{f(.7 * L)} {f(.5 * Wd)} {f(.14 * L)} {f(.6 * Wd)} 0 0Z")
s.add(f'<path d="{leaf_d}" fill="{C}" opacity=".45" filter="url(#blur16)"/>')
s.add(f'<path d="{leaf_d}" fill="url(#leafG)" stroke="#c9ff9a" stroke-width="4" stroke-linejoin="round"/>')
# lighter upper half
s.add(f'<path d="M0 0C{f(.12 * L)} {f(-.62 * Wd)} {f(.68 * L)} {f(-.52 * Wd)} {f(L)} 0Z" fill="url(#leafG2)"/>')
# veins
veins = [f'<path d="M-30 6Q{f(.5 * L)} -8 {f(.97 * L)} -1" stroke="#e9ffc9" stroke-width="7" fill="none" stroke-linecap="round"/>']
for i in range(1, 8):
    x = L * (.09 + .105 * i)
    reach = (1 - (x / L) ** 1.7) * .4 * Wd
    for sgn in (-1, 1):
        ex = x + .2 * L * (1 - x / L) + 30
        veins.append(f'<path d="M{f(x)} {f(-.3 * sgn)}Q{f(x + 30)} {f(sgn * reach * .6)} {f(ex)} {f(sgn * reach)}" '
                     f'stroke="#e9ffc9" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".7"/>')
s.add("".join(veins))
s.add("</g>")
# stem
sx0, sy0 = lp(-26, 6)
s.add(f'<path d="M{f(sx0)} {f(sy0)}C{f(sx0 - 40)} {f(sy0 + 40)} {f(sx0 - 40)} {f(sy0 + 90)} {f(sx0 - 70)} {f(sy0 + 128)}" '
      f'stroke="#4aa83f" stroke-width="13" fill="none" stroke-linecap="round"/>')

# ------------------------------------------------------------------ sunlight waves from the sun to the leaf
for k, (tx, ty) in enumerate(((560, 300), (640, 250), (520, 380))):
    x0, y0 = SX + 70 * math.cos(math.atan2(ty - SY, tx - SX)), SY + 70 * math.sin(math.atan2(ty - SY, tx - SX))
    dx, dy = tx - x0, ty - y0
    Ln = math.hypot(dx, dy)
    ux, uy = dx / Ln, dy / Ln
    nx, ny = -uy, ux
    pts = []
    n = 60
    for i in range(n + 1):
        t = i / n
        amp = 9 * math.sin(math.pi * min(1, t * 1.6))
        w = amp * math.sin(t * Ln / 22)
        pts.append((x0 + dx * t * .92 + nx * w, y0 + dy * t * .92 + ny * w))
    s.add(f'<path d="{smooth(pts, closed=False)}" stroke="#ffe680" stroke-width="5" fill="none" stroke-linecap="round" '
          f'filter="url(#glowS)" opacity=".95"/>')
    ex, ey = pts[-1]
    a = math.atan2(uy, ux)
    ah = [(ex + 16 * math.cos(a), ey + 16 * math.sin(a)),
          (ex + 13 * math.cos(a + 2.4), ey + 13 * math.sin(a + 2.4)),
          (ex + 13 * math.cos(a - 2.4), ey + 13 * math.sin(a - 2.4))]
    s.add(f'<path d="{poly(ah)}" fill="#ffe680"/>')

# ------------------------------------------------------------------ molecules
R_O, R_C = 21, 23


def co2(x, y, ang, scale=1.0, op=1.0):
    a = math.radians(ang)
    d = 37 * scale
    s.ball(x - d * math.cos(a), y - d * math.sin(a), R_O * scale, "O", opacity=op)
    s.ball(x + d * math.cos(a), y + d * math.sin(a), R_O * scale, "O", opacity=op)
    s.ball(x, y, R_C * scale, "C", opacity=op)


def o2(x, y, ang, scale=1.0, op=1.0):
    a = math.radians(ang)
    d = 17 * scale
    s.ball(x - d * math.cos(a), y - d * math.sin(a), R_O * scale, "O", opacity=op)
    s.ball(x + d * math.cos(a), y + d * math.sin(a), R_O * scale, "O", opacity=op)


def h2o(x, y, ang, scale=1.0):
    a = math.radians(ang)
    half = math.radians(104.5 / 2)
    d = 25 * scale
    for sg in (-1, 1):
        s.ball(x + d * math.cos(a + sg * half), y + d * math.sin(a + sg * half), 12 * scale, "H")
    s.ball(x, y, 19 * scale, "O")


def trail(pts, col, op=.7, arrow=True):
    s.add(f'<path d="{smooth(pts, closed=False)}" stroke="{col}" stroke-width="5" stroke-dasharray="2 12" '
          f'stroke-linecap="round" fill="none" opacity="{op}"/>')
    if arrow:
        (x1, y1), (x2, y2) = pts[-2], pts[-1]
        a = math.atan2(y2 - y1, x2 - x1)
        ah = [(x2 + 18 * math.cos(a), y2 + 18 * math.sin(a)),
              (x2 + 14 * math.cos(a + 2.5), y2 + 14 * math.sin(a + 2.5)),
              (x2 + 14 * math.cos(a - 2.5), y2 + 14 * math.sin(a - 2.5))]
        s.add(f'<path d="{poly(ah)}" fill="{col}" opacity="{min(1, op + .2)}"/>')


# CO2 flowing in from the left and below
IN = "#d9dee9"
trail([(150, 318), (250, 350), (360, 366), (440, 358)], IN)
co2(146, 316, -12)
trail([(238, 432), (330, 440), (420, 425), (480, 405)], IN)
co2(222, 434, 8, .92)
trail([(150, 540), (260, 540), (380, 520), (480, 470)], IN, .6)
co2(128, 545, -6, .82, .95)

# O2 leaving up and to the right
OUT = "#ffb0b0"
trail([(820, 330), (900, 360), (980, 360), (1040, 330)], OUT)
o2(1078, 318, -20)
trail([(870, 250), (950, 250), (1010, 220), (1050, 180)], OUT)
o2(1084, 150, -40, .95)
trail([(780, 412), (860, 450), (940, 470), (990, 462)], OUT, .6)
o2(1030, 452, 10, .9)

# water rising up the stem
h2o(sx0 - 112, sy0 + 92, -90, .8)
s.add(f'<path d="M{f(sx0 - 14)} {f(sy0 + 112)}l0 -46m-11 13l11 -13l11 13" stroke="#9fd8ff" stroke-width="5" '
      f'fill="none" stroke-linecap="round" stroke-linejoin="round" opacity=".85"/>')

# ------------------------------------------------------------------ sugar ring inside the leaf (glucose: 5 C + 1 O)
GX, GY = lp(.55 * L, -18)
s.rad("sugarGlow", [(0, "#fff7b0", .95), (.5, "#ffe066", .45), (1, "#ffe066", 0)])
s.add(f'<circle cx="{f(GX)}" cy="{f(GY)}" r="150" fill="url(#sugarGlow)"/>')
RR = 64
ring = []
for k in range(6):
    a = math.radians(60 * k - 90 + ANG)
    ring.append((GX + RR * math.cos(a), GY + RR * math.sin(a) * .82))
s.add(f'<path d="{poly(ring)}" fill="none" stroke="#fffbe0" stroke-width="9" stroke-linejoin="round"/>')
# side groups (CH2OH and OH stubs) as short bonds with small balls
for k, (x, y) in enumerate(ring):
    if k == 0:
        continue
    ox, oy = x - GX, y - GY
    l = math.hypot(ox, oy)
    ex, ey = x + ox / l * 34, y + oy / l * 34
    s.bond(x, y, ex, ey, 6, "#fffbe0")
    if k == 1:
        s.ball(ex, ey, 13, "C")
    else:
        s.ball(ex, ey, 10, "O")
for k, (x, y) in enumerate(ring):
    s.ball(x, y, 19, "O" if k == 0 else "C")
for (x, y, sz) in ((GX - 96, GY - 70, 14), (GX + 100, GY + 40, 11), (GX + 30, GY - 105, 9)):
    s.sparkle(x, y, sz, "#fffbe0")

s.calm_bottom(615)
s.save("leaf")
