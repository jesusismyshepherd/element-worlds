"""Krypton's own pieces for its board pictures (tools/boards/Kr/), on top of the shared kit lib/style.py:
shaded balls for the elements the kit has no ball for (krypton, argon, fluorine, xenon, gold), named apart
from the kit's url(#b<El>) (hydrogen's trap: the first definition of an id wins), air's molecules, motion
streaks, snowflakes, and glass with its edges lit (a bright glass face blooms on the wall).

    from krkit import *
    kdefs(s)                           # once per picture
    s.a(kball(600, 300, 40, "Kr"))
"""
import math
import os
import random
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from lib.style import *  # noqa: E402,F401

KR = "#5cb8d1"  # Jmol's krypton
# highlight, mid, dark: CPK colours deepened so they shade (argon kept paler than krypton so the two part)
KBALLS = {
    "Kr": ("#dcf6fd", "#5cb8d1", "#1d5a6c"),
    "Ar": ("#f0fbff", "#a8e2ef", "#4a8796"),
    "F": ("#f2ffd8", "#90e050", "#3c7410"),
    "Xe": ("#d4f0f6", "#429eb0", "#14505c"),
    "Au": ("#fff6c8", "#ffc93a", "#9a6a0a"),
}


def kdefs(s):
    """The krypton picture balls (url(#kKr), #kAr, #kF, #kXe, #kAu), and a glowing krypton (#kKrHot)."""
    for el, (hi, mid, dark) in KBALLS.items():
        s.d(rad(f"k{el}", [(0, hi), (0.28, mid), (0.78, mix(mid, dark, 0.55)), (1, dark)],
                cx=0.36, cy=0.32, r=0.72, fx=0.32, fy=0.26))
    s.d(rad("kKrHot", [(0, "#fff4d8"), (0.3, "#ffb84a"), (0.8, "#d0601a"), (1, "#7a2a08")],
            cx=0.36, cy=0.32, r=0.72, fx=0.32, fy=0.26))


def kball(cx, cy, r, el="Kr", op=None, shine=True, gid=None):
    """A shaded ball in one of the picture's gradients."""
    o = f' opacity="{op}"' if op is not None else ""
    g = gid or f"k{el}"
    out = (f'<g{o}><circle cx="{f(cx)}" cy="{f(cy)}" r="{f(r)}" fill="url(#{g})" stroke="#000" stroke-opacity="0.22" '
           f'stroke-width="{f(max(0.6, r * 0.04))}"/>')
    if shine and r >= 7:
        out += (f'<ellipse cx="{f(cx - r * 0.34)}" cy="{f(cy - r * 0.42)}" rx="{f(r * 0.32)}" ry="{f(r * 0.19)}" '
                f'transform="rotate(-32 {f(cx - r * 0.34)} {f(cy - r * 0.42)})" fill="#fff" opacity="0.55"/>')
    return out + "</g>"


def diatomic(cx, cy, r, el, ang=0, op=None):
    """N2 or O2: two kit balls side by side."""
    a = math.radians(ang)
    dx, dy = math.cos(a) * r * 0.62, math.sin(a) * r * 0.62
    o = f' opacity="{op}"' if op is not None else ""
    return f"<g{o}>" + ball(cx - dx, cy - dy, r * 0.82, el) + ball(cx + dx, cy + dy, r * 0.82, el) + "</g>"


def streak(cx, cy, r, ang, length, col="#ffffff", op=0.5, n=3):
    """Motion lines behind a moving particle (ang: the way it moves, degrees)."""
    a = math.radians(ang)
    ux, uy = math.cos(a), math.sin(a)
    nx, ny = -uy, ux
    out = []
    for k in range(n):
        off = (k - (n - 1) / 2) * r * 0.55
        sx, sy = cx - ux * r * 1.1 + nx * off, cy - uy * r * 1.1 + ny * off
        L = length * (1 - abs(k - (n - 1) / 2) * 0.35)
        out.append(f'<line x1="{f(sx)}" y1="{f(sy)}" x2="{f(sx - ux * L)}" y2="{f(sy - uy * L)}" stroke="{col}" '
                   f'stroke-width="{f(max(1.2, r * 0.16))}" stroke-linecap="round" opacity="{op}"/>')
    return "".join(out)


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
    """A sine wave from one point to another, as an SVG path."""
    n = n or max(40, int(waves * 16))
    a = math.atan2(y1 - y0, x1 - x0)
    nx, ny = -math.sin(a), math.cos(a)
    pts = []
    for i in range(n + 1):
        t = i / n
        w = math.sin(t * waves * math.tau) * amp
        pts.append((x0 + (x1 - x0) * t + nx * w, y0 + (y1 - y0) * t + ny * w))
    return smooth(pts, closed=False)


def glass_edges(d, col="#cfe6ff", w=3, op=0.75, fill="#9fc8ff", fill_op=0.08):
    """A glass outline: a faint fill and lit edges (a bright face would bloom)."""
    return (f'<path d="{d}" fill="{fill}" opacity="{fill_op}"/>'
            f'<path d="{d}" fill="none" stroke="{col}" stroke-width="{f(w)}" opacity="{op}" stroke-linejoin="round"/>')


def rng(seed):
    return random.Random(seed)
