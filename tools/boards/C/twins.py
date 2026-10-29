"""Board 'twins': a diamond and a pencil, with their atom structures."""
import math
from lib import Svg, f, mix, poly, smooth, rot, norm

C = "#7fd4ff"
s = Svg(C, seed=11)
s.background(focus=(600, 330), focus_r=700, strength=.38, stars=90, bokeh=6)

# ------------------------------------------------------------------ diamond lattice (behind the diamond)
DCX, DCY = 330, 300


def diamond_lattice(scale, radius_cells, ax, ay):
    base = [(0, 0, 0), (0, .5, .5), (.5, 0, .5), (.5, .5, 0)]
    pts = []
    rng_ = range(-2, 2)
    for i in rng_:
        for j in rng_:
            for k in rng_:
                for b in base:
                    for off in ((0, 0, 0), (.25, .25, .25)):
                        p = (i + b[0] + off[0], j + b[1] + off[1], k + b[2] + off[2])
                        pts.append(p)
    # centre on a bond midpoint so it looks symmetric
    c0 = (.125, .125, .125)
    pts = [(p[0] - c0[0], p[1] - c0[1], p[2] - c0[2]) for p in pts]
    pts = [p for p in pts if math.sqrt(sum(a * a for a in p)) <= radius_cells]
    pts = list(set((round(p[0], 3), round(p[1], 3), round(p[2], 3)) for p in pts))
    nn = math.sqrt(3) / 4
    bonds = []
    for a in range(len(pts)):
        for b in range(a + 1, len(pts)):
            d = math.dist(pts[a], pts[b])
            if abs(d - nn) < 1e-2:
                bonds.append((a, b))
    proj = [rot(p, ax, ay) for p in pts]
    return pts, proj, bonds


pts, proj, bonds = diamond_lattice(1, 1.22, .42, .62)
SC = 205
zs = [p[2] for p in proj]
zmin, zmax = min(zs), max(zs)


def depth(z):
    return (z - zmin) / (zmax - zmin)


def scr(p):
    return DCX + p[0] * SC, DCY - p[1] * SC


s.add('<g id="lat">')
s.rad("latGlow", [(0, C, .38), (.6, C, .1), (1, C, 0)])
s.add(f'<circle cx="{DCX}" cy="{DCY}" r="300" fill="url(#latGlow)"/>')
items = []
for a, b in bonds:
    z = (proj[a][2] + proj[b][2]) / 2
    items.append((z, "b", a, b))
for i, p in enumerate(proj):
    items.append((p[2], "a", i, None))
items.sort(key=lambda t: t[0])
for z, kind, a, b in items:
    d = depth(z)
    if kind == "b":
        x1, y1 = scr(proj[a])
        x2, y2 = scr(proj[b])
        s.bond(x1, y1, x2, y2, 9 + 4 * d, C, .10 + .12 * d)
        s.bond(x1, y1, x2, y2, 2.4 + 2.2 * d, mix(C, "#ffffff", .45 * d), .35 + .55 * d)
    else:
        x, y = scr(proj[a])
        s.ball(x, y, 7 + 8 * d, "C", opacity=.45 + .55 * d)
s.add("</g>")

# ------------------------------------------------------------------ the cut diamond (brilliant)
GR = 182          # girdle radius in px
TILT = .25
SPIN = .19
LIGHT = norm((-.5, .8, .6))


def v3(r, ang_deg, y):
    a = math.radians(ang_deg)
    return (r * math.cos(a), y, r * math.sin(a))


hc = .30
T = [v3(.56, 45 * k + 22.5, hc) for k in range(8)]
G = [v3(1.0, 22.5 * j, 0) for j in range(16)]
Gl = [v3(1.0, 22.5 * j, -.035) for j in range(16)]
M = [v3(.80, 45 * (k + 1), .165) for k in range(8)]
CUL = (0, -.88, 0)
P = [v3(.47, 45 * k + 22.5, -.88 * (1 - .47)) for k in range(8)]

faces = []
faces.append(("table", T))
for k in range(8):
    faces.append(("star", [T[k], T[(k + 1) % 8], M[k]]))
    faces.append(("bezel", [T[k], M[(k - 1) % 8], G[(2 * k + 1) % 16], M[k]]))
    faces.append(("ug", [M[k], G[(2 * k + 1) % 16], G[(2 * k + 2) % 16]]))
    faces.append(("ug", [M[k], G[(2 * k + 2) % 16], G[(2 * k + 3) % 16]]))
for j in range(16):
    faces.append(("girdle", [G[j], G[(j + 1) % 16], Gl[(j + 1) % 16], Gl[j]]))
for k in range(8):
    faces.append(("main", [Gl[(2 * k) % 16], P[k], CUL, P[(k - 1) % 8]]))
    faces.append(("lg", [Gl[(2 * k) % 16], Gl[(2 * k + 1) % 16], P[k]]))
    faces.append(("lg", [Gl[(2 * k + 1) % 16], Gl[(2 * k + 2) % 16], P[k]]))


def xform(p):
    # spin about y, then tilt top toward the viewer
    x, y, z = p
    c, sn = math.cos(SPIN), math.sin(SPIN)
    x, z = x * c + z * sn, -x * sn + z * c
    c, sn = math.cos(TILT), math.sin(TILT)
    y, z = y * c - z * sn, y * sn + z * c
    return (x, y, z)


DX, DY = DCX, DCY + 18


def dscr(p):
    return DX + p[0] * GR, DY - p[1] * GR


PAL = ["#174a9a", "#2f7fd0", "#7fd4ff", "#d6f3ff", "#ffffff", "#a9b8ff", "#5fb6f0", "#e9fbff", "#1f5fb8", "#c4ecff"]


def env(r, kind, idx):
    """Environment colour for a reflected direction (fake but sparkly)."""
    ry = r[1]
    az = math.atan2(r[0], r[2])
    v = (az * 1.7 / math.pi + ry * 1.3) % 1.0
    col = PAL[int(v * len(PAL)) % len(PAL)]
    if kind == "table":
        col = "#e4f7ff"
    if kind in ("main", "lg"):
        col = mix(col, "#123d86", .25)
    hl = max(0, sum(a * b for a, b in zip(r, LIGHT)))
    if hl > .85:
        col = mix(col, "#ffffff", min(1, (hl - .85) * 6))
    return col


VIEW = (0, 0, 1)
drawn = []
for kind, vs in faces:
    tv = [xform(p) for p in vs]
    # normal from the polygon (Newell)
    nx = ny = nz = 0
    for i in range(len(tv)):
        a, b = tv[i], tv[(i + 1) % len(tv)]
        nx += (a[1] - b[1]) * (a[2] + b[2])
        ny += (a[2] - b[2]) * (a[0] + b[0])
        nz += (a[0] - b[0]) * (a[1] + b[1])
    n = norm((nx, ny, nz))
    cz = sum(p[2] for p in tv) / len(tv)
    cxp = sum(p[0] for p in tv) / len(tv)
    cyp = sum(p[1] for p in tv) / len(tv)
    # make the normal point outward (away from the centre at y ~ -0.2)
    out = (cxp, cyp + .2, cz)
    if sum(a * b for a, b in zip(n, out)) < 0:
        n = tuple(-a for a in n)
    if n[2] <= 0.02:
        continue
    d = sum(a * b for a, b in zip(VIEW, n))
    r = tuple(2 * d * nn - vv for nn, vv in zip(n, VIEW))
    drawn.append((cz, kind, tv, n, r))

drawn.sort(key=lambda t: t[0])
s.rad("dHalo", [(0, "#ffffff", .55), (.35, C, .35), (1, C, 0)])
s.add(f'<circle cx="{DX}" cy="{DY - 20}" r="250" fill="url(#dHalo)" opacity=".6"/>')
s.add(f'<g stroke="#ffffff" stroke-opacity=".55" stroke-width="1.4" stroke-linejoin="round">')
for i, (cz, kind, tv, n, r) in enumerate(drawn):
    col = env(r, kind, i)
    if kind == "girdle":
        col = mix(col, "#dff6ff", .3)
    pts2 = [dscr(p) for p in tv]
    s.add(f'<path d="{poly(pts2)}" fill="{col}"/>')
s.add("</g>")
# inner shine: a soft white glow on the table and a few light streaks
tbl = [dscr(xform(p)) for p in T]
tx = sum(p[0] for p in tbl) / 8
ty = sum(p[1] for p in tbl) / 8
s.add(f'<ellipse cx="{f(tx - 20)}" cy="{f(ty)}" rx="70" ry="16" fill="#fff" opacity=".35" filter="url(#blur8)"/>')
# sparkles
for (x, y, sz) in ((DX - 115, DY - 95, 30), (DX + 95, DY - 60, 22), (DX + 30, DY + 105, 16),
                   (DX - 30, DY - 70, 14), (DX + 168, DY - 6, 18)):
    s.sparkle(x, y, sz, "#ffffff")
s.sparkle(DX - 115, DY - 95, 55, "#ffffff", .5)

# ------------------------------------------------------------------ graphite sheets (behind / off the pencil)
SHEET_SPIN = math.radians(20)
SHEET_TILT = math.radians(40)
B = 27  # bond length in px


def sheet_xf(u, h, v, cx, cy):
    x = u * math.cos(SHEET_SPIN) + v * math.sin(SHEET_SPIN)
    z = -u * math.sin(SHEET_SPIN) + v * math.cos(SHEET_SPIN)
    y = h
    y2 = y * math.cos(SHEET_TILT) - z * math.sin(SHEET_TILT)
    z2 = y * math.sin(SHEET_TILT) + z * math.cos(SHEET_TILT)
    return cx + x, cy - y2, z2


def honeycomb(U, V, b, shift=0.0):
    r3 = math.sqrt(3)
    atoms = {}
    for i in range(-20, 21):
        for j in range(-20, 21):
            ax = i * r3 * b + j * r3 / 2 * b
            ay = j * 1.5 * b + shift
            for key, (px, py) in ((("A", i, j), (ax, ay)), (("B", i, j), (ax, ay + b))):
                if abs(px) <= U and abs(py) <= V:
                    atoms[key] = (px, py)
    bonds = []
    for (t_, i, j), p_ in atoms.items():
        if t_ != "A":
            continue
        for nb in (("B", i, j), ("B", i + 1, j - 1), ("B", i, j - 1)):
            if nb in atoms:
                bonds.append(((t_, i, j), nb))
    return atoms, bonds


SCX, SCY = 758, 236
LS = 96
TIPX, TIPY = 742, 560
# light cone from the pencil tip up to the magnified layers
s.lin("cone", [(0, C, .55), (1, C, .04)], x1=TIPX, y1=TIPY, x2=SCX, y2=SCY + 60, user=True)
s.add(f'<path d="M{TIPX} {TIPY}L{SCX - 175} {SCY + 70}Q{SCX} {SCY + 120} {SCX + 175} {SCY + 70}Z" fill="url(#cone)"/>')
s.rad("shGlow", [(0, C, .32), (1, C, 0)])
s.add(f'<ellipse cx="{SCX}" cy="{SCY}" rx="250" ry="170" fill="url(#shGlow)"/>')
layers = [(-LS, 0.0, 0, .62), (0.0, B, 0, .8), (LS, 0.0, -62, 1.0)]
for li, (h, shift, du, op) in enumerate(layers):
    atoms, hbonds = honeycomb(100, 62, B, shift)
    corners = [sheet_xf(u + du, h, v, SCX, SCY) for u, v in ((-114, -76), (114, -76), (114, 76), (-114, 76))]
    s.add(f'<path d="{poly([(c_[0], c_[1]) for c_ in corners])}" fill="{C}" fill-opacity="{round(.10 + .06 * op, 2)}" '
          f'stroke="{mix(C, "#ffffff", .3)}" stroke-opacity="{round(.55 * op, 2)}" stroke-width="2" stroke-linejoin="round"/>')
    pa = {k: sheet_xf(p_[0] + du, h, p_[1], SCX, SCY) for k, p_ in atoms.items()}
    seg = []
    for a_, b_ in hbonds:
        seg.append(f"M{f(pa[a_][0])} {f(pa[a_][1])}L{f(pa[b_][0])} {f(pa[b_][1])}")
    s.add(f'<path d="{"".join(seg)}" stroke="{mix(C, "#ffffff", .55)}" stroke-width="4.6" stroke-linecap="round" '
          f'fill="none" opacity="{round(.55 + .45 * op, 2)}"/>')
    g = []
    for k, p_ in sorted(pa.items(), key=lambda kv: kv[1][2]):
        g.append(f'<circle cx="{f(p_[0])}" cy="{f(p_[1])}" r="{f(4.2 + 1.4 * op)}"/>')
    s.add(f'<g fill="url(#bC)" stroke="#c9d1e6" stroke-opacity=".55" stroke-width="1.1" opacity="{round(.55 + .45 * op, 2)}">{"".join(g)}</g>')
    if li == 2:
        # motion streaks behind the sliding top sheet (it slides to the left)
        for k in range(3):
            x0, y0, _ = sheet_xf(114 + du + 14, h, -46 + k * 46, SCX, SCY)
            s.add(f'<path d="M{f(x0)} {f(y0)}h{58 - k * 10}" stroke="#ffffff" stroke-width="4.5" '
                  f'stroke-linecap="round" opacity="{.6 - k * .12:.2f}"/>')
s.ball_grad("C")

# ------------------------------------------------------------------ the pencil
ANG = -52  # degrees, axis from tip toward eraser
Lg, Lc, Lb, Lf, Le = 30, 92, 360, 48, 46
Wd = 60
yel_top, yel_mid, yel_bot = "#ffd84d", "#f5b82a", "#c98a10"
p = []
p.append(f'<g transform="translate({TIPX} {TIPY}) rotate({ANG})">')
# soft glow around the whole pencil
p.append(f'<rect x="0" y="{-Wd / 2 - 6}" width="{Lg + Lc + Lb + Lf + Le}" height="{Wd + 12}" rx="30" fill="{C}" opacity=".25" filter="url(#blur16)"/>')
x0 = Lg + Lc
# body: three visible faces
p.append(f'<rect x="{x0 - 2}" y="{-Wd / 2}" width="{Lb + 2}" height="{Wd * .28}" fill="{yel_top}"/>')
p.append(f'<rect x="{x0 - 2}" y="{-Wd / 2 + Wd * .28}" width="{Lb + 2}" height="{Wd * .44}" fill="{yel_mid}"/>')
p.append(f'<rect x="{x0 - 2}" y="{Wd / 2 - Wd * .28}" width="{Lb + 2}" height="{Wd * .28}" fill="{yel_bot}"/>')
p.append(f'<rect x="{x0}" y="{-Wd / 2 + 3}" width="{Lb}" height="5" fill="#fff" opacity=".45"/>')
# wood cone with scalloped edge
sc = []
sc.append(f"M{Lg} {-9}")
sc.append(f"L{x0} {-Wd / 2}")
sc.append(f"Q{x0 - 16} {-Wd / 2 + Wd * .14} {x0} {-Wd / 2 + Wd * .28}")
sc.append(f"Q{x0 - 22} {0} {x0} {Wd / 2 - Wd * .28}")
sc.append(f"Q{x0 - 16} {Wd / 2 - Wd * .14} {x0} {Wd / 2}")
sc.append(f"L{Lg} 9Z")
p.append(f'<path d="{"".join(sc)}" fill="#f2c89a"/>')
p.append(f'<path d="M{Lg} -9L{x0} {-Wd / 2}Q{x0 - 16} {-Wd / 2 + Wd * .14} {x0} {-Wd / 2 + Wd * .28}L{Lg} -3Z" fill="#ffe3c2"/>')
p.append(f'<path d="M{Lg} 9L{x0} {Wd / 2}Q{x0 - 16} {Wd / 2 - Wd * .14} {x0} {Wd / 2 - Wd * .28}L{Lg} 4Z" fill="#d9a46e"/>')
# graphite tip
p.append(f'<path d="M0 0L{Lg + 1} -9.5L{Lg + 1} 9.5Z" fill="#3a3f4b"/>')
p.append(f'<path d="M0 0L{Lg + 1} -9.5L{Lg + 1} -3Z" fill="#8b93a5"/>')
# ferrule
x1 = x0 + Lb
p.append(f'<rect x="{x1}" y="{-Wd / 2 - 1}" width="{Lf}" height="{Wd + 2}" fill="#c7cfdc"/>')
p.append(f'<rect x="{x1}" y="{-Wd / 2 - 1}" width="{Lf}" height="{(Wd + 2) * .3}" fill="#eef2f8"/>')
p.append(f'<rect x="{x1}" y="{Wd / 2 + 1 - (Wd + 2) * .28}" width="{Lf}" height="{(Wd + 2) * .28}" fill="#8f99ab"/>')
for k in (10, 20, 30, 38):
    p.append(f'<rect x="{x1 + k}" y="{-Wd / 2 - 1}" width="3" height="{Wd + 2}" fill="#7d879a" opacity=".6"/>')
# eraser
x2 = x1 + Lf
p.append(f'<path d="M{x2} {-Wd / 2}H{x2 + Le - 14}Q{x2 + Le} {-Wd / 2} {x2 + Le} {-Wd / 2 + 14}V{Wd / 2 - 14}'
         f'Q{x2 + Le} {Wd / 2} {x2 + Le - 14} {Wd / 2}H{x2}Z" fill="#ff8fa8"/>')
p.append(f'<rect x="{x2}" y="{-Wd / 2 + 3}" width="{Le - 16}" height="9" rx="4" fill="#ffc2cf"/>')
p.append("</g>")
s.add("".join(p))

# graphite line drawn by the pencil (on the left of the tip), and flakes rubbing off
s.add(f'<path d="M{TIPX - 6} {TIPY + 6}C{TIPX - 60} {TIPY + 36} {TIPX - 110} {TIPY - 20} {TIPX - 170} {TIPY + 12}'
      f'S{TIPX - 250} {TIPY + 40} {TIPX - 290} {TIPY + 8}" stroke="#5b6274" stroke-width="12" fill="none" '
      f'stroke-linecap="round" opacity=".9"/>')
s.add(f'<path d="M{TIPX - 6} {TIPY + 6}C{TIPX - 60} {TIPY + 36} {TIPX - 110} {TIPY - 20} {TIPX - 170} {TIPY + 12}'
      f'S{TIPX - 250} {TIPY + 40} {TIPX - 290} {TIPY + 8}" stroke="#9aa2b4" stroke-width="4" fill="none" '
      f'stroke-linecap="round" opacity=".7"/>')

# tiny hexagon flakes between the tip and the stack
def hexagon(cx, cy, r, rotd, op):
    pts_ = [(cx + r * math.cos(math.radians(60 * k + rotd)), cy + r * math.sin(math.radians(60 * k + rotd)) * .6)
            for k in range(6)]
    s.add(f'<path d="{poly(pts_)}" fill="none" stroke="{mix(C, "#ffffff", .5)}" stroke-width="2.4" opacity="{op}"/>')
    for (x, y) in pts_:
        s.add(f'<circle cx="{f(x)}" cy="{f(y)}" r="3.4" fill="url(#bC)" stroke="#c9d1e6" stroke-opacity=".6" stroke-width="1" opacity="{op}"/>')


hexagon(TIPX - 6, TIPY - 66, 12, 10, .9)
hexagon(TIPX - 40, TIPY - 132, 16, 25, .85)
hexagon(TIPX + 26, TIPY - 150, 13, 0, .75)

s.calm_bottom(610)
s.save("twins")
