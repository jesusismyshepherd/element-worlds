"""Radon's pieces for its seven pictures (tools/boards/README.md), on top of the shared kit lib/style.py.

The heavy atoms of the uranium family as balls in their Jmol colours, deepened so they shade (gradients
named k<El>, apart from the kit's own b<El>: the first definition of an id wins, so a gradient named like
the kit's would silently take its colour); radon itself as a teal ball with a soft halo, the one gas of the
family; alpha particles (two protons, two neutrons); granite as a fill of grains (pink feldspar, grey
quartz, black mica), clipped to any shape; wisps of drifting gas.
"""
import math
import os
import random
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from lib.style import *  # noqa: E402,F401,F403

# highlight, mid, dark (Jmol: U #008fff, Th #00baff, Pa #00a1ff, Ra #007d00, Rn #428296, Po #ab5c00,
# Pb #575961, Bi #9e4fb5); radon lightened toward cyan so it reads on the navy
HEAVY = {
    "U": ("#cfe6ff", "#2f8fff", "#123f80"),
    "Th": ("#d4f3ff", "#2fb8f0", "#0f5674"),
    "Pa": ("#d0ecff", "#2fa0f0", "#104c78"),
    "Ra": ("#d4ffd0", "#2fa82f", "#0c4a0c"),
    "Rn": ("#d8fbff", "#3cc3d6", "#135a68"),
    "Po": ("#ffe2c0", "#c7731e", "#5c3006"),
    "Pb": ("#d6d8e0", "#6b6e78", "#26272d"),
    "Bi": ("#f0dcff", "#a964c2", "#45225a"),
    "p": ("#ffd6d6", "#ff4d4d", "#a8121e"),  # proton
    "n": ("#e6eaf2", "#9aa3b8", "#4a5164"),  # neutron
}
RN = "#3cc3d6"
RN_GLOW = "#6ff0ff"
# the uranium-238 series, U-238 to Pb-206: (element, how it decays: 'a' alpha, 'b' beta, None stable)
SERIES = [("U", "a"), ("Th", "b"), ("Pa", "b"), ("U", "a"), ("Th", "a"), ("Ra", "a"), ("Rn", "a"), ("Po", "a"),
          ("Pb", "b"), ("Bi", "b"), ("Po", "a"), ("Pb", "b"), ("Bi", "b"), ("Po", "a"), ("Pb", None)]


def setup(s):
    """The gradients every radon picture uses."""
    for el, (hi, mid, dark) in HEAVY.items():
        s.d(rad(f"k{el}", [(0, hi), (0.28, mid), (0.78, mix(mid, dark, 0.55)), (1, dark)],
                cx=0.36, cy=0.32, r=0.72, fx=0.32, fy=0.26))
    s.d(rad("rnHalo", [(0, RN_GLOW, 0.55), (0.45, RN_GLOW, 0.18), (1, RN_GLOW, 0)]))


def atom(cx, cy, r, el, op=None, shine=True):
    """A heavy atom: a shaded ball in its colour."""
    o = f' opacity="{op}"' if op is not None else ""
    out = (f'<g{o}><circle cx="{f(cx)}" cy="{f(cy)}" r="{f(r)}" fill="url(#k{el})" stroke="#000" '
           f'stroke-opacity="0.22" stroke-width="{f(max(0.8, r * 0.04))}"/>')
    if shine and r >= 7:
        out += (f'<ellipse cx="{f(cx - r * 0.34)}" cy="{f(cy - r * 0.42)}" rx="{f(r * 0.34)}" ry="{f(r * 0.2)}" '
                f'transform="rotate(-32 {f(cx - r * 0.34)} {f(cy - r * 0.42)})" fill="#fff" opacity="0.55"/>')
    return out + "</g>"


def radon(cx, cy, r, op=1.0, halo=2.4):
    """A radon atom: teal, with a soft halo (the gas of the family)."""
    return (f'<g opacity="{op}"><circle cx="{f(cx)}" cy="{f(cy)}" r="{f(r * halo)}" fill="url(#rnHalo)"/>'
            + atom(cx, cy, r, "Rn") + "</g>")


def alpha(cx, cy, r, op=1.0):
    """An alpha particle: two protons and two neutrons in a tight cluster (r is one nucleon)."""
    d = r * 0.62
    parts = [(-d, -d * 0.4, "n"), (d, -d * 0.6, "p"), (-d * 0.6, d * 0.7, "p"), (d * 0.7, d * 0.6, "n")]
    return (f'<g opacity="{op}">' + glow(cx, cy, r * 2.4, "#ffd0a0", 0.35, "s8")
            + "".join(atom(cx + x, cy + y, r, el, shine=r >= 7) for x, y, el in parts) + "</g>")


def wisp(points, col=RN_GLOW, w=10, op=0.35, blur="s4"):
    """A soft trail of drifting gas through the points."""
    d = smooth(points, closed=False)
    return (f'<path d="{d}" fill="none" stroke="{col}" stroke-width="{f(w * 2.2)}" stroke-linecap="round" '
            f'opacity="{op * 0.45:.2f}" filter="url(#{blur})"/>'
            f'<path d="{d}" fill="none" stroke="{col}" stroke-width="{f(w * 0.5)}" stroke-linecap="round" '
            f'opacity="{op:.2f}" filter="url(#s2)"/>')


def blob(cx, cy, r, rnd, n=7, squash=1.0, rot=0.0):
    """A rounded irregular grain as a smooth closed path."""
    pts = []
    for i in range(n):
        a = rot + i * 2 * math.pi / n + rnd.uniform(-0.25, 0.25)
        rr = r * rnd.uniform(0.7, 1.15)
        pts.append((cx + math.cos(a) * rr, cy + math.sin(a) * rr * squash))
    return smooth(pts)


GRANITE = {"base": "#8a7e86", "feld": ["#c58a8e", "#b9787f", "#d39a98"], "quartz": ["#a7adba", "#9298a6", "#b8bcc6"],
           "mica": ["#25252c", "#34333b"]}


def granite(s, gid, clip_d, box, seed=1, scale=1.0, dim=0.0, mica=1.0):
    """Granite inside the path clip_d: a grey-pink base with grains of pink feldspar, grey quartz and black
    mica flakes. box = (x0, y0, x1, y1) to fill; dim darkens it toward the navy (0 to 1)."""
    rnd = random.Random(seed)
    s.d(f'<clipPath id="{gid}"><path d="{clip_d}"/></clipPath>')
    x0, y0, x1, y1 = box
    tone = lambda c: mix(c, NAVY_DEEP, dim) if dim else c
    out = [f'<g clip-path="url(#{gid})"><rect x="{f(x0)}" y="{f(y0)}" width="{f(x1 - x0)}" height="{f(y1 - y0)}" '
           f'fill="{tone(GRANITE["base"])}"/>']
    area = (x1 - x0) * (y1 - y0)
    for kind, count, rmin, rmax in (("feld", 0.0011, 14, 30), ("quartz", 0.0010, 9, 20), ("mica", 0.0009 * mica, 3, 8)):
        for _ in range(int(area * count / (scale * scale))):
            x, y = rnd.uniform(x0, x1), rnd.uniform(y0, y1)
            r = rnd.uniform(rmin, rmax) * scale
            col = tone(rnd.choice(GRANITE[kind]))
            if kind == "mica":
                a = rnd.uniform(0, 180)
                out.append(f'<rect x="{f(x - r)}" y="{f(y - r * 0.45)}" width="{f(2 * r)}" height="{f(r * 0.9)}" '
                           f'fill="{col}" transform="rotate({f(a)} {f(x)} {f(y)})"/>')
            else:
                out.append(f'<path d="{blob(x, y, r, rnd, n=rnd.randint(5, 7), squash=rnd.uniform(0.7, 1.0))}" '
                           f'fill="{col}"/>')
    return "".join(out) + "</g>"


def snowflake(x, y, r, col="#dfeaff", op=0.9, w=None):
    """A six-armed flake, drawn with strokes."""
    w = w or max(1.2, r * 0.16)
    out = []
    for k in range(3):
        a = math.radians(k * 60 + 90)
        dx, dy = math.cos(a) * r, math.sin(a) * r
        out.append(f'<line x1="{f(x - dx)}" y1="{f(y - dy)}" x2="{f(x + dx)}" y2="{f(y + dy)}"/>')
        for sgn in (-1, 1):
            bx, by = x + sgn * dx * 0.55, y + sgn * dy * 0.55
            for t in (-1, 1):
                b = a + t * math.radians(45) + (math.pi if sgn < 0 else 0)
                out.append(f'<line x1="{f(bx)}" y1="{f(by)}" x2="{f(bx + math.cos(b) * r * 0.3)}" '
                           f'y2="{f(by + math.sin(b) * r * 0.3)}"/>')
    return (f'<g stroke="{col}" stroke-width="{f(w)}" stroke-linecap="round" opacity="{op}">' + "".join(out) + "</g>")
