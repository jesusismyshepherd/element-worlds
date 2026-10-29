"""Board 'you': a child whose body is filled with bands in proportion to the body's elements by mass."""
import math
from lib import Svg, f, mix, poly, smooth, BALLS

C = "#ff9fb2"
s = Svg(C, seed=23)
s.background(focus=(560, 330), focus_r=650, strength=.40, stars=90, bokeh=6)

# ------------------------------------------------------------------ the child (analytic shapes)
CX = 540
HEAD = (CX, 140, 66)
_TC = [(CX - 44, 219), (CX, 214), (CX + 44, 219), (CX + 63, 244), (CX + 57, 306), (CX + 55, 368),
       (CX, 382), (CX - 55, 368), (CX - 57, 306), (CX - 63, 244)]


def _sample(ctrl, per=8):
    out = []
    n = len(ctrl)
    for i in range(n):
        p0, p1, p2, p3 = ctrl[(i - 1) % n], ctrl[i], ctrl[(i + 1) % n], ctrl[(i + 2) % n]
        for k in range(per):
            u = k / per
            u2, u3 = u * u, u * u * u
            out.append(tuple(.5 * ((2 * p1[j]) + (-p0[j] + p2[j]) * u + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * u2
                                   + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * u3) for j in (0, 1)))
    return out


TORSO = _sample(_TC)
# capsules: (x1, y1, x2, y2, r)
CAPS = [
    (CX - 52, 240, CX - 122, 290, 19),   # left upper arm (out and down)
    (CX - 122, 290, CX - 166, 222, 17),  # left forearm, fist up
    (CX + 52, 240, CX + 122, 290, 19),   # right upper arm
    (CX + 122, 290, CX + 166, 222, 17),  # right forearm
    (CX - 30, 360, CX - 54, 468, 25),    # left thigh
    (CX - 54, 468, CX - 64, 562, 21),    # left shin
    (CX + 30, 360, CX + 54, 468, 25),    # right thigh
    (CX + 54, 468, CX + 64, 562, 21),    # right shin
    (CX, 196, CX, 230, 20),              # neck
]
CIRC = [HEAD, (CX - 170, 212, 23), (CX + 170, 212, 23)]   # head, fists
ELL = [(CX - 82, 580, 34, 16), (CX + 82, 580, 34, 16)]   # feet (ellipses)


def in_poly(x, y, pts):
    inside = False
    n = len(pts)
    for i in range(n):
        x1, y1 = pts[i]
        x2, y2 = pts[(i + 1) % n]
        if (y1 > y) != (y2 > y):
            xc = x1 + (y - y1) * (x2 - x1) / (y2 - y1)
            if xc > x:
                inside = not inside
    return inside


def in_cap(x, y, c):
    x1, y1, x2, y2, r = c
    dx, dy = x2 - x1, y2 - y1
    t = max(0, min(1, ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy)))
    px, py = x1 + t * dx, y1 + t * dy
    return (x - px) ** 2 + (y - py) ** 2 <= r * r


def inside(x, y):
    for (cx, cy, r) in CIRC:
        if (x - cx) ** 2 + (y - cy) ** 2 <= r * r:
            return True
    for (cx, cy, rx, ry) in ELL:
        if ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1:
            return True
    for c in CAPS:
        if in_cap(x, y, c):
            return True
    return in_poly(x, y, TORSO)


# area per row (1 px)
rows = {}
for y in range(60, 615):
    n = 0
    for x in range(CX - 240, CX + 240):
        if inside(x + .5, y + .5):
            n += 1
    rows[y] = n
total = sum(rows.values())

# bands from the bottom up: (kind, percent by mass)
BANDS = [("O", 65), ("C", 18), ("H", 10), ("N", 3), ("Ca", 1.5), ("P", 1), ("S", 1.5)]
cuts = []
acc = 0
target = 0
ys = sorted(rows, reverse=True)
idx = 0
bottom = ys[0] + 1
band_y = []
for kind, pc in BANDS:
    target += pc / 100 * total
    while idx < len(ys) and acc + rows[ys[idx]] <= target:
        acc += rows[ys[idx]]
        idx += 1
    top = ys[idx] if idx < len(ys) else 60
    band_y.append((kind, top, bottom))
    bottom = top
print("bands:", band_y)

# silhouette as SVG (union of shapes), grown by `extra` px, for outline and glow
def shape(extra, color):
    out = [f'<g fill="{color}" stroke="{color}">']
    for (cx, cy, r) in CIRC:
        out.append(f'<circle cx="{f(cx)}" cy="{f(cy)}" r="{f(r + extra)}" stroke="none"/>')
    for (cx, cy, rx, ry) in ELL:
        out.append(f'<ellipse cx="{f(cx)}" cy="{f(cy)}" rx="{f(rx + extra)}" ry="{f(ry + extra)}" stroke="none"/>')
    for (x1, y1, x2, y2, r) in CAPS:
        out.append(f'<line x1="{f(x1)}" y1="{f(y1)}" x2="{f(x2)}" y2="{f(y2)}" stroke-width="{f(2 * (r + extra))}" stroke-linecap="round"/>')
    out.append(f'<path d="{poly(TORSO)}" stroke-width="{f(max(.1, 2 * extra))}" stroke-linejoin="round"/>')
    out.append("</g>")
    return "".join(out)


# clip paths ignore strokes, so the clip is built from fills only: capsules as rotated rounded rects
clip = []
for (cx, cy, r) in CIRC:
    clip.append(f'<circle cx="{f(cx)}" cy="{f(cy)}" r="{f(r)}"/>')
for (cx, cy, rx, ry) in ELL:
    clip.append(f'<ellipse cx="{f(cx)}" cy="{f(cy)}" rx="{f(rx)}" ry="{f(ry)}"/>')
for (x1, y1, x2, y2, r) in CAPS:
    L = math.hypot(x2 - x1, y2 - y1)
    ang = math.degrees(math.atan2(y2 - y1, x2 - x1))
    clip.append(f'<rect x="{f(x1 - r)}" y="{f(y1 - r)}" width="{f(L + 2 * r)}" height="{f(2 * r)}" rx="{f(r)}" '
                f'transform="rotate({f(ang)} {f(x1)} {f(y1)})"/>')
clip.append(f'<path d="{poly(TORSO)}"/>')
s.add_def("kid", f'<clipPath id="kid">{"".join(clip)}</clipPath>')

# halo behind the child
s.rad("kidHalo", [(0, C, .55), (.5, C, .18), (1, C, 0)])
s.add(f'<ellipse cx="{CX}" cy="330" rx="330" ry="320" fill="url(#kidHalo)"/>')
# glowing outline
s.add(f'<g filter="url(#blur8)" opacity=".85">{shape(12, mix(C, "#ffffff", .35))}</g>')
s.add(shape(6, "#ffffff"))

# bands
COL = {k: BALLS[k][1] for k in BALLS}
COL["H"] = "#f4f6fb"
band_svg = []
for i, (kind, top, bot) in enumerate(band_y):
    c = COL[kind]
    lo = mix(c, "#000000", .18) if kind != "C" else "#2a2e38"
    gid = s.lin(f"band{kind}", [(0, mix(c, "#ffffff", .18)), (1, lo)], x1=0, y1=0, x2=0, y2=1)
    # wavy top edge (liquid layers)
    amp = 4 if (bot - top) > 12 else 1.5
    pts = []
    x0, x1 = CX - 260, CX + 260
    for k in range(0, 27):
        x = x0 + (x1 - x0) * k / 26
        pts.append((x, top + amp * math.sin(k * 1.1 + i)))
    d = "M" + " L".join(f"{f(x)} {f(y)}" for x, y in pts) + f" L{x1} {bot + 8} L{x0} {bot + 8}Z"
    band_svg.append(f'<path d="{d}" fill="url(#{gid})"/>')
# little atoms inside each band, so the layers read as "made of these atoms", not as clothes
rng = s.rng
for i, (kind, top, bot) in enumerate(band_y):
    if bot - top < 14:
        continue
    c = COL[kind]
    lite = mix(c, "#ffffff", .45) if kind != "H" else "#c9d0e2"
    dots = []
    yy = top + 12
    row = 0
    while yy < bot - 6:
        xx = CX - 240 + (row % 2) * 17
        while xx < CX + 240:
            if inside(xx, yy) and rng.random() < .55:
                dots.append(f'<circle cx="{f(xx + rng.uniform(-4, 4))}" cy="{f(yy + rng.uniform(-3, 3))}" r="{f(rng.uniform(5, 8))}"/>')
            xx += 34
        yy += 26
        row += 1
    band_svg.append(f'<g fill="{lite}" opacity=".28">{"".join(dots)}</g>')
# shading over the body: light from the upper left, a soft sheen stripe
s.lin("bodyShade", [(0, "#ffffff", .22), (.45, "#ffffff", 0), (1, "#000000", .25)], x1=0, y1=0, x2=1, y2=0)
s.add(f'<g clip-path="url(#kid)">{"".join(band_svg)}'
      f'<rect x="{CX - 260}" y="60" width="520" height="560" fill="url(#bodyShade)"/></g>')

# face
hx, hy, hr = HEAD
s.add(f'<g fill="#1b2250"><ellipse cx="{hx - 21}" cy="{hy - 4}" rx="7" ry="10"/><ellipse cx="{hx + 21}" cy="{hy - 4}" rx="7" ry="10"/></g>')
s.add(f'<circle cx="{hx - 19}" cy="{hy - 8}" r="2.6" fill="#fff"/><circle cx="{hx + 23}" cy="{hy - 8}" r="2.6" fill="#fff"/>')
s.add(f'<path d="M{hx - 24} {hy + 18}Q{hx} {hy + 42} {hx + 24} {hy + 18}" stroke="#1b2250" stroke-width="6" fill="none" stroke-linecap="round"/>')
s.add(f'<g fill="#ff7a9a" opacity=".55"><ellipse cx="{hx - 36}" cy="{hy + 14}" rx="10" ry="6"/><ellipse cx="{hx + 36}" cy="{hy + 14}" rx="10" ry="6"/></g>')
# hair tuft
s.add(f'<path d="M{hx - 8} {hy - hr + 4}C{hx - 4} {hy - hr - 22} {hx + 18} {hy - hr - 24} {hx + 24} {hy - hr - 8}" '
      f'stroke="#ffffff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".9"/>')

# ------------------------------------------------------------------ legend balls on the right, sized by mass
K = 11.5  # radius per sqrt(percent)
PC = dict(BANDS)
BY = {k: (top, bot) for k, top, bot in band_y}


def edge_x(y):
    xs_ = [x for x in range(CX - 240, CX + 240) if inside(x + .5, y + .5)]
    return max(xs_) if xs_ else CX


def leader(y_from, bx, by, r):
    ex = edge_x(int(y_from)) + 12
    s.add(f'<path d="M{f(ex)} {f(y_from)}C{f(ex + 60)} {f(y_from)} {f(bx - r - 60)} {f(by)} {f(bx - r - 12)} {f(by)}" '
          f'stroke="{mix(C, "#ffffff", .55)}" stroke-width="4" stroke-dasharray="1 10" stroke-linecap="round" fill="none" opacity=".85"/>')


def legend_ball(kind, bx, by):
    r = K * math.sqrt(PC[kind])
    halo = COL[kind] if kind != "C" else "#aab3c8"
    s.add(f'<circle cx="{f(bx)}" cy="{f(by)}" r="{f(r + 12)}" fill="{halo}" opacity=".25" filter="url(#blur8)"/>')
    s.ball(bx, by, r, kind)
    return r


spots = {"O": (930, 462), "C": (895, 268), "H": (1010, 168), "N": (865, 140)}
for kind, (bx, by) in spots.items():
    top, bot = BY[kind]
    r = K * math.sqrt(PC[kind])
    leader((top + bot) / 2, bx, by, r)
    legend_ball(kind, bx, by)
# the small rest (calcium, phosphorus and others) as one little cluster
top = BY["S"][0]
bot = BY["Ca"][1]
leader((top + bot) / 2 + 2, 912, 82, 22)
for kind, (bx, by) in (("Ca", (900, 90)), ("P", (928, 72)), ("S", (938, 100))):
    legend_ball(kind, bx, by)

# ------------------------------------------------------------------ DNA helix on the left
HX = 205
y0, y1 = 70, 570
turns = 2.2
amp = 62
N = 26
pairs_cols = [("#4d7dff", "#ffd84d"), ("#6fd35e", "#ff9a3c")]
segs = []
for i in range(N):
    t = i / (N - 1)
    y = y0 + (y1 - y0) * t
    ph = t * turns * 2 * math.pi
    xa = HX + amp * math.sin(ph)
    xb = HX + amp * math.sin(ph + math.pi)
    za = math.cos(ph)
    segs.append((y, ph, xa, xb, za))
# rungs first (behind the front strand)
for i, (y, ph, xa, xb, za) in enumerate(segs):
    if i % 2:
        continue
    ca, cb = pairs_cols[(i // 2) % 2]
    mx = (xa + xb) / 2
    op = .55 + .35 * abs(math.cos(ph))
    s.add(f'<line x1="{f(xa)}" y1="{f(y)}" x2="{f(mx)}" y2="{f(y)}" stroke="{ca}" stroke-width="9" stroke-linecap="round" opacity="{op:.2f}"/>')
    s.add(f'<line x1="{f(mx)}" y1="{f(y)}" x2="{f(xb)}" y2="{f(y)}" stroke="{cb}" stroke-width="9" stroke-linecap="round" opacity="{op:.2f}"/>')


def strand(sign):
    pts = []
    for i in range(121):
        t = i / 120
        y = y0 + (y1 - y0) * t
        ph = t * turns * 2 * math.pi + (0 if sign > 0 else math.pi)
        pts.append((HX + amp * math.sin(ph), y, math.cos(ph)))
    return pts


for sign in (1, -1):
    pts = strand(sign)
    # draw in pieces: back pieces dim, front bright
    cur = [pts[0]]
    for p in pts[1:]:
        if (p[2] >= 0) != (cur[-1][2] >= 0):
            cur.append(p)
            front = cur[len(cur) // 2][2] >= 0
            s.add(f'<path d="{smooth([(q[0], q[1]) for q in cur], closed=False)}" stroke="{C if front else mix(C, "#1b2250", .5)}" '
                  f'stroke-width="{13 if front else 10}" fill="none" stroke-linecap="round" opacity="{1 if front else .7}"/>')
            cur = [p]
        else:
            cur.append(p)
    front = cur[len(cur) // 2][2] >= 0
    s.add(f'<path d="{smooth([(q[0], q[1]) for q in cur], closed=False)}" stroke="{C if front else mix(C, "#1b2250", .5)}" '
          f'stroke-width="{13 if front else 10}" fill="none" stroke-linecap="round" opacity="{1 if front else .7}"/>')
# backbone atoms: carbon and oxygen beads on the front strand parts
for i, (y, ph, xa, xb, za) in enumerate(segs):
    for x, z in ((xa, za), (xb, -za)):
        if z > -.2:
            kind = "C" if i % 3 else "O"
            s.ball(x, y, 9 + 3 * z, kind)

# sparkles around the child
for (x, y, sz) in ((CX - 160, 120, 14), (CX + 150, 110, 18), (CX + 230, 380, 12), (CX - 230, 420, 12)):
    s.sparkle(x, y, sz, "#ffffff", .9)

s.calm_bottom(610)
s.save("you")
