"""Shared drawing kit for the Carbon hall boards (one series look).

Every board: 1200 x 800, no text, navy background tinted with the board colour,
the same atom balls, glows, star field and calm bottom band.
"""
import math
import os
import random

W, H = 1200, 800
OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "..", "public", "boards", "C")

NAVY_DEEP = "#0b0f24"
NAVY = "#1b2250"


def f(v):
    """Compact number for SVG."""
    s = f"{v:.1f}"
    if s.endswith(".0"):
        s = s[:-2]
    if s == "-0":
        s = "0"
    return s


def hex2rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def rgb2hex(c):
    return "#%02x%02x%02x" % tuple(max(0, min(255, int(round(v)))) for v in c)


def mix(a, b, t):
    ca, cb = hex2rgb(a), hex2rgb(b)
    return rgb2hex([ca[i] + (cb[i] - ca[i]) * t for i in range(3)])


# Atom ball palettes: highlight, mid, dark, rim (None = no rim)
BALLS = {
    "C": ("#9aa2b4", "#3a3f4b", "#15171e", "#c9d1e6"),
    "O": ("#ffd0d0", "#ff4d4d", "#a8121e", None),
    "H": ("#ffffff", "#eef1f8", "#a3abc0", None),
    "N": ("#cddaff", "#4d7dff", "#1c379e", None),
    "p": ("#ffd0c8", "#ff4f45", "#a5121a", None),
    "n": ("#e3e8f2", "#8f9bb5", "#4a5472", None),
    "Ca": ("#e4ffd9", "#6fd35e", "#2c7a24", None),
    "P": ("#ffe1c2", "#ff9a3c", "#b0560c", None),
    "S": ("#fff6c4", "#ffd84d", "#a88a12", None),
    "K": ("#ead9ff", "#b07cff", "#5a2fa8", None),
    "gold": ("#fff4cf", "#ffc94d", "#a8730c", None),
    "C14": ("#e6fff4", "#5ef0b4", "#13855a", None),
}


def smooth(points, closed=True, tension=1.0):
    """Catmull-Rom spline through points as an SVG path string."""
    n = len(points)
    if n < 2:
        return ""
    pts = list(points)
    d = [f"M{f(pts[0][0])} {f(pts[0][1])}"]
    rng = range(n) if closed else range(n - 1)
    for i in rng:
        p0 = pts[(i - 1) % n] if closed or i > 0 else pts[0]
        p1 = pts[i]
        p2 = pts[(i + 1) % n]
        p3 = pts[(i + 2) % n] if closed or i + 2 < n else pts[-1]
        c1 = (p1[0] + (p2[0] - p0[0]) / 6 * tension, p1[1] + (p2[1] - p0[1]) / 6 * tension)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6 * tension, p2[1] - (p3[1] - p1[1]) / 6 * tension)
        d.append(f"C{f(c1[0])} {f(c1[1])} {f(c2[0])} {f(c2[1])} {f(p2[0])} {f(p2[1])}")
    if closed:
        d.append("Z")
    return "".join(d)


def poly(points, closed=True):
    s = "M" + " L".join(f"{f(x)} {f(y)}" for x, y in points)
    return s + ("Z" if closed else "")


class Svg:
    def __init__(self, color, seed=1):
        self.color = color
        self.defs = []
        self.body = []
        self.ids = set()
        self.rng = random.Random(seed)
        self._std_defs()

    # ---------- defs ----------
    def add_def(self, id_, text):
        if id_ in self.ids:
            return id_
        self.ids.add(id_)
        self.defs.append(text)
        return id_

    def _std_defs(self):
        # glows
        for name, sd in (("glow", 6), ("glowS", 3), ("glowL", 14), ("glowXL", 30)):
            self.add_def(name, f'<filter id="{name}" x="-60%" y="-60%" width="220%" height="220%">'
                               f'<feGaussianBlur stdDeviation="{sd}" result="b"/>'
                               f'<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>')
        for name, sd in (("blur2", 2), ("blur4", 4), ("blur8", 8), ("blur16", 16), ("blur30", 30), ("blur60", 60)):
            self.add_def(name, f'<filter id="{name}" x="-80%" y="-80%" width="260%" height="260%">'
                               f'<feGaussianBlur stdDeviation="{sd}"/></filter>')

    def ball_grad(self, kind):
        hi, mid, dark, rim = BALLS[kind]
        gid = f"b{kind}"
        self.add_def(gid, f'<radialGradient id="{gid}" cx=".42" cy=".4" r=".62" fx=".33" fy=".28">'
                          f'<stop offset="0" stop-color="{hi}"/><stop offset=".5" stop-color="{mid}"/>'
                          f'<stop offset="1" stop-color="{dark}"/></radialGradient>')
        return gid

    def lin(self, id_, stops, x1=0, y1=0, x2=0, y2=1, user=False):
        st = "".join(f'<stop offset="{o}" stop-color="{c}"' + (f' stop-opacity="{a}"' if a is not None else "") + "/>"
                     for o, c, a in [(s + (None,))[:3] for s in stops])
        units = ' gradientUnits="userSpaceOnUse"' if user else ""
        return self.add_def(id_, f'<linearGradient id="{id_}" x1="{f(x1)}" y1="{f(y1)}" x2="{f(x2)}" y2="{f(y2)}"{units}>{st}</linearGradient>')

    def rad(self, id_, stops, cx=.5, cy=.5, r=.5, fx=None, fy=None, user=False):
        st = "".join(f'<stop offset="{o}" stop-color="{c}"' + (f' stop-opacity="{a}"' if a is not None else "") + "/>"
                     for o, c, a in [(s + (None,))[:3] for s in stops])
        units = ' gradientUnits="userSpaceOnUse"' if user else ""
        foc = (f' fx="{f(fx) if user else fx}" fy="{f(fy) if user else fy}"' if fx is not None else "")
        cxs = f(cx) if user else cx
        cys = f(cy) if user else cy
        rs = f(r) if user else r
        return self.add_def(id_, f'<radialGradient id="{id_}" cx="{cxs}" cy="{cys}" r="{rs}"{foc}{units}>{st}</radialGradient>')

    # ---------- drawing ----------
    def add(self, s):
        self.body.append(s)

    def ball(self, x, y, r, kind, opacity=1.0, spec=True, rim=True, extra=""):
        gid = self.ball_grad(kind)
        hi, mid, dark, rimc = BALLS[kind]
        op = f' opacity="{f(opacity) if opacity >= .1 else round(opacity, 2)}"' if opacity < 1 else ""
        out = [f'<g{op}{extra}>']
        rs = ""
        if rim and rimc:
            rs = f' stroke="{rimc}" stroke-opacity=".45" stroke-width="{f(max(1, r * .07))}"'
        out.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r)}" fill="url(#{gid})"{rs}/>')
        if spec and r > 6:
            out.append(f'<ellipse cx="{f(x - r * .36)}" cy="{f(y - r * .4)}" rx="{f(r * .24)}" ry="{f(r * .16)}" '
                       f'fill="#fff" opacity=".55" transform="rotate(-35 {f(x - r * .36)} {f(y - r * .4)})"/>')
        out.append("</g>")
        self.add("".join(out))

    def bond(self, x1, y1, x2, y2, w, color="#cfd6e8", opacity=1.0, cap="round"):
        self.add(f'<line x1="{f(x1)}" y1="{f(y1)}" x2="{f(x2)}" y2="{f(y2)}" stroke="{color}" '
                 f'stroke-width="{f(w)}" stroke-linecap="{cap}"' + (f' opacity="{round(opacity, 2)}"' if opacity < 1 else "") + "/>")

    def sparkle(self, x, y, s, color="#ffffff", opacity=1.0, glow=True):
        """Four-point star."""
        k = s * .18
        d = (f"M{f(x)} {f(y - s)}Q{f(x + k)} {f(y - k)} {f(x + s)} {f(y)}Q{f(x + k)} {f(y + k)} {f(x)} {f(y + s)}"
             f"Q{f(x - k)} {f(y + k)} {f(x - s)} {f(y)}Q{f(x - k)} {f(y - k)} {f(x)} {f(y - s)}Z")
        flt = ' filter="url(#glowS)"' if glow else ""
        op = f' opacity="{round(opacity, 2)}"' if opacity < 1 else ""
        self.add(f'<path d="{d}" fill="{color}"{flt}{op}/>')

    def background(self, focus=(600, 300), focus_r=650, strength=.42, stars=110, bokeh=7, star_box=(0, 0, W, H)):
        c = self.color
        self.lin("bgL", [(0, NAVY), (.62, "#121838"), (1, NAVY_DEEP)])
        strength = min(.6, strength * 1.25)
        self.rad("bgR", [(0, c, strength), (.45, mix(c, NAVY, .55), strength * .45), (1, NAVY, 0)],
                 cx=focus[0], cy=focus[1], r=focus_r, user=True)
        self.add(f'<rect width="{W}" height="{H}" fill="url(#bgL)"/>')
        self.add(f'<rect width="{W}" height="{H}" fill="url(#bgR)"/>')
        # a wash of the board colour from the top corners, so each board has its own colour
        self.lin("bgW", [(0, c, .26), (.5, c, 0)], x1=0, y1=0, x2=.55, y2=.8)
        self.lin("bgW2", [(0, c, .16), (.45, c, 0)], x1=1, y1=0, x2=.45, y2=.8)
        self.add(f'<rect width="{W}" height="{H}" fill="url(#bgW)"/><rect width="{W}" height="{H}" fill="url(#bgW2)"/>')
        rng = self.rng
        # bokeh
        for _ in range(bokeh):
            x = rng.uniform(40, W - 40)
            y = rng.uniform(30, H * .7)
            r = rng.uniform(25, 70)
            self.add(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r)}" fill="{mix(c, "#ffffff", .3)}" opacity="{round(rng.uniform(.04, .09), 2)}"/>')
        # stars
        x0, y0, x1, y1 = star_box
        pts = []
        for _ in range(stars):
            x = rng.uniform(x0, x1)
            y = rng.uniform(y0, y1)
            r = rng.choice([.8, 1, 1.2, 1.4, 1.8, 2.2])
            o = rng.uniform(.25, .85)
            pts.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{r}" opacity="{round(o, 2)}"/>')
        self.add('<g fill="#fff">' + "".join(pts) + "</g>")
        for _ in range(5):
            self.sparkle(rng.uniform(60, W - 60), rng.uniform(30, H * .72), rng.uniform(5, 9), "#ffffff", .7)

    def calm_bottom(self, top=600):
        """Darken the caption band so it stays calm."""
        self.lin("calm", [(0, NAVY_DEEP, 0), (1, NAVY_DEEP, .75)], x1=0, y1=top, x2=0, y2=H, user=True)
        self.add(f'<rect y="{top}" width="{W}" height="{H - top}" fill="url(#calm)"/>')

    def text(self):
        return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">'
                f'<defs>{"".join(self.defs)}</defs>{"".join(self.body)}</svg>')

    def save(self, name):
        txt = self.text()
        assert "<text" not in txt and "<script" not in txt and "href" not in txt, "forbidden element"
        os.makedirs(OUT_DIR, exist_ok=True)
        path = os.path.join(OUT_DIR, name + ".svg")
        tmp = path + ".tmp"
        with open(tmp, "w", encoding="utf-8") as fh:
            fh.write(txt)
        os.replace(tmp, path)
        print(f"{path}: {len(txt.encode('utf-8')) / 1024:.1f} KB")
        return path


# ---------- 3D helpers ----------
def rot(p, ax=0.0, ay=0.0, az=0.0):
    x, y, z = p
    # around x
    c, s = math.cos(ax), math.sin(ax)
    y, z = y * c - z * s, y * s + z * c
    # around y
    c, s = math.cos(ay), math.sin(ay)
    x, z = x * c + z * s, -x * s + z * c
    # around z
    c, s = math.cos(az), math.sin(az)
    x, y = x * c - y * s, x * s + y * c
    return (x, y, z)


def norm(v):
    l = math.sqrt(sum(a * a for a in v))
    return tuple(a / l for a in v)
