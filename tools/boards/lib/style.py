"""The shared look of every hall's picture boards (docs/knowledge/hall-boards.md), so the halls read as
one series. Started on 2026-10-30 from Carbon's C/lib.py and Oxygen's O/kit.py (those two stay as they
are); sodium was the first element drawn with it.

Every board: 1200 x 800, no words, the hall's navy tinted with the board's colour, atoms as shaded balls
in CPK colours, soft glows, a few stars and bokeh, and the bottom 22% kept calm (the caption band covers
it on the wall). A picture script:

    import os, sys
    sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
    from lib.style import *

    s = Svg("Na", "#ff6fa8")
    background(s, glows=[(600, 300, 420, 0.8)], seed=3)
    s.a(ball(600, 300, 60, "Na"))
    finish(s)
    s.save("nerves")          # -> public/boards/Na/nerves.svg

Strings are built by the helpers below and added with s.a(...) (body) or s.d(...) (defs). Gradients and
filters every board can use without defining them: url(#b<El>) for each ball, glow filters g1..g4 (blur
merged over the shape), plain blurs s1, s2, s4, s8, s16, s30.
"""
import math
import os
import random

W, H = 1200, 800
CALM_TOP = 624  # the caption band covers y > 624 (the bottom 22%)
ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", ".."))
NAVY_DEEP = "#0b0f24"
NAVY = "#1b2250"


# ---------- numbers, colours, paths ----------
def f(v):
    """A compact number for SVG."""
    s = f"{v:.1f}"
    if s.endswith(".0"):
        s = s[:-2]
    if s == "-0":
        s = "0"
    return s


def P(points):
    """Points for a polygon or polyline."""
    return " ".join(f"{f(x)},{f(y)}" for x, y in points)


def poly(points, closed=True):
    s = "M" + " L".join(f"{f(x)},{f(y)}" for x, y in points)
    return s + ("Z" if closed else "")


def hex2rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def rgb2hex(c):
    return "#%02x%02x%02x" % tuple(max(0, min(255, int(round(v)))) for v in c)


def mix(a, b, t):
    ca, cb = hex2rgb(a), hex2rgb(b)
    return rgb2hex([ca[i] + (cb[i] - ca[i]) * t for i in range(3)])


def smooth(points, closed=True, k=1.0):
    """A Catmull-Rom spline through the points, as an SVG path."""
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
    """A point on a cubic Bezier and its heading in degrees."""
    u = 1 - t
    x = u**3 * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t**3 * p3[0]
    y = u**3 * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t**3 * p3[1]
    dx = 3 * u * u * (p1[0] - p0[0]) + 6 * u * t * (p2[0] - p1[0]) + 3 * t * t * (p3[0] - p2[0])
    dy = 3 * u * u * (p1[1] - p0[1]) + 6 * u * t * (p2[1] - p1[1]) + 3 * t * t * (p3[1] - p2[1])
    return x, y, math.degrees(math.atan2(dy, dx))


def rot3(p, ax=0.0, ay=0.0, az=0.0):
    """A 3D point turned about x, then y, then z (for drawing molecules in perspective)."""
    x, y, z = p
    c, s = math.cos(ax), math.sin(ax)
    y, z = y * c - z * s, y * s + z * c
    c, s = math.cos(ay), math.sin(ay)
    x, z = x * c + z * s, -x * s + z * c
    c, s = math.cos(az), math.sin(az)
    x, y = x * c - y * s, x * s + y * c
    return (x, y, z)


# ---------- gradients ----------
def _stop(t):
    o, c = t[0], t[1]
    a = t[2] if len(t) > 2 else None
    s = f'<stop offset="{o}" stop-color="{c}"'
    if a is not None:
        s += f' stop-opacity="{a}"'
    return s + "/>"


def lin(gid, stops, x1=0, y1=0, x2=0, y2=1, user=False):
    """A linear gradient for s.d(...): stops are (offset, colour) or (offset, colour, opacity)."""
    u = ' gradientUnits="userSpaceOnUse"' if user else ""
    return (f'<linearGradient id="{gid}" x1="{f(x1)}" y1="{f(y1)}" x2="{f(x2)}" y2="{f(y2)}"{u}>'
            + "".join(_stop(s) for s in stops) + "</linearGradient>")


def rad(gid, stops, cx=0.5, cy=0.5, r=0.5, fx=None, fy=None, user=False):
    u = ' gradientUnits="userSpaceOnUse"' if user else ""
    fxy = ""
    if fx is not None:
        fxy = f' fx="{f(fx) if user else fx}" fy="{f(fy) if user else fy}"'
    cxs = f(cx) if user else cx
    cys = f(cy) if user else cy
    rs = f(r) if user else r
    return (f'<radialGradient id="{gid}" cx="{cxs}" cy="{cys}" r="{rs}"{fxy}{u}>'
            + "".join(_stop(s) for s in stops) + "</radialGradient>")


# ---------- atoms: CPK colours (Jmol's, a little deepened so they shade) ----------
BALLS = {
    # highlight, mid, dark
    "H": ("#ffffff", "#eef1f8", "#9aa3b8"),
    "C": ("#9aa2b4", "#3a3f4b", "#15171e"),
    "N": ("#cddaff", "#4d7dff", "#1c379e"),
    "O": ("#ffd6d6", "#ff4d4d", "#a8121e"),
    "Na": ("#f0e2ff", "#ab5cf2", "#4f1f8c"),
    "K": ("#e2ccff", "#8f40d4", "#3c1470"),
    "Mg": ("#efffd0", "#8aff00", "#3f7a00"),
    "Ca": ("#e4ffd9", "#3ddc2a", "#1a6e10"),
    "Cl": ("#e0ffd8", "#1ff01f", "#0b7a16"),
    "S": ("#fff6c4", "#ffd84d", "#a88a12"),
    "P": ("#ffe1c2", "#ff8000", "#a04800"),
    "Fe": ("#ffd9c8", "#e06633", "#7a2a10"),
}


class Svg:
    """One board picture: defs and body, saved to public/boards/<symbol>/<name>.svg."""

    def __init__(self, symbol, color):
        self.symbol = symbol
        self.color = color
        self.defs = []
        self.body = []
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
        return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">'
                "<defs>" + "".join(self.defs) + "</defs>" + "".join(self.body) + "</svg>")

    def save(self, name):
        txt = self.text()
        # no words (the title is drawn in the visitor's language), nothing loaded from elsewhere
        for bad in ("<text", "<script", "href", "<image", "<foreignObject"):
            assert bad not in txt, f"{name}: {bad} in the picture"
        out = os.path.join(ROOT, "public", "boards", self.symbol)
        os.makedirs(out, exist_ok=True)
        path = os.path.join(out, name + ".svg")
        tmp = path + ".tmp"
        with open(tmp, "w", encoding="utf-8", newline="\n") as fh:
            fh.write(txt)
        os.replace(tmp, path)
        print(f"{path}: {len(txt.encode('utf-8')) / 1024:.1f} KB")
        return path


# ---------- the series' background and finish ----------
def background(s, glows=(), seed=1, stars=60, star_box=(0, 0, W, 600), tint=0.62, bokeh=6, wash=True):
    """The navy, tinted with the board's colour from the top, soft colour glows (x, y, r, opacity),
    small stars, sparkles and bokeh."""
    c = s.color
    s.d(lin("bgA", [(0, mix(c, NAVY, tint)), (0.42, NAVY), (1, NAVY_DEEP)], x1=0, y1=0, x2=0.55, y2=1),
        rad("bgG", [(0, c, 0.5), (0.35, c, 0.22), (0.7, c, 0.06), (1, c, 0)]),
        lin("bgB", [(0, NAVY_DEEP, 0), (1, NAVY_DEEP, 0.78)], x1=0, y1=0.74, x2=0, y2=1),
        rad("bgV", [(0.55, NAVY_DEEP, 0), (1, NAVY_DEEP, 0.55)], cx=0.5, cy=0.45, r=0.75),
        lin("bgW", [(0, c, 0.2), (0.5, c, 0)], x1=0, y1=0, x2=0.55, y2=0.8),
        lin("bgW2", [(0, c, 0.12), (0.45, c, 0)], x1=1, y1=0, x2=0.45, y2=0.8))
    s.a(f'<rect width="{W}" height="{H}" fill="url(#bgA)"/>')
    if wash:
        s.a(f'<rect width="{W}" height="{H}" fill="url(#bgW)"/><rect width="{W}" height="{H}" fill="url(#bgW2)"/>')
    for (x, y, r, op) in glows:
        s.a(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r)}" fill="url(#bgG)" opacity="{op}"/>')
    s.a(starfield(c, seed, stars, star_box, bokeh))


def starfield(c, seed=1, stars=60, box=(0, 0, W, 600), bokeh=6):
    rnd = random.Random(seed)
    x0, y0, x1, y1 = box
    tintc = mix(c, "#ffffff", 0.55)
    parts = []
    for _ in range(bokeh):
        x, y = rnd.uniform(x0, x1), rnd.uniform(y0, y1)
        parts.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(rnd.uniform(18, 46))}" fill="{c}" '
                     f'opacity="{rnd.uniform(0.04, 0.09):.2f}"/>')
    for _ in range(stars):
        x, y = rnd.uniform(x0, x1), rnd.uniform(y0, y1)
        r = rnd.choice([0.9, 1.1, 1.3, 1.6, 2.0])
        col = tintc if rnd.random() < 0.4 else "#ffffff"
        parts.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r)}" fill="{col}" opacity="{rnd.uniform(0.35, 0.9):.2f}"/>')
    for _ in range(max(2, stars // 14) if stars else 0):
        x, y = rnd.uniform(x0, x1), rnd.uniform(y0, y1)
        parts.append(sparkle(x, y, rnd.uniform(5, 9), "#ffffff", rnd.uniform(0.55, 0.9)))
    return "<g>" + "".join(parts) + "</g>"


def finish(s, vignette=True):
    """The vignette and the calm bottom band under the caption."""
    if vignette:
        s.a(f'<rect width="{W}" height="{H}" fill="url(#bgV)"/>')
    s.a(f'<rect width="{W}" height="{H}" fill="url(#bgB)"/>')


# ---------- pieces ----------
def ball(cx, cy, r, el="O", rim=None, rim_w=None, shine=True, op=None):
    """An atom: a shaded ball in its CPK colour, with a highlight."""
    o = f' opacity="{op}"' if op is not None else ""
    s = f"<g{o}>"
    if rim:
        s += f'<circle cx="{f(cx)}" cy="{f(cy)}" r="{f(r + (rim_w or max(1.5, r * 0.08)))}" fill="{rim}"/>'
    s += (f'<circle cx="{f(cx)}" cy="{f(cy)}" r="{f(r)}" fill="url(#b{el})" stroke="#000" '
          f'stroke-opacity="0.22" stroke-width="{f(max(0.8, r * 0.04))}"/>')
    if shine and r >= 7:
        s += (f'<ellipse cx="{f(cx - r * 0.34)}" cy="{f(cy - r * 0.42)}" rx="{f(r * 0.34)}" ry="{f(r * 0.2)}" '
              f'transform="rotate(-32 {f(cx - r * 0.34)} {f(cy - r * 0.42)})" fill="#fff" opacity="0.6"/>')
    return s + "</g>"


def charge(cx, cy, size, sign="+", color="#ffffff", ink="#1a0a33"):
    """A bold plus or minus (a shape, not a letter), `size` across: an ion's charge. A small badge beside
    the ball read as an eye; the sign on the ball itself reads as a charge."""
    w = size
    t = max(2, size * 0.28)
    def bars(dx, dy, fill, op=""):
        s = (f'<rect x="{f(cx - w / 2 + dx)}" y="{f(cy - t / 2 + dy)}" width="{f(w)}" height="{f(t)}" rx="{f(t / 2)}" '
             f'fill="{fill}"{op}/>')
        if sign == "+":
            s += (f'<rect x="{f(cx - t / 2 + dx)}" y="{f(cy - w / 2 + dy)}" width="{f(t)}" height="{f(w)}" rx="{f(t / 2)}" '
                  f'fill="{fill}"{op}/>')
        return s
    return bars(1.2, 1.6, ink, ' opacity="0.45"') + bars(0, 0, color)


def ion(cx, cy, r, el="Na", sign="+", op=None, shine=True):
    """An ion: its ball with its charge on it."""
    o = f' opacity="{op}"' if op is not None else ""
    return f"<g{o}>" + ball(cx, cy, r, el, shine=shine) + charge(cx + r * 0.08, cy + r * 0.1, r * 0.95, sign) + "</g>"


def bond(x1, y1, x2, y2, w, color="#cfd6e8", op=None):
    o = f' opacity="{op}"' if op is not None else ""
    return (f'<line x1="{f(x1)}" y1="{f(y1)}" x2="{f(x2)}" y2="{f(y2)}" stroke="{color}" stroke-width="{f(w)}" '
            f'stroke-linecap="round"{o}/>')


def co2(cx, cy, r, ang=0, op=None):
    """Carbon dioxide: a dark carbon between two red oxygens, in a line."""
    a = math.radians(ang)
    d = r * 1.55
    dx, dy = math.cos(a) * d, math.sin(a) * d
    return (f'<g{f" opacity={chr(34)}{op}{chr(34)}" if op is not None else ""}>'
            + ball(cx - dx, cy - dy, r * 0.92, "O") + ball(cx + dx, cy + dy, r * 0.92, "O") + ball(cx, cy, r, "C") + "</g>")


def h2o(cx, cy, r, ang=0, op=None):
    """Water: a red oxygen with two white hydrogens at 104.5 degrees."""
    a = math.radians(ang)
    out = []
    for side in (-1, 1):
        t = a + math.radians(90 + side * 52.25)
        out.append(ball(cx + math.cos(t) * r * 0.95, cy + math.sin(t) * r * 0.95, r * 0.6, "H"))
    o = f' opacity="{op}"' if op is not None else ""
    return f"<g{o}>" + ball(cx, cy, r, "O") + "".join(out) + "</g>"


def sparkle(x, y, r, col="#fff", op=0.9):
    """A four-pointed star."""
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


def glow(x, y, r, col, op=1.0, blur="s16"):
    """A soft round glow."""
    return f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r)}" fill="{col}" opacity="{op}" filter="url(#{blur})"/>'


def arrow(points, col, w=6, head=None, op=1.0, dash=None):
    """A smooth arrow through the points, its head at the last one."""
    head = head or w * 3.2
    (x1, y1), (x2, y2) = points[-2], points[-1]
    a = math.atan2(y2 - y1, x2 - x1)
    tip = (x2, y2)
    back = (x2 - math.cos(a) * head, y2 - math.sin(a) * head)
    side = (math.cos(a + math.pi / 2) * head * 0.55, math.sin(a + math.pi / 2) * head * 0.55)
    pts = list(points[:-1]) + [back]
    da = f' stroke-dasharray="{dash}"' if dash else ""
    return (f'<g opacity="{op}"><path d="{smooth(pts, closed=False)}" fill="none" stroke="{col}" stroke-width="{f(w)}" '
            f'stroke-linecap="round"{da}/>'
            f'<polygon points="{P([tip, (back[0] + side[0], back[1] + side[1]), (back[0] - side[0], back[1] - side[1])])}" '
            f'fill="{col}"/></g>')


def magnifier(s, gid, cx, cy, r, color, src=None, inner="#141a3e"):
    """A round close-up window (as Carbon's and Oxygen's boards zoom into a star or a cell): returns
    (open, close) strings; draw the close-up between them. With src=(x, y, r0), a cone of light joins the
    spot it magnifies."""
    s.d(f'<clipPath id="{gid}"><circle cx="{f(cx)}" cy="{f(cy)}" r="{f(r)}"/></clipPath>',
        rad(gid + "In", [(0, mix(inner, color, 0.18)), (1, inner)]))
    pre = ""
    if src:
        x0, y0, r0 = src
        a = math.atan2(cy - y0, cx - x0)
        n = (math.cos(a + math.pi / 2), math.sin(a + math.pi / 2))
        pts = [(x0 + n[0] * r0, y0 + n[1] * r0), (cx + n[0] * r * 0.92, cy + n[1] * r * 0.92),
               (cx - n[0] * r * 0.92, cy - n[1] * r * 0.92), (x0 - n[0] * r0, y0 - n[1] * r0)]
        pre = (f'<polygon points="{P(pts)}" fill="{color}" opacity="0.1"/>'
               f'<circle cx="{f(x0)}" cy="{f(y0)}" r="{f(r0)}" fill="none" stroke="{color}" stroke-width="3" '
               f'stroke-dasharray="6 6" opacity="0.8"/>')
    opening = (pre + glow(cx, cy, r * 1.04, color, 0.35, "s16")
               + f'<circle cx="{f(cx)}" cy="{f(cy)}" r="{f(r)}" fill="url(#{gid}In)"/>'
               + f'<g clip-path="url(#{gid})">')
    closing = (f'</g><circle cx="{f(cx)}" cy="{f(cy)}" r="{f(r)}" fill="none" stroke="{mix(color, "#ffffff", 0.35)}" '
               f'stroke-width="7"/>'
               f'<path d="M{f(cx - r * 0.72)},{f(cy - r * 0.42)} A{f(r * 0.86)},{f(r * 0.86)} 0 0 1 {f(cx - r * 0.2)},{f(cy - r * 0.82)}" '
               f'fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity="0.45"/>')
    return opening, closing
