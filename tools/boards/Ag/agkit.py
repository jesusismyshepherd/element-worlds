"""Silver's own pieces for its board pictures (tools/boards/Ag/), on top of the shared kit lib/style.py: shaded
balls for the elements the kit has no ball for (silver, gold, copper, iodine, bromine, zinc), named apart from
the kit's url(#b<El>) (hydrogen's trap: the first definition of an id wins), an ion's sign on them, polished
silver and gold surfaces drawn as bands of light and shade (a flat pale fill blooms on the wall: the brightest
band stays a little under the bloom), coins, curls of wire silver and snowflakes.

    from agkit import *
    adefs(s)                            # once per picture
    s.a(aball(600, 300, 40, "Ag"))
"""
import math
import os
import random
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from lib.style import *  # noqa: E402,F401

SILVER = "#c0c0c0"  # Jmol's silver
# highlight, mid, dark: CPK colours deepened so they shade
ABALLS = {
    "Ag": ("#f4f6fa", "#b4bcc8", "#47505e"),
    "Au": ("#fff6c8", "#ffc93a", "#9a6a0a"),
    "Cu": ("#ffe0c4", "#d8843a", "#7a3a10"),
    "I": ("#f6d0f6", "#a830b0", "#4a0a52"),
    "Br": ("#ffd4cc", "#b8402e", "#5a1410"),
    "Zn": ("#e8eaff", "#8a90c8", "#383c6a"),
}


def adefs(s):
    """The silver picture balls (url(#aAg), #aAu, #aCu, #aI, #aBr, #aZn), and the polished metals: #agBand
    (silver, light from the top left), #auBand (gold), #agEdge (a coin's or a medal's rim)."""
    for el, (hi, mid, dark) in ABALLS.items():
        s.d(rad(f"a{el}", [(0, hi), (0.28, mid), (0.78, mix(mid, dark, 0.55)), (1, dark)],
                cx=0.36, cy=0.32, r=0.72, fx=0.32, fy=0.26))
    # polished silver: bands of light and shade, as a mirror catches a room; the brightest under the bloom
    s.d(lin("agBand", [(0, "#5c6574"), (0.18, "#c9d0da"), (0.3, "#7d8696"), (0.48, "#dde2ea"), (0.58, "#8e97a6"),
                       (0.78, "#c4cbd6"), (1, "#59616f")], x1=0, y1=0, x2=1, y2=1),
        lin("auBand", [(0, "#8a5a0c"), (0.2, "#f2c64a"), (0.32, "#b07c16"), (0.5, "#ffd968"), (0.6, "#c48e1e"),
                       (0.8, "#eebd44"), (1, "#7a4e08")], x1=0, y1=0, x2=1, y2=1),
        lin("agEdge", [(0, "#3c434f"), (0.5, "#a9b1bd"), (1, "#3c434f")], x1=0, y1=0, x2=0, y2=1))


def aball(cx, cy, r, el="Ag", op=None, shine=True):
    """A shaded ball in one of the picture's gradients (a kit element falls back to the kit's ball)."""
    if el not in ABALLS:
        return ball(cx, cy, r, el, shine=shine, op=op)
    o = f' opacity="{op}"' if op is not None else ""
    out = (f'<g{o}><circle cx="{f(cx)}" cy="{f(cy)}" r="{f(r)}" fill="url(#a{el})" stroke="#000" stroke-opacity="0.22" '
           f'stroke-width="{f(max(0.6, r * 0.04))}"/>')
    if shine and r >= 7:
        out += (f'<ellipse cx="{f(cx - r * 0.34)}" cy="{f(cy - r * 0.42)}" rx="{f(r * 0.32)}" ry="{f(r * 0.19)}" '
                f'transform="rotate(-32 {f(cx - r * 0.34)} {f(cy - r * 0.42)})" fill="#fff" opacity="0.55"/>')
    return out + "</g>"


def aion(cx, cy, r, el="Ag", sign="+", op=None):
    """An ion: its ball with its charge on it (the kit's lesson: a badge beside the ball read as an eye)."""
    o = f' opacity="{op}"' if op is not None else ""
    return f"<g{o}>" + aball(cx, cy, r, el) + charge(cx + r * 0.08, cy + r * 0.1, r * 0.95, sign) + "</g>"


def coin_face(cx, cy, rx, ry, rot=0, metal="ag", relief="#2a2f3a", seed=1, edge=None, emblem="shield"):
    """A coin or a medal lying or hanging at an angle: an ellipse rx by ry (ry < rx is a coin seen at a slant),
    turned by rot degrees, its rim, a raised ring and a simple emblem in relief ("shield", "pillars" for the
    Spanish dollar's two columns, or None). metal "ag" or "au"."""
    band = "agBand" if metal == "ag" else "auBand"
    rim_col = "#2c313b" if metal == "ag" else "#5a3a06"
    th = edge if edge is not None else max(3, ry * 0.14)
    out = [f'<g transform="rotate({f(rot)} {f(cx)} {f(cy)})">']
    # the edge (the coin's thickness), below its face
    out.append(f'<ellipse cx="{f(cx)}" cy="{f(cy + th)}" rx="{f(rx)}" ry="{f(ry)}" fill="{rim_col}"/>')
    out.append(f'<rect x="{f(cx - rx)}" y="{f(cy)}" width="{f(2 * rx)}" height="{f(th)}" fill="{rim_col}"/>')
    out.append(f'<ellipse cx="{f(cx)}" cy="{f(cy)}" rx="{f(rx)}" ry="{f(ry)}" fill="url(#{band})" stroke="{rim_col}" '
               f'stroke-width="{f(max(1, rx * 0.025))}"/>')
    # the raised ring just inside the rim, and a dotted border
    out.append(f'<ellipse cx="{f(cx)}" cy="{f(cy)}" rx="{f(rx * 0.86)}" ry="{f(ry * 0.86)}" fill="none" stroke="{relief}" '
               f'stroke-width="{f(max(1, rx * 0.03))}" opacity="0.35"/>')
    for k in range(28 if rx >= 26 else 0):  # small coins skip the beads (the chest's sixty coins doubled the file)
        a = k / 28 * math.tau
        out.append(f'<circle cx="{f(cx + math.cos(a) * rx * 0.93)}" cy="{f(cy + math.sin(a) * ry * 0.93)}" '
                   f'r="{f(max(0.6, rx * 0.018))}" fill="{relief}" opacity="0.3"/>')
    # the emblem in relief (squashed with the coin)
    sw = f(max(1, rx * 0.045))
    if emblem == "shield":
        w, h = rx * 0.32, ry * 0.5
        out.append(f'<path d="M{f(cx - w)},{f(cy - h)} L{f(cx + w)},{f(cy - h)} L{f(cx + w)},{f(cy)} Q{f(cx + w)},{f(cy + h * 0.8)} '
                   f'{f(cx)},{f(cy + h)} Q{f(cx - w)},{f(cy + h * 0.8)} {f(cx - w)},{f(cy)} Z" fill="none" stroke="{relief}" '
                   f'stroke-width="{sw}" opacity="0.35"/>')
    elif emblem == "pillars":
        for side in (-1, 1):
            x = cx + side * rx * 0.42
            out.append(f'<line x1="{f(x)}" y1="{f(cy - ry * 0.5)}" x2="{f(x)}" y2="{f(cy + ry * 0.5)}" stroke="{relief}" '
                       f'stroke-width="{f(max(1.5, rx * 0.08))}" opacity="0.35"/>')
            out.append(f'<circle cx="{f(x)}" cy="{f(cy - ry * 0.6)}" r="{f(max(1, rx * 0.06))}" fill="{relief}" opacity="0.35"/>')
        out.append(f'<path d="M{f(cx - rx * 0.24)},{f(cy - ry * 0.05)} Q{f(cx)},{f(cy - ry * 0.45)} {f(cx + rx * 0.24)},{f(cy - ry * 0.05)} '
                   f'Q{f(cx)},{f(cy + ry * 0.35)} {f(cx - rx * 0.24)},{f(cy - ry * 0.05)} Z" fill="none" stroke="{relief}" '
                   f'stroke-width="{sw}" opacity="0.35"/>')
    # a highlight sweeping across its upper left
    out.append(f'<path d="M{f(cx - rx * 0.62)},{f(cy - ry * 0.3)} A{f(rx * 0.75)},{f(ry * 0.75)} 0 0 1 {f(cx - rx * 0.05)},'
               f'{f(cy - ry * 0.72)}" fill="none" stroke="#ffffff" stroke-width="{f(max(1.2, rx * 0.05))}" '
               'stroke-linecap="round" opacity="0.4"/>')
    return "".join(out) + "</g>"


def curl(points, w=7, k=1.0):
    """A curl of wire silver along a smooth path: a dark outline, the bright metal, a glint along it."""
    d = smooth(points, closed=False, k=k)
    return (f'<path d="{d}" fill="none" stroke="#2a2f38" stroke-width="{f(w + 3)}" stroke-linecap="round" stroke-linejoin="round"/>'
            f'<path d="{d}" fill="none" stroke="#a8b0bc" stroke-width="{f(w)}" stroke-linecap="round" stroke-linejoin="round"/>'
            f'<path d="{d}" fill="none" stroke="#e4e8ee" stroke-width="{f(max(1.2, w * 0.32))}" stroke-linecap="round" '
            'stroke-linejoin="round" opacity="0.85" transform="translate(-1.2,-1.4)"/>')


def spiral(cx, cy, r0, r1, turns, a0=0.0, n=60, squash=1.0):
    """Points along a spiral from radius r0 to r1 (for a curl of wire silver)."""
    pts = []
    for i in range(n + 1):
        t = i / n
        a = a0 + t * turns * math.tau
        r = r0 + (r1 - r0) * t
        pts.append((cx + math.cos(a) * r, cy + math.sin(a) * r * squash))
    return pts


def snowflake(x, y, r, col="#dfe9ff", op=0.8, rot=0):
    """A six-armed snowflake."""
    out = [f'<g opacity="{op}" transform="rotate({f(rot)} {f(x)} {f(y)})">']
    for k in range(6):
        a = math.radians(k * 60)
        ex, ey = x + math.cos(a) * r, y + math.sin(a) * r
        out.append(f'<line x1="{f(x)}" y1="{f(y)}" x2="{f(ex)}" y2="{f(ey)}" stroke="{col}" stroke-width="{f(max(1, r * 0.16))}" '
                   'stroke-linecap="round"/>')
        mx, my = x + math.cos(a) * r * 0.55, y + math.sin(a) * r * 0.55
        for s_ in (-1, 1):
            b = a + s_ * math.radians(45)
            out.append(f'<line x1="{f(mx)}" y1="{f(my)}" x2="{f(mx + math.cos(b) * r * 0.35)}" y2="{f(my + math.sin(b) * r * 0.35)}" '
                       f'stroke="{col}" stroke-width="{f(max(0.8, r * 0.12))}" stroke-linecap="round"/>')
    return "".join(out) + "</g>"


def wave(x0, y0, x1, y1, amp, waves, n=None):
    """A sine wave from one point to another, as an SVG path (a photon, a light ray)."""
    n = n or max(40, int(waves * 16))
    a = math.atan2(y1 - y0, x1 - x0)
    nx, ny = -math.sin(a), math.cos(a)
    pts = []
    for i in range(n + 1):
        t = i / n
        w = math.sin(t * waves * math.tau) * amp
        pts.append((x0 + (x1 - x0) * t + nx * w, y0 + (y1 - y0) * t + ny * w))
    return smooth(pts, closed=False)


def rng(seed):
    return random.Random(seed)
