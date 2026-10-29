"""Board 'stars': a red giant; inside it three helium nuclei fuse into one carbon nucleus."""
import math
from lib import Svg, f, mix, poly, smooth, rot

C = "#ffb347"
s = Svg(C, seed=41)
s.background(focus=(300, 460), focus_r=760, strength=.30, stars=170, bokeh=4)

# nebula wisps
for (x, y, rx, ry, col, op) in ((960, 120, 260, 90, "#b05cff", .16), (1080, 520, 220, 120, "#ff6a6a", .12),
                                 (720, 640, 320, 80, "#ff9a3c", .10)):
    s.add(f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="{col}" opacity="{op}" filter="url(#blur30)"/>')

# ------------------------------------------------------------------ the red giant
GX, GY, GR = 190, 480, 330
s.rad("giantHalo", [(0, "#ff9a3c", .8), (.55, "#ff6a2a", .35), (1, "#ff3d1f", 0)], cx=GX, cy=GY, r=GR * 1.55, user=True)
s.add(f'<circle cx="{GX}" cy="{GY}" r="{GR * 1.55}" fill="url(#giantHalo)"/>')
s.rad("giant", [(0, "#fff1b8"), (.25, "#ffc35a"), (.6, "#ff7a2e"), (.88, "#e2401c"), (1, "#a8201a")],
      cx=GX + 40, cy=GY - 60, r=GR * 1.1, fx=GX + 20, fy=GY - 70, user=True)
s.add_def("giantClip", f'<clipPath id="giantClip"><circle cx="{GX}" cy="{GY}" r="{GR}"/></clipPath>')
s.add(f'<circle cx="{GX}" cy="{GY}" r="{GR}" fill="url(#giant)"/>')
# granulation: soft blotches
rng = s.rng
blot = []
for _ in range(46):
    a = rng.uniform(0, 2 * math.pi)
    d = GR * math.sqrt(rng.uniform(0, 1))
    x, y = GX + d * math.cos(a), GY + d * math.sin(a)
    r = rng.uniform(18, 46)
    col = rng.choice(["#ffd27a", "#ffe8a8", "#d8401c", "#c2301a"])
    blot.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r)}" fill="{col}" opacity="{rng.uniform(.18, .35):.2f}"/>')
s.add(f'<g clip-path="url(#giantClip)"><g filter="url(#blur8)">{"".join(blot)}</g></g>')
# limb darkening ring
s.rad("limb", [(0, "#000000", 0), (.78, "#000000", 0), (1, "#5a0a10", .55)], cx=GX, cy=GY, r=GR, user=True)
s.add(f'<circle cx="{GX}" cy="{GY}" r="{GR}" fill="url(#limb)"/>')
# prominences on the limb
for ang, size in ((-62, 30), (-28, 22)):
    a = math.radians(ang)
    x0, y0 = GX + GR * math.cos(a - .09), GY + GR * math.sin(a - .09)
    x1, y1 = GX + GR * math.cos(a + .09), GY + GR * math.sin(a + .09)
    cx_, cy_ = GX + (GR + size * 1.6) * math.cos(a), GY + (GR + size * 1.6) * math.sin(a)
    s.add(f'<path d="M{f(x0)} {f(y0)}Q{f(cx_)} {f(cy_)} {f(x1)} {f(y1)}" stroke="#ffb35a" stroke-width="7" '
          f'fill="none" stroke-linecap="round" opacity=".55" filter="url(#glowS)"/>')

# ------------------------------------------------------------------ zoom from the core to the lens
CORE = (GX + 10, GY - 10, 34)
LX, LY, LR = 810, 312, 248
s.add(f'<circle cx="{CORE[0]}" cy="{CORE[1]}" r="{CORE[2]}" fill="#fff6d0" opacity=".9" filter="url(#glow)"/>')
s.add(f'<circle cx="{CORE[0]}" cy="{CORE[1]}" r="{CORE[2] + 6}" fill="none" stroke="#ffffff" stroke-width="4"/>')


def tangent_pts(c1, c2, sign):
    """outer tangent between two circles (x, y, r)."""
    x1, y1, r1 = c1
    x2, y2, r2 = c2
    d = math.hypot(x2 - x1, y2 - y1)
    a = math.atan2(y2 - y1, x2 - x1)
    b = math.acos((r1 - r2) / d)
    t1 = (x1 + r1 * math.cos(a + sign * b), y1 + r1 * math.sin(a + sign * b))
    t2 = (x2 + r2 * math.cos(a + sign * b), y2 + r2 * math.sin(a + sign * b))
    return t1, t2


c1 = (CORE[0], CORE[1], CORE[2] + 6)
c2 = (LX, LY, LR + 8)
(a1, a2), (b1, b2) = tangent_pts(c1, c2, 1), tangent_pts(c1, c2, -1)
s.lin("zoom", [(0, "#ffffff", .45), (1, "#ffffff", .08)], x1=c1[0], y1=c1[1], x2=LX, y2=LY, user=True)
s.add(f'<path d="M{f(a1[0])} {f(a1[1])}L{f(a2[0])} {f(a2[1])}L{f(b2[0])} {f(b2[1])}L{f(b1[0])} {f(b1[1])}Z" fill="url(#zoom)"/>')
for p1, p2 in ((a1, a2), (b1, b2)):
    s.add(f'<line x1="{f(p1[0])}" y1="{f(p1[1])}" x2="{f(p2[0])}" y2="{f(p2[1])}" stroke="#fff" stroke-width="3" '
          f'stroke-dasharray="3 10" stroke-linecap="round" opacity=".8"/>')

# ------------------------------------------------------------------ the lens: fusion
s.add_def("lensClip", f'<clipPath id="lensClip"><circle cx="{LX}" cy="{LY}" r="{LR}"/></clipPath>')
s.rad("lensBg", [(0, "#fff3c0"), (.18, "#ffc04d"), (.55, "#e2541f"), (1, "#5a1420")], cx=LX, cy=LY, r=LR, user=True)
s.add(f'<circle cx="{LX}" cy="{LY}" r="{LR + 20}" fill="{C}" opacity=".5" filter="url(#blur16)"/>')
s.add(f'<circle cx="{LX}" cy="{LY}" r="{LR}" fill="url(#lensBg)"/>')
inner = []
# plasma swirls
for _ in range(16):
    a = rng.uniform(0, 2 * math.pi)
    d = rng.uniform(60, LR)
    x, y = LX + d * math.cos(a), LY + d * math.sin(a)
    inner.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(rng.uniform(20, 50))}" fill="{rng.choice(["#ffb347", "#ff6a2a", "#ffd27a"])}" '
                 f'opacity="{rng.uniform(.15, .3):.2f}"/>')
s.add(f'<g clip-path="url(#lensClip)"><g filter="url(#blur8)">{"".join(inner)}</g>')

# burst
spikes = []
n = 18
for k in range(2 * n):
    a = math.pi * k / n
    r = 150 if k % 2 == 0 else 46
    if k % 4 == 2:
        r = 110
    spikes.append((LX + r * math.cos(a), LY + r * math.sin(a)))
s.add(f'<path d="{poly(spikes)}" fill="#fff6c8" opacity=".85" filter="url(#glow)"/>')
s.add(f'<circle cx="{LX}" cy="{LY}" r="80" fill="#ffffff" opacity=".85" filter="url(#blur16)"/>')

# gamma-ray squiggles leaving the burst
for ang in (25, 145, 265):
    a = math.radians(ang)
    pts = []
    for i in range(40):
        t = i / 39
        d = 95 + 120 * t
        w = 8 * math.sin(t * 9 * math.pi)
        pts.append((LX + d * math.cos(a) - w * math.sin(a), LY + d * math.sin(a) + w * math.cos(a)))
    s.add(f'<path d="{smooth(pts, closed=False)}" stroke="#fffbe0" stroke-width="4" fill="none" stroke-linecap="round" opacity=".9"/>')


def cluster(cx, cy, pts3, rs, kinds, ax, ay, scale):
    """Draw spheres at 3D points (depth sorted)."""
    items = []
    for p, k in zip(pts3, kinds):
        q = rot(p, ax, ay)
        items.append((q[2], cx + q[0] * scale, cy - q[1] * scale, k))
    items.sort()
    for z, x, y, k in items:
        s.ball(x, y, rs, k)


# carbon-12: 12 spheres at the corners of an icosahedron, antipodal pairs one proton one neutron
phi = (1 + 5 ** .5) / 2
ico = []
for a_ in (-1, 1):
    for b_ in (-phi, phi):
        ico += [(0, a_, b_), (a_, b_, 0), (b_, 0, a_)]
ico = [tuple(v / math.sqrt(1 + phi * phi) for v in p) for p in ico]
kinds = []
for p in ico:
    # first of each antipodal pair: proton
    kinds.append("p" if (p[0], p[1], p[2]) > (-p[0], -p[1], -p[2]) else "n")
assert kinds.count("p") == 6
RS = 24
cluster(LX, LY, ico, RS, kinds, .5, .35, RS * 2 / 1.0515 * .95)

# three helium-4 nuclei flying in (2 protons + 2 neutrons each), with trails
tet = [(1, 1, 1), (1, -1, -1), (-1, 1, -1), (-1, -1, 1)]
tet = [tuple(v / math.sqrt(3) for v in p) for p in tet]
RH = 21
for ang, rx_, ry_ in ((205, .18, .22), (325, -.2, .15), (90, .12, -.25)):
    a = math.radians(ang)
    hx, hy = LX + 168 * math.cos(a), LY + 168 * math.sin(a)
    # trail behind (away from the centre)
    tx0, ty0 = LX + 186 * math.cos(a), LY + 186 * math.sin(a)
    tx1, ty1 = LX + 300 * math.cos(a), LY + 300 * math.sin(a)
    s.lin(f"tr{ang}", [(0, "#ffffff", .95), (1, "#ffffff", 0)], x1=tx0, y1=ty0, x2=tx1, y2=ty1, user=True)
    for off in (-14, 0, 14):
        ox, oy = -math.sin(a) * off, math.cos(a) * off
        s.add(f'<line x1="{f(tx0 + ox)}" y1="{f(ty0 + oy)}" x2="{f(tx1 + ox * .6)}" y2="{f(ty1 + oy * .6)}" '
              f'stroke="url(#tr{ang})" stroke-width="{7 if off == 0 else 4}" stroke-linecap="round"/>')
    s.add(f'<circle cx="{f(hx)}" cy="{f(hy)}" r="44" fill="#fff" opacity=".35" filter="url(#blur8)"/>')
    cluster(hx, hy, tet, RH, ["p", "n", "p", "n"], rx_, ry_, RH * 2 / 1.633 * .95)
    # small arrow toward the centre
    ax_, ay_ = LX + 116 * math.cos(a), LY + 116 * math.sin(a)
    tip = (LX + 98 * math.cos(a), LY + 98 * math.sin(a))
s.add("</g>")
# lens rim
s.add(f'<circle cx="{LX}" cy="{LY}" r="{LR}" fill="none" stroke="#fff4d6" stroke-width="7"/>')
s.add(f'<circle cx="{LX}" cy="{LY}" r="{LR + 10}" fill="none" stroke="{C}" stroke-width="3" opacity=".7"/>')
s.add(f'<path d="M{LX - LR * .72} {LY - LR * .5}A{LR * .88} {LR * .88} 0 0 1 {LX - LR * .2} {LY - LR * .86}" '
      f'stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round" opacity=".35"/>')

s.calm_bottom(615)
s.save("stars")
