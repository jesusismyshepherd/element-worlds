"""Board 'football': the buckyball C60 next to a classic football; a nanotube rolls out of a sheet behind."""
import math
from lib import Svg, f, mix, poly, smooth, rot, norm

C = "#c3a6ff"
s = Svg(C, seed=61)
s.background(focus=(560, 320), focus_r=700, strength=.40, stars=90, bokeh=5)

PHI = (1 + 5 ** .5) / 2


def cyc(p):
    x, y, z = p
    return [(x, y, z), (z, x, y), (y, z, x)]


def signs(p):
    out = set()
    for sx in (-1, 1):
        for sy in (-1, 1):
            for sz in (-1, 1):
                out.add((p[0] * sx, p[1] * sy, p[2] * sz))
    return out


V = set()
for base in ((0, 1, 3 * PHI), (1, 2 + PHI, 2 * PHI), (PHI, 2, 2 * PHI + 1)):
    for q in signs(base):
        for c in cyc(q):
            V.add(tuple(round(a, 6) for a in c))
V = sorted(V)
assert len(V) == 60, len(V)
E = [(i, j) for i in range(60) for j in range(i + 1, 60) if abs(math.dist(V[i], V[j]) - 2) < 1e-3]
assert len(E) == 90, len(E)


def face_sets():
    pent_dirs = []
    for q in signs((0, 1, PHI)):
        for c in cyc(q):
            pent_dirs.append(norm(c))
    pent_dirs = list({tuple(round(a, 6) for a in d) for d in pent_dirs})
    hex_dirs = [norm(p) for p in signs((1, 1, 1))]
    for q in signs((0, PHI, 1 / PHI)):
        for c in cyc(q):
            hex_dirs.append(norm(c))
    hex_dirs = list({tuple(round(a, 6) for a in d) for d in hex_dirs})
    faces = []
    for dirs, n in ((pent_dirs, 5), (hex_dirs, 6)):
        for d in dirs:
            idx = sorted(range(60), key=lambda i: -sum(a * b for a, b in zip(V[i], d)))[:n]
            # order around d
            ref = V[idx[0]]
            u = norm(tuple(r - sum(a * b for a, b in zip(ref, d)) * dd for r, dd in zip(ref, d)))
            w = (d[1] * u[2] - d[2] * u[1], d[2] * u[0] - d[0] * u[2], d[0] * u[1] - d[1] * u[0])
            idx.sort(key=lambda i: math.atan2(sum(a * b for a, b in zip(V[i], w)), sum(a * b for a, b in zip(V[i], u))))
            faces.append((n, d, idx))
    return faces


FACES = face_sets()
assert sum(1 for n, _, _ in FACES if n == 5) == 12 and sum(1 for n, _, _ in FACES if n == 6) == 20
RC = math.sqrt(9 * PHI + 10)
LIGHT = norm((-.45, .6, .65))

# ------------------------------------------------------------------ nanotube rolling out of a sheet (background)
TB = 1.0  # bond length (sheet units)
R_T = 15 / (2 * math.pi)  # tube radius (closes after 5 hexagon rows)
U0 = 7.0   # flat part length
VH = 5.2   # sheet half width along the axis
VX = 9.0   # how far the tube sticks out beyond the sheet


def sheet_pt(u, v):
    if u <= U0:
        return (u, 0.0, v)
    th = (u - U0) / R_T
    return (U0 + R_T * math.sin(th), R_T * (1 - math.cos(th)), v)


r3 = math.sqrt(3)
umax = U0 + 2 * math.pi * R_T
atoms = {}
for i in range(-30, 60):
    for j in range(-40, 40):
        # zigzag along v: lattice with a1 = (r3, 0) in (v, u)... use u across, v along
        ux = j * 1.5 * TB
        vx = i * r3 * TB + (j % 2) * r3 / 2 * TB
        for key, (uu, vv) in ((("A", i, j), (ux, vx)), (("B", i, j), (ux + TB, vx))):
            inside_u = 0 <= uu < umax - .2
            if not inside_u:
                continue
            lim_hi = VH + (VX if uu > U0 + .3 else 0)
            if -VH <= vv <= lim_hi:
                atoms[key] = (uu, vv)
# bonds by distance in (u, v)
keys = list(atoms)
grid = {}
for k in keys:
    uu, vv = atoms[k]
    grid.setdefault((int(uu // 2), int(vv // 2)), []).append(k)
tb_bonds = []
for k in keys:
    uu, vv = atoms[k]
    for du in (-1, 0, 1):
        for dv in (-1, 0, 1):
            for k2 in grid.get((int(uu // 2) + du, int(vv // 2) + dv), []):
                if k2 <= k:
                    continue
                d = math.hypot(atoms[k2][0] - uu, atoms[k2][1] - vv)
                if abs(d - TB) < .05:
                    tb_bonds.append((k, k2))
# close the tube seam: atoms near u=umax connect to atoms near u=U0 with the same v
seam_lo = [k for k in keys if abs(atoms[k][0] - U0) < .8 and atoms[k][0] >= U0 - .01]

NX, NY, NS = 720, 150, 18


def cross(p, q):
    return (p[1] * q[2] - p[2] * q[1], p[2] * q[0] - p[0] * q[2], p[0] * q[1] - p[1] * q[0])


TA = norm((1, .05, -.2))
_tb = (0, .45, .9)
_d = sum(x * y for x, y in zip(TA, _tb))
TBN = norm(tuple(b - _d * a for a, b in zip(TA, _tb)))
TX_ = cross(TBN, TA)


def tproj(p):
    x, y, z = p[0] - U0, p[1], p[2]
    c = [x * TX_[i] + y * TBN[i] + z * TA[i] for i in range(3)]
    return NX + c[0] * NS, NY - c[1] * NS, c[2]


def hull(pts):
    pts = sorted(set(pts))
    def cr(o, a, b):
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
    lo, hi = [], []
    for p_ in pts:
        while len(lo) >= 2 and cr(lo[-2], lo[-1], p_) <= 0:
            lo.pop()
        lo.append(p_)
    for p_ in reversed(pts):
        while len(hi) >= 2 and cr(hi[-2], hi[-1], p_) <= 0:
            hi.pop()
        hi.append(p_)
    return lo[:-1] + hi[:-1]


_cyl = []
for k in range(48):
    for vv in (-VH, VH + VX):
        q = tproj(sheet_pt(U0 + 2 * math.pi * R_T * k / 48, vv))
        _cyl.append((round(q[0], 1), round(q[1], 1)))
s.add(f'<path d="{poly(hull(_cyl))}" fill="{C}" opacity=".16"/>')
# translucent glow of the flat sheet
_corn = [tproj(sheet_pt(u, v)) for u, v in ((0, -VH), (U0, -VH), (U0, VH), (0, VH))]
s.add(f'<path d="{poly([(c_[0], c_[1]) for c_ in _corn])}" fill="{C}" opacity=".16"/>')


P3 = {k: tproj(sheet_pt(*atoms[k])) for k in keys}
zs = [p[2] for p in P3.values()]
zmin, zmax = min(zs), max(zs)
segs = []
for a, b in tb_bonds:
    pa, pb = P3[a], P3[b]
    z = (pa[2] + pb[2]) / 2
    segs.append((z, pa, pb))
segs.sort(key=lambda t: t[0])
buckets = [[] for _ in range(4)]
for z, pa, pb in segs:
    d = (z - zmin) / (zmax - zmin + 1e-9)
    buckets[min(3, int(d * 4))].append(f"M{f(pa[0])} {f(pa[1])}L{f(pb[0])} {f(pb[1])}")
s.add(f'<g opacity=".9">')
for i, bk in enumerate(buckets):
    col = mix(C, "#ffffff", .15 + .2 * i)
    s.add(f'<path d="{"".join(bk)}" stroke="{col}" stroke-width="{2 + .8 * i:.1f}" stroke-linecap="round" fill="none" '
          f'opacity="{.25 + .2 * i:.2f}"/>')
s.add("</g>")

# ------------------------------------------------------------------ the buckyball
BX, BY, BR = 380, 318, 214
SCL = BR / RC
AX, AY = .32, .52


def bproj(p):
    q = rot(p, AX, AY)
    return BX + q[0] * SCL, BY - q[1] * SCL, q[2]


PB = [bproj(p) for p in V]
ZT = .3 * RC  # atoms and bonds this far behind the middle still count as the front rim
s.rad("bbHalo", [(0, C, .55), (.6, C, .18), (1, C, 0)])
s.add(f'<circle cx="{BX}" cy="{BY}" r="{BR + 90}" fill="url(#bbHalo)"/>')
# faces: back ones first (dim), then front
fitems = []
for n, d, idx in FACES:
    nd = rot(d, AX, AY)
    fitems.append((nd[2], n, nd, idx))
fitems.sort(key=lambda t: t[0])


def face_fill(n, nd, front):
    lam = max(0, sum(a * b for a, b in zip(nd, LIGHT)))
    if n == 5:
        col = mix("#1d2130", "#5b6378", lam * .8)
        op = .92 if front else .35
    else:
        col = mix("#7f6ac0", "#f4f0ff", .35 + .65 * lam)
        op = .5 if front else .12
    return col, op


# back faces
for z, n, nd, idx in fitems:
    if z >= 0:
        continue
    col, op = face_fill(n, nd, False)
    s.add(f'<path d="{poly([(PB[i][0], PB[i][1]) for i in idx])}" fill="{col}" opacity="{op}"/>')
# back bonds and atoms
back_b = [f"M{f(PB[a][0])} {f(PB[a][1])}L{f(PB[b][0])} {f(PB[b][1])}" for a, b in E if PB[a][2] + PB[b][2] < -ZT]
s.add(f'<path d="{"".join(back_b)}" stroke="{mix(C, "#ffffff", .3)}" stroke-width="5" stroke-linecap="round" opacity=".35"/>')
for i in sorted(range(60), key=lambda i: PB[i][2]):
    if PB[i][2] < -ZT / 2:
        s.ball(PB[i][0], PB[i][1], 10, "C", opacity=.45, spec=False)
# front faces
for z, n, nd, idx in fitems:
    if z < 0:
        continue
    col, op = face_fill(n, nd, True)
    s.add(f'<path d="{poly([(PB[i][0], PB[i][1]) for i in idx])}" fill="{col}" opacity="{op}"/>')
# front bonds
front_b = [(PB[a][2] + PB[b][2], a, b) for a, b in E if PB[a][2] + PB[b][2] >= -ZT]
front_b.sort()
s.add('<g stroke-linecap="round">')
for z, a, b in front_b:
    s.bond(PB[a][0], PB[a][1], PB[b][0], PB[b][1], 9, "#2a2f3c")
    s.bond(PB[a][0], PB[a][1], PB[b][0], PB[b][1], 5, "#e9e3ff")
s.add("</g>")
for i in sorted(range(60), key=lambda i: PB[i][2]):
    if PB[i][2] >= -ZT / 2:
        zz = PB[i][2] / RC
        s.ball(PB[i][0], PB[i][1], 11 + 5 * zz, "C")

# ------------------------------------------------------------------ the football
FX, FY, FR = 880, 446, 152
FAX, FAY = .2, .75


def fproj(p):
    q = rot(norm(p), FAX, FAY)
    if q[2] < 0:
        l = math.hypot(q[0], q[1]) or 1
        return FX + q[0] / l * FR, FY - q[1] / l * FR, q[2]
    return FX + q[0] * FR, FY - q[1] * FR, q[2]


s.add(f'<circle cx="{FX + 14}" cy="{FY + 18}" r="{FR + 4}" fill="#000" opacity=".35" filter="url(#blur16)"/>')
s.add_def("ballClip", f'<clipPath id="ballClip"><circle cx="{FX}" cy="{FY}" r="{FR}"/></clipPath>')
s.add(f'<circle cx="{FX}" cy="{FY}" r="{FR}" fill="#f7f5ff"/>')
s.add('<g clip-path="url(#ballClip)">')
for n, d, idx in FACES:
    nd = rot(d, FAX, FAY)
    if nd[2] < -.35:
        continue
    pts = []
    for k in range(len(idx)):
        a, b = V[idx[k]], V[idx[(k + 1) % len(idx)]]
        for t in range(8):
            u = t / 8
            p = tuple(a[j] + (b[j] - a[j]) * u for j in range(3))
            # bulge seams slightly toward the face centre so panels look stitched and puffy
            pts.append(fproj(p))
    col = "#1f2230" if n == 5 else "#f7f5ff"
    s.add(f'<path d="{poly([(p[0], p[1]) for p in pts])}" fill="{col}" stroke="#a49cc4" stroke-width="2.4" stroke-linejoin="round"/>')
s.add("</g>")
s.rad("ballShade", [(0, "#ffffff", .55), (.35, "#ffffff", 0), (.8, "#2a1f55", .28), (1, "#120c2e", .6)],
      cx=.36, cy=.32, r=.75)
s.add(f'<circle cx="{FX}" cy="{FY}" r="{FR}" fill="url(#ballShade)"/>')
s.add(f'<circle cx="{FX}" cy="{FY}" r="{FR}" fill="none" stroke="{C}" stroke-width="4" opacity=".8"/>')
s.add(f'<ellipse cx="{FX - 62}" cy="{FY - 76}" rx="34" ry="20" fill="#fff" opacity=".45" transform="rotate(-35 {FX - 62} {FY - 76})"/>')

# speed lines: the ball is flying in from the right
for k, (dy, ln, op) in enumerate(((-62, 55, .55), (-12, 80, .7), (38, 65, .55), (86, 45, .4))):
    a0 = math.radians(-8)
    x0 = FX + math.sqrt(max(0, FR * FR - dy * dy)) + 16
    s.add(f'<path d="M{f(x0)} {f(FY + dy)}l{ln} {f(-ln * .12)}" stroke="#ffffff" stroke-width="{7 - k}" '
          f'stroke-linecap="round" opacity="{op}"/>')
for (x, y, sz) in ((BX + 210, BY - 190, 16), (FX + 150, FY - 150, 13), (BX - 230, BY + 120, 11)):
    s.sparkle(x, y, sz, "#ffffff", .9)

s.calm_bottom(612)
s.save("football")
