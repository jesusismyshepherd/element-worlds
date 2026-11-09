"""Germanium's own pieces for its board pictures (tools/boards/Ge/), on top of the shared kit lib/style.py:
shaded balls for the elements the kit has no ball for (germanium, silver, gold, gallium, arsenic, tin,
selenium, indium, electrons), named apart from the kit's url(#b<El>) (hydrogen's trap: the first definition
of an id wins), the germanium crystal's look (a grey with a cool sheen), wavy rays, and a germanium lens:
a dark grey mirror in its black mount.

    from gekit import *
    gdefs(s)                           # once per picture
    s.a(gball(600, 300, 40, "Ge"))
"""
import math
import os
import random
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from lib.style import *  # noqa: E402,F401

GE = "#668f8f"  # Jmol's germanium
# highlight, mid, dark: CPK colours deepened so they shade
GBALLS = {
    "Ge": ("#d8f2ee", "#6fa4a0", "#24433f"),
    "Ag": ("#f4f6fa", "#b4bcc8", "#4e5562"),
    "Au": ("#fff6c8", "#ffc93a", "#9a6a0a"),
    "Ga": ("#f4dede", "#c28f8f", "#5e3a3a"),
    "As": ("#f2dcff", "#bd80e3", "#5a2a80"),
    "Sn": ("#e8ecf2", "#8f9aa8", "#3a4250"),
    "Se": ("#ffeacc", "#ffa100", "#8a4a00"),
    "In": ("#f0dcea", "#a67573", "#4a2e2e"),
    "Si": ("#fff1e0", "#e2b486", "#7a5230"),
    "e": ("#e6f4ff", "#58a8ff", "#123c8a"),
}


def gdefs(s):
    """The germanium pictures' balls (url(#gGe), #gAg, ...), the grey of a germanium crystal (#geCut, a
    flat face; #geLens, the lens's dark mirror) and a hot ball (#gHot)."""
    for el, (hi, mid, dark) in GBALLS.items():
        s.d(rad(f"g{el}", [(0, hi), (0.28, mid), (0.78, mix(mid, dark, 0.55)), (1, dark)],
                cx=0.36, cy=0.32, r=0.72, fx=0.32, fy=0.26))
    s.d(lin("geCut", [(0, "#8d9aa6"), (0.35, "#5d6875"), (0.6, "#7f8b98"), (1, "#3c4450")], x1=0, y1=0, x2=1, y2=1),
        lin("geSide", [(0, "#4a5360"), (1, "#262c36")], x1=0, y1=0, x2=0, y2=1),
        rad("geLens", [(0, "#4a5262"), (0.45, "#2a303c"), (0.85, "#171b24"), (1, "#0e1118")],
            cx=0.42, cy=0.38, r=0.62, fx=0.36, fy=0.3),
        rad("gHot", [(0, "#fff0c0"), (0.3, "#ffb04a"), (0.8, "#d05a1a"), (1, "#6a2208")],
            cx=0.36, cy=0.32, r=0.72, fx=0.32, fy=0.26))


def gball(cx, cy, r, el="Ge", op=None, shine=True, gid=None):
    """A shaded ball in one of the picture's gradients."""
    o = f' opacity="{op}"' if op is not None else ""
    g = gid or f"g{el}"
    out = (f'<g{o}><circle cx="{f(cx)}" cy="{f(cy)}" r="{f(r)}" fill="url(#{g})" stroke="#000" stroke-opacity="0.22" '
           f'stroke-width="{f(max(0.6, r * 0.04))}"/>')
    if shine and r >= 7:
        out += (f'<ellipse cx="{f(cx - r * 0.34)}" cy="{f(cy - r * 0.42)}" rx="{f(r * 0.32)}" ry="{f(r * 0.19)}" '
                f'transform="rotate(-32 {f(cx - r * 0.34)} {f(cy - r * 0.42)})" fill="#fff" opacity="0.55"/>')
    return out + "</g>"


def lattice(cx, cy, n, step, r, el="Ge", jitter=0.0, seed=1, op=None, bonds=True, skip=()):
    """A patch of a diamond-like crystal seen along a cube edge: atoms in a square grid with the
    in-between atoms of the other sub-lattice, joined by their bonds (each atom four hands)."""
    rnd = random.Random(seed)
    pts = []
    for j in range(n):
        for i in range(n):
            pts.append((cx + (i - (n - 1) / 2) * step, cy + (j - (n - 1) / 2) * step))
    mids = []
    for j in range(n - 1):
        for i in range(n - 1):
            if (i + j) % 2 == 0:
                mids.append((cx + (i - (n - 2) / 2) * step, cy + (j - (n - 2) / 2) * step))
    out = []
    if bonds:
        for (mx, my) in mids:
            for (dx, dy) in ((-1, -1), (1, -1), (-1, 1), (1, 1)):
                out.append(bond(mx, my, mx + dx * step / 2, my + dy * step / 2, r * 0.42, "#9fb6c4", 0.55))
    for k, (x, y) in enumerate(pts + mids):
        if k in skip:
            continue
        out.append(gball(x + rnd.uniform(-1, 1) * jitter, y + rnd.uniform(-1, 1) * jitter, r, el))
    o = f' opacity="{op}"' if op is not None else ""
    return f"<g{o}>" + "".join(out) + "</g>"


def wave(x0, y0, x1, y1, amp, period, col, w=4, op=0.9, dash=None, head=True):
    """A wavy ray from (x0, y0) to (x1, y1): light of some colour on its way, with an arrow head."""
    L = math.hypot(x1 - x0, y1 - y0)
    ux, uy = (x1 - x0) / L, (y1 - y0) / L
    nx, ny = -uy, ux
    pts = []
    steps = max(8, int(L / 6))
    for i in range(steps + 1):
        t = i / steps * (L - (w * 3 if head else 0))
        a = math.sin(t / period * math.tau) * amp
        pts.append((x0 + ux * t + nx * a, y0 + uy * t + ny * a))
    da = f' stroke-dasharray="{dash}"' if dash else ""
    out = (f'<polyline points="{P(pts)}" fill="none" stroke="{col}" stroke-width="{f(w)}" stroke-linecap="round" '
           f'stroke-linejoin="round" opacity="{op}"{da}/>')
    if head:
        hx, hy = pts[-1]
        hd = w * 3.2
        tip = (x1, y1)
        out += (f'<polygon points="{P([tip, (hx + nx * hd * 0.55, hy + ny * hd * 0.55), (hx - nx * hd * 0.55, hy - ny * hd * 0.55)])}" '
                f'fill="{col}" opacity="{op}"/>')
    return out


def lens(cx, cy, r, tilt=0.0):
    """A germanium lens in its black mount, face-on (squashed by `tilt`, 0 to 0.6): a dark grey mirror,
    a soft sheen and two small bright windows, the mount's ring with its knurls."""
    ry = r * (1 - tilt)
    out = [f'<ellipse cx="{f(cx)}" cy="{f(cy)}" rx="{f(r * 1.22)}" ry="{f(ry * 1.22)}" fill="#14161c" stroke="#30343e" stroke-width="4"/>']
    for k in range(36):
        a = k / 36 * math.tau
        out.append(f'<line x1="{f(cx + math.cos(a) * r * 1.12)}" y1="{f(cy + math.sin(a) * ry * 1.12)}" '
                   f'x2="{f(cx + math.cos(a) * r * 1.21)}" y2="{f(cy + math.sin(a) * ry * 1.21)}" stroke="#3a3f4a" stroke-width="3"/>')
    out.append(f'<ellipse cx="{f(cx)}" cy="{f(cy)}" rx="{f(r * 1.04)}" ry="{f(ry * 1.04)}" fill="#0a0c10"/>')
    out.append(f'<ellipse cx="{f(cx)}" cy="{f(cy)}" rx="{f(r)}" ry="{f(ry)}" fill="url(#geLens)"/>')
    # the anti-reflection coating's faint violet-green sheen
    out.append(f'<ellipse cx="{f(cx + r * 0.1)}" cy="{f(cy + ry * 0.12)}" rx="{f(r * 0.8)}" ry="{f(ry * 0.78)}" fill="none" '
               f'stroke="#7a6ab0" stroke-width="{f(r * 0.06)}" opacity="0.22"/>')
    out.append(f'<path d="M{f(cx - r * 0.62)},{f(cy - ry * 0.3)} A{f(r * 0.7)},{f(ry * 0.7)} 0 0 1 {f(cx - r * 0.05)},{f(cy - ry * 0.72)}" '
               f'fill="none" stroke="#c8d2e2" stroke-width="{f(r * 0.07)}" stroke-linecap="round" opacity="0.5"/>')
    out.append(f'<ellipse cx="{f(cx + r * 0.42)}" cy="{f(cy + ry * 0.4)}" rx="{f(r * 0.1)}" ry="{f(ry * 0.06)}" fill="#c8d2e2" opacity="0.35"/>')
    return "".join(out)


def rng(seed):
    return random.Random(seed)
