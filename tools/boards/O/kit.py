"""Shared drawing kit for the Oxygen hall boards (one series look).

Every board: 1200 x 800, no text, navy background tinted with the board colour,
the same atom balls, glows, star field and a calm bottom band (the caption covers it).
"""
import math
import os
import random

W, H = 1200, 800
OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "..", "public", "boards", "O")
NAVY_DEEP = "#0b0f24"
NAVY = "#1b2250"


def f(v):
    s = f"{v:.1f}"
    if s.endswith(".0"):
        s = s[:-2]
    if s == "-0":
        s = "0"
    return s


def P(points):
    return " ".join(f"{f(x)},{f(y)}" for x, y in points)


def hex2rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def rgb2hex(c):
    return "#%02x%02x%02x" % tuple(max(0, min(255, int(round(v)))) for v in c)


def mix(a, b, t):
    ca, cb = hex2rgb(a), hex2rgb(b)
    return rgb2hex([ca[i] + (cb[i] - ca[i]) * t for i in range(3)])


def stop(t):
    o, c = t[0], t[1]
    a = t[2] if len(t) > 2 else None
    s = f'<stop offset="{o}" stop-color="{c}"'
    if a is not None:
        s += f' stop-opacity="{a}"'
    return s + "/>"


def lin(gid, stops, x1=0, y1=0, x2=0, y2=1, user=False):
    u = ' gradientUnits="userSpaceOnUse"' if user else ""
    return (f'<linearGradient id="{gid}" x1="{f(x1)}" y1="{f(y1)}" x2="{f(x2)}" y2="{f(y2)}"{u}>'
            + "".join(stop(s) for s in stops) + "</linearGradient>")


def rad(gid, stops, cx=0.5, cy=0.5, r=0.5, fx=None, fy=None, user=False):
    u = ' gradientUnits="userSpaceOnUse"' if user else ""
    fxy = ""
    if fx is not None:
        fxy = f' fx="{f(fx) if user else fx}" fy="{f(fy) if user else fy}"'
    cxs = f(cx) if user else cx
    cys = f(cy) if user else cy
    rs = f(r) if user else r
    return (f'<radialGradient id="{gid}" cx="{cxs}" cy="{cys}" r="{rs}"{fxy}{u}>'
            + "".join(stop(s) for s in stops) + "</radialGradient>")


def smooth(points, closed=True, k=1.0):
    """Catmull-Rom spline through points as an SVG path string."""
    n = len(points)
    if n < 3:
        return "M" + " L".join(f"{f(x)},{f(y)}" for x, y in points)
    d = f"M{f(points[0][0])},{f(points[0][1])}"
    rng = range(n) if closed else range(n - 1)
    for i in rng:
        p0 = points[(i - 1) % n] if (closed or i > 0) else points[0]
        p1 = points[i]
        p2 = points[(i + 1) % n]
        p3 = points[(i + 2) % n] if (closed or i + 2 < n) else points[-1]
        c1 = (p1[0] + (p2[0] - p0[0]) / 6 * k, p1[1] + (p2[1] - p0[1]) / 6 * k)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6 * k, p2[1] - (p3[1] - p1[1]) / 6 * k)
        d += f" C{f(c1[0])},{f(c1[1])} {f(c2[0])},{f(c2[1])} {f(p2[0])},{f(p2[1])}"
    return d + ("Z" if closed else "")


def bez(p0, p1, p2, p3, t):
    u = 1 - t
    x = u**3 * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t**3 * p3[0]
    y = u**3 * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t**3 * p3[1]
    dx = 3 * u * u * (p1[0] - p0[0]) + 6 * u * t * (p2[0] - p1[0]) + 3 * t * t * (p3[0] - p2[0])
    dy = 3 * u * u * (p1[1] - p0[1]) + 6 * u * t * (p2[1] - p1[1]) + 3 * t * t * (p3[1] - p2[1])
    return x, y, math.degrees(math.atan2(dy, dx))


BALLS = {
    # highlight, mid, dark
    "O": ("#ffd6d6", "#ff4d4d", "#a8121e"),
    "H": ("#ffffff", "#eef1f8", "#9aa3b8"),
    "C": ("#9aa2b4", "#3a3f4b", "#15171e"),
    "N": ("#cddaff", "#4d7dff", "#1c379e"),
}


class Svg:
    def __init__(self, color):
        self.color = color
        self.defs = []
        self.body = []
        self._ids = set()
        self._common()

    def d(self, *s):
        self.defs.extend(s)

    def a(self, *s):
        self.body.extend(s)

    def _common(self):
        for el, (hi, mid, dark) in BALLS.items():
            self.d(rad(f"b{el}", [(0, hi), (0.28, mid), (0.78, mix(mid, dark, 0.55)), (1, dark)],
                       cx=0.36, cy=0.32, r=0.72, fx=0.32, fy=0.26))
        region = 'x="-600" y="-600" width="2400" height="2000" filterUnits="userSpaceOnUse"'
        for name, sd in (("g1", 3), ("g2", 6), ("g3", 12), ("g4", 22)):
            self.d(f'<filter id="{name}" {region}><feGaussianBlur stdDeviation="{sd}" result="b"/>'
                   '<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>')
        for name, sd in (("s1", 1.2), ("s2", 2.5), ("s4", 4), ("s8", 8), ("s16", 16), ("s30", 30)):
            self.d(f'<filter id="{name}" {region}><feGaussianBlur stdDeviation="{sd}"/></filter>')

    def text(self):
        return ('<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">'
                "<defs>" + "".join(self.defs) + "</defs>" + "".join(self.body) + "</svg>")

    def save(self, name):
        os.makedirs(OUT_DIR, exist_ok=True)
        path = os.path.join(OUT_DIR, name + ".svg")
        txt = self.text()
        assert "<text" not in txt
        tmp = path + ".tmp"
        with open(tmp, "w", encoding="utf-8", newline="\n") as fh:
            fh.write(txt)
        os.replace(tmp, path)
        return path, len(txt.encode("utf-8"))


def ball(cx, cy, r, el="O", rim=None, rim_w=None, shine=True, op=None):
    o = f' opacity="{op}"' if op is not None else ""
    s = f'<g{o}>'
    if rim:
        s += f'<circle cx="{f(cx)}" cy="{f(cy)}" r="{f(r + (rim_w or max(1.5, r * 0.08)))}" fill="{rim}"/>'
    s += (f'<circle cx="{f(cx)}" cy="{f(cy)}" r="{f(r)}" fill="url(#b{el})" stroke="#000" '
          f'stroke-opacity="0.22" stroke-width="{f(max(0.8, r * 0.04))}"/>')
    if shine and r >= 7:
        s += (f'<ellipse cx="{f(cx - r * 0.34)}" cy="{f(cy - r * 0.42)}" rx="{f(r * 0.34)}" ry="{f(r * 0.2)}" '
              f'transform="rotate(-32 {f(cx - r * 0.34)} {f(cy - r * 0.42)})" fill="#fff" opacity="0.6"/>')
    return s + "</g>"


def o2(cx, cy, r, ang=0, rim=None, op=None, shine=True):
    """Oxygen molecule: two red balls (space filling, overlapping)."""
    d = r * 1.12
    a = math.radians(ang)
    dx, dy = math.cos(a) * d / 2, math.sin(a) * d / 2
    pts = sorted([(cx - dx, cy - dy), (cx + dx, cy + dy)], key=lambda p: p[1])
    return "".join(ball(x, y, r, "O", rim=rim, op=op, shine=shine) for x, y in pts)


def o3(cx, cy, r, ang=0, op=None, shine=True):
    """Ozone: three O balls, bent about 117 degrees (centre atom at the apex)."""
    d = r * 1.18
    half = math.radians(58.4)
    a = math.radians(ang)
    pts = [(0, -d * 0.35)]
    for sgn in (-1, 1):
        pts.append((sgn * d * math.sin(half), -d * 0.35 + d * math.cos(half)))
    out = []
    for x, y in pts:
        rx = x * math.cos(a) - y * math.sin(a)
        ry = x * math.sin(a) + y * math.cos(a)
        out.append((cx + rx, cy + ry))
    out.sort(key=lambda p: p[1])
    return "".join(ball(x, y, r, "O", op=op, shine=shine) for x, y in out)


def background(s, glows, seed=1, stars=60, star_box=(0, 0, 1200, 640), tint=0.62, bokeh=6):
    """Navy gradient tinted with the board colour, soft colour glows, small stars and bokeh."""
    c = s.color
    s.d(lin("bgA", [(0, mix(c, NAVY, tint)), (0.42, NAVY), (1, NAVY_DEEP)], x1=0, y1=0, x2=0.55, y2=1))
    s.d(rad("bgG", [(0, c, 0.5), (0.35, c, 0.22), (0.7, c, 0.06), (1, c, 0)]))
    s.d(lin("bgB", [(0, NAVY_DEEP, 0), (1, NAVY_DEEP, 0.75)], x1=0, y1=0.74, x2=0, y2=1))
    s.d(rad("bgV", [(0.55, NAVY_DEEP, 0), (1, NAVY_DEEP, 0.55)], cx=0.5, cy=0.45, r=0.75))
    s.a('<rect width="1200" height="800" fill="url(#bgA)"/>')
    for (x, y, r, op) in glows:
        s.a(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r)}" fill="url(#bgG)" opacity="{op}"/>')
    rnd = random.Random(seed)
    x0, y0, x1, y1 = star_box
    tintc = mix(c, "#ffffff", 0.55)
    parts = []
    for i in range(bokeh):
        x, y = rnd.uniform(x0, x1), rnd.uniform(y0, y1)
        parts.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(rnd.uniform(18, 46))}" fill="{c}" '
                     f'opacity="{rnd.uniform(0.04, 0.09):.2f}"/>')
    for i in range(stars):
        x, y = rnd.uniform(x0, x1), rnd.uniform(y0, y1)
        r = rnd.choice([0.9, 1.1, 1.3, 1.6, 2.0])
        col = tintc if rnd.random() < 0.4 else "#ffffff"
        parts.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r)}" fill="{col}" opacity="{rnd.uniform(0.35, 0.9):.2f}"/>')
    for i in range(max(2, stars // 14)):
        x, y = rnd.uniform(x0, x1), rnd.uniform(y0, y1)
        parts.append(sparkle(x, y, rnd.uniform(5, 9), "#ffffff", rnd.uniform(0.55, 0.9)))
    s.a('<g>' + "".join(parts) + '</g>')


def finish(s):
    """Vignette and the calm bottom band under the caption."""
    s.a('<rect width="1200" height="800" fill="url(#bgV)"/>',
        '<rect width="1200" height="800" fill="url(#bgB)"/>')


def sparkle(x, y, r, col="#fff", op=0.9):
    k = r * 0.22
    pts = [(x, y - r), (x + k, y - k), (x + r, y), (x + k, y + k), (x, y + r), (x - k, y + k), (x - r, y), (x - k, y - k)]
    return f'<polygon points="{P(pts)}" fill="{col}" opacity="{op:.2f}"/>'


def star_burst(x, y, r_out, r_in, n, col, op=1.0, rot=0):
    pts = []
    for i in range(2 * n):
        a = math.radians(rot + i * 180 / n - 90)
        r = r_out if i % 2 == 0 else r_in
        pts.append((x + r * math.cos(a), y + r * math.sin(a)))
    return f'<polygon points="{P(pts)}" fill="{col}" opacity="{op}"/>'
