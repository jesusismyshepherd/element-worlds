"""Hydrogen's own pieces for its board pictures (tools/boards/H/), on top of the shared kit lib/style.py:
an atom drawn as a model (a red proton, a cyan electron on its ring, in the Atom Forge's colours), water
molecules that report where their hydrogens are (for drawing hydrogen bonds), and a shaded hydrogen ball a
little greyer than CPK white, for the big ones (a large near-white area glows in the hall's bloom).

    from hkit import *
    particles(s)                       # once per picture: the proton, neutron and electron shades
    s.a(hatom(600, 300, 60, tilt=0.4))
"""
import math
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from lib.style import *  # noqa: E402,F401

# the Atom Forge's particle colours (src/worlds/forge/forge.js COLOR)
PROTON = "#ff5a55"
NEUTRON = "#b9c6dc"
ELECTRON = "#a8ecff"


def particles(s):
    """Shades for protons, neutrons, electrons and a greyer hydrogen ball (url(#pP), #pN, #pE, #pHg)."""
    s.d(rad("pP", [(0, "#ffd0c8"), (0.3, PROTON), (0.8, "#b8282a"), (1, "#6e1016")], cx=0.36, cy=0.32, r=0.72, fx=0.32, fy=0.26),
        rad("pN", [(0, "#f2f6ff"), (0.3, NEUTRON), (0.8, "#6e7a92"), (1, "#3c4558")], cx=0.36, cy=0.32, r=0.72, fx=0.32, fy=0.26),
        rad("pE", [(0, "#ffffff"), (0.35, ELECTRON), (1, "#2a9ad0")], cx=0.38, cy=0.34, r=0.7),
        rad("pHg", [(0, "#f4f6fb"), (0.3, "#d4d9e6"), (0.8, "#8c95ab"), (1, "#545c70")], cx=0.36, cy=0.32, r=0.72, fx=0.32, fy=0.26))


def sball(cx, cy, r, gid, shine=True, op=None):
    """A shaded ball with one of the gradients above (or any url id)."""
    o = f' opacity="{op}"' if op is not None else ""
    out = (f'<g{o}><circle cx="{f(cx)}" cy="{f(cy)}" r="{f(r)}" fill="url(#{gid})" stroke="#000" stroke-opacity="0.22" '
           f'stroke-width="{f(max(0.6, r * 0.04))}"/>')
    if shine and r >= 7:
        out += (f'<ellipse cx="{f(cx - r * 0.34)}" cy="{f(cy - r * 0.42)}" rx="{f(r * 0.32)}" ry="{f(r * 0.19)}" '
                f'transform="rotate(-32 {f(cx - r * 0.34)} {f(cy - r * 0.42)})" fill="#fff" opacity="0.55"/>')
    return out + "</g>"


def electron(cx, cy, r, op=1.0):
    """An electron: a small cyan ball with a glow round it."""
    return (f'<g opacity="{op}">' + glow(cx, cy, r * 2.2, ELECTRON, 0.55, "s4")
            + f'<circle cx="{f(cx)}" cy="{f(cy)}" r="{f(r)}" fill="url(#pE)"/></g>')


def ring(cx, cy, rx, ry, rot, col=ELECTRON, w=2.0, op=0.75, dash=None):
    da = f' stroke-dasharray="{dash}"' if dash else ""
    return (f'<ellipse cx="{f(cx)}" cy="{f(cy)}" rx="{f(rx)}" ry="{f(ry)}" transform="rotate({f(rot)} {f(cx)} {f(cy)})" '
            f'fill="none" stroke="{col}" stroke-width="{f(w)}" opacity="{op}"{da}/>')


def on_ring(cx, cy, rx, ry, rot, a):
    """A point on that tilted ellipse, at angle a (radians)."""
    x, y = math.cos(a) * rx, math.sin(a) * ry
    t = math.radians(rot)
    return cx + x * math.cos(t) - y * math.sin(t), cy + x * math.sin(t) + y * math.cos(t)


def hatom(cx, cy, R, tilt=0.38, rot=-18, phase=0.6, op=1.0, glow_op=0.35):
    """A hydrogen atom as a model: one proton in the middle, one electron on a tilted ring of radius R.
    The electron in front of the proton when sin(phase) > 0."""
    rx, ry = R, R * tilt
    p = max(3.0, R * 0.2)
    ex, ey = on_ring(cx, cy, rx, ry, rot, phase)
    er = max(2.0, R * 0.11)
    front = math.sin(phase) > 0
    out = [f'<g opacity="{op}">', glow(cx, cy, R * 0.9, PROTON, glow_op * 0.6, "s8") if R > 20 else "",
           ring(cx, cy, rx, ry, rot, w=max(1.0, R * 0.035))]
    e = electron(ex, ey, er)
    if not front:
        out.append(e)
    out.append(sball(cx, cy, p, "pP"))
    if front:
        out.append(e)
    out.append("</g>")
    return "".join(out)


def nucleus(cx, cy, r, protons=2, neutrons=2, seed=0):
    """A small nucleus: protons and neutrons packed together (helium's 2 + 2 by default)."""
    import random
    rnd = random.Random(seed)
    kinds = ["pP"] * protons + ["pN"] * neutrons
    rnd.shuffle(kinds)
    n = len(kinds)
    out = []
    spots = [(0, 0)] if n == 1 else [(math.cos(i / n * math.tau + 0.4) * r * 0.62, math.sin(i / n * math.tau + 0.4) * r * 0.62) for i in range(n)]
    for (dx, dy), k in sorted(zip(spots, kinds), key=lambda t: t[0][1]):
        out.append(sball(cx + dx, cy + dy, r * 0.62, k, shine=r * 0.62 >= 7))
    return "".join(out)


def heatom(cx, cy, R, tilt=0.4, rot=20, phase=0.5, op=1.0):
    """A helium atom: a nucleus of 2 protons and 2 neutrons, two electrons on one ring."""
    rx, ry = R, R * tilt
    er = max(2.0, R * 0.1)
    out = [f'<g opacity="{op}">', ring(cx, cy, rx, ry, rot, w=max(1.0, R * 0.035))]
    for a in (phase, phase + math.pi):
        ex, ey = on_ring(cx, cy, rx, ry, rot, a)
        if math.sin(a) <= 0:
            out.append(electron(ex, ey, er))
    out.append(nucleus(cx, cy, max(4, R * 0.2), seed=int(cx)))
    for a in (phase, phase + math.pi):
        ex, ey = on_ring(cx, cy, rx, ry, rot, a)
        if math.sin(a) > 0:
            out.append(electron(ex, ey, er))
    out.append("</g>")
    return "".join(out)


def water(cx, cy, r, ang=0.0, grey_h=False):
    """A water molecule: a red oxygen with two hydrogens at 104.5 degrees. ang turns it (degrees; 0 puts
    both hydrogens below the oxygen). Returns (svg, [(hx, hy), (hx, hy)]) so hydrogen bonds can be drawn."""
    a = math.radians(ang)
    hs = []
    for side in (-1, 1):
        t = a + math.radians(90 + side * 52.25)
        hs.append((cx + math.cos(t) * r * 0.98, cy + math.sin(t) * r * 0.98))
    hr = r * 0.62
    parts = []
    # hydrogens behind if they point up (drawn first), in front if they point down
    back = [h for h in hs if h[1] < cy]
    front = [h for h in hs if h[1] >= cy]
    for (hx, hy) in back:
        parts.append(sball(hx, hy, hr, "pHg") if grey_h else ball(hx, hy, hr, "H"))
    parts.append(ball(cx, cy, r, "O"))
    for (hx, hy) in front:
        parts.append(sball(hx, hy, hr, "pHg") if grey_h else ball(hx, hy, hr, "H"))
    return "".join(parts), hs


def hbond(x1, y1, x2, y2, col="#9ff7ec", w=4, op=0.9, gap=0.0):
    """A hydrogen bond: a dashed line from a hydrogen to the oxygen it tugs (shortened by gap at each end)."""
    d = math.hypot(x2 - x1, y2 - y1)
    if d == 0:
        return ""
    ux, uy = (x2 - x1) / d, (y2 - y1) / d
    a = (x1 + ux * gap, y1 + uy * gap)
    b = (x2 - ux * gap, y2 - uy * gap)
    return (f'<line x1="{f(a[0])}" y1="{f(a[1])}" x2="{f(b[0])}" y2="{f(b[1])}" stroke="{col}" stroke-width="{f(w)}" '
            f'stroke-dasharray="{f(w * 1.6)} {f(w * 1.4)}" stroke-linecap="round" opacity="{op}"/>')


def h2(cx, cy, r, ang=0.0, grey=False, op=None):
    """A hydrogen molecule: two hydrogen balls overlapping."""
    a = math.radians(ang)
    dx, dy = math.cos(a) * r * 0.62, math.sin(a) * r * 0.62
    o = f' opacity="{op}"' if op is not None else ""
    pick = (lambda x, y: sball(x, y, r, "pHg")) if grey else (lambda x, y: ball(x, y, r, "H"))
    return f"<g{o}>" + pick(cx - dx, cy - dy) + pick(cx + dx, cy + dy) + "</g>"


def pair(cx, cy, r, el, ang=0.0, op=None):
    """A molecule of two like atoms (N2, O2)."""
    a = math.radians(ang)
    dx, dy = math.cos(a) * r * 0.66, math.sin(a) * r * 0.66
    o = f' opacity="{op}"' if op is not None else ""
    return f"<g{o}>" + ball(cx - dx, cy - dy, r, el) + ball(cx + dx, cy + dy, r, el) + "</g>"
