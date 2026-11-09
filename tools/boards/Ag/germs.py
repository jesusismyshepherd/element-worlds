"""Board 'germs': a big Petri dish seen from above at a slant, its jelly covered with a lawn of germs, except in a
clear ring round a silver coin (round a blue plastic button beside it, the germs grow right up to the edge).
Above, the space station crossing the stars; on the left a little brown dropper bottle letting fall a drop, on
the right a plaster with a silver pad. A close-up: a rod-shaped germ with silver ions clinging to the sulfur in
its skin."""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from agkit import *  # noqa: E402,F401

COLOR = "#5fe08a"
DX, DY, DRX, DRY = 520, 380, 300, 190  # the dish
COIN = (470, 360, 62, 40)
BUTTON = (650, 430, 34, 22)


def station(s, x, y, k=1.0):
    """The International Space Station, small: a long truss, four pairs of solar wings, the modules."""
    out = [f'<g transform="translate({x},{y}) scale({k})">']
    out.append('<rect x="-118" y="-4" width="236" height="8" fill="#8a90a6"/>')
    for sx in (-102, -74, 74, 102):
        for y0 in (-80, 10):
            out.append(f'<rect x="{sx - 11}" y="{y0}" width="22" height="70" fill="#b08a3a" stroke="#5a4418" stroke-width="1.5"/>')
            for k in range(1, 5):
                out.append(f'<line x1="{sx - 11}" y1="{y0 + k * 14}" x2="{sx + 11}" y2="{y0 + k * 14}" stroke="#5a4418" '
                           'stroke-width="1" opacity="0.7"/>')
    for sx in (-40, 40):
        out.append(f'<rect x="{sx - 6}" y="8" width="12" height="34" fill="#e0e4ec" opacity="0.8"/>')
    out.append('<rect x="-26" y="-14" width="52" height="28" rx="6" fill="#c8ccd8"/>')
    out.append('<rect x="-10" y="-40" width="20" height="80" rx="6" fill="#b4b9c8"/>')
    out.append('<rect x="-40" y="-8" width="80" height="16" rx="6" fill="#d8dce6"/>')
    out.append("</g>")
    return "".join(out)


def dish(s, rnd):
    """The Petri dish: a glass rim, amber jelly, a lawn of germs, a silver coin with its clear ring, a button."""
    s.d(rad("agar", [(0, "#b49a48"), (0.7, "#9a8238"), (1, "#7a6428")], cx=0.45, cy=0.4, r=0.7),
        f'<clipPath id="agarClip"><ellipse cx="{DX}" cy="{DY}" rx="{DRX - 14}" ry="{DRY - 10}"/></clipPath>')
    # its shadow, the glass base's edge, the jelly
    s.a(f'<ellipse cx="{DX + 14}" cy="{DY + 30}" rx="{DRX + 10}" ry="{DRY + 8}" fill="#000" opacity="0.35" filter="url(#s16)"/>',
        f'<ellipse cx="{DX}" cy="{DY + 16}" rx="{DRX}" ry="{DRY}" fill="#2a4a44" opacity="0.8"/>',
        f'<ellipse cx="{DX}" cy="{DY}" rx="{DRX}" ry="{DRY}" fill="#2f5a50"/>',
        f'<ellipse cx="{DX}" cy="{DY}" rx="{DRX - 14}" ry="{DRY - 10}" fill="url(#agar)"/>')
    cx, cy, crx, cry = COIN
    bx, by, brx, bry = BUTTON
    lawn = []
    for _ in range(1500):
        a = rnd.uniform(0, math.tau)
        rr = math.sqrt(rnd.uniform(0, 1))
        x, y = DX + math.cos(a) * rr * (DRX - 22), DY + math.sin(a) * rr * (DRY - 16)
        # the clear ring round the silver: no germs within about 1.9 times its size
        if ((x - cx) / (crx * 1.95)) ** 2 + ((y - cy) / (cry * 1.95)) ** 2 < 1:
            continue
        if ((x - bx) / (brx * 1.02)) ** 2 + ((y - by) / (bry * 1.02)) ** 2 < 1:
            continue
        r = rnd.uniform(2.4, 5.2)
        lawn.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r)}" fill="{rnd.choice(["#e6d9a8", "#d8c890", "#efe3b8", "#cbbd84"])}" '
                    f'opacity="{rnd.uniform(0.7, 0.95):.2f}"/>')
    # a few bigger colonies
    for _ in range(26):
        a = rnd.uniform(0, math.tau)
        rr = math.sqrt(rnd.uniform(0.15, 1))
        x, y = DX + math.cos(a) * rr * (DRX - 40), DY + math.sin(a) * rr * (DRY - 30)
        if ((x - cx) / (crx * 2.3)) ** 2 + ((y - cy) / (cry * 2.3)) ** 2 < 1:
            continue
        lawn.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(rnd.uniform(7, 11))}" fill="#efe1aa" opacity="0.9"/>'
                    f'<circle cx="{f(x - 2)}" cy="{f(y - 2)}" r="{f(rnd.uniform(2, 4))}" fill="#fff4cc" opacity="0.6"/>')
    s.a('<g clip-path="url(#agarClip)">' + "".join(lawn) + "</g>")
    # the clear ring's edge, faintly
    s.a(f'<ellipse cx="{cx}" cy="{cy + 2}" rx="{crx * 1.95}" ry="{cry * 1.95}" fill="none" stroke="{COLOR}" stroke-width="3" '
        'stroke-dasharray="6 7" opacity="0.55"/>')
    # the silver coin and the blue button
    s.a(coin_face(cx, cy, crx, cry, rot=-6, metal="ag", seed=7, edge=8))
    s.a(f'<ellipse cx="{bx}" cy="{by + 5}" rx="{brx}" ry="{bry}" fill="#1a3a8a"/>',
        f'<ellipse cx="{bx}" cy="{by}" rx="{brx}" ry="{bry}" fill="#3f78e0"/>')
    for (hx, hy) in ((-8, -5), (8, -5), (-8, 5), (8, 5)):
        s.a(f'<circle cx="{bx + hx}" cy="{by + hy}" r="3.2" fill="#1a3a8a"/>')
    # the glass rim and its glint
    s.a(f'<ellipse cx="{DX}" cy="{DY}" rx="{DRX}" ry="{DRY}" fill="none" stroke="#bfe8dc" stroke-width="5" opacity="0.6"/>',
        f'<path d="M{DX - DRX * 0.8},{DY - DRY * 0.5} A{DRX},{DRY} 0 0 1 {DX - DRX * 0.2},{DY - DRY * 0.98}" fill="none" '
        'stroke="#ffffff" stroke-width="5" stroke-linecap="round" opacity="0.4"/>')
    return (cx + crx * 0.9, cy - cry * 0.2)


def bottle(s, x, y):
    """A little brown dropper bottle, a drop falling from its tip."""
    s.a(f'<rect x="{x - 26}" y="{y}" width="52" height="86" rx="12" fill="#6a3a18"/>',
        f'<rect x="{x - 20}" y="{y + 10}" width="10" height="64" rx="5" fill="#a86a3a" opacity="0.6"/>',
        f'<rect x="{x - 14}" y="{y - 24}" width="28" height="26" rx="4" fill="#2a2a32"/>',
        f'<ellipse cx="{x}" cy="{y - 38}" rx="13" ry="16" fill="#3a3a44"/>',
        f'<path d="M{x - 4},{y + 86} L{x + 4},{y + 86} L{x + 2},{y + 108} L{x - 2},{y + 108} Z" fill="#c8ccd6" opacity="0.8"/>',
        f'<path d="M{x},{y + 120} Q{x + 9},{y + 134} {x},{y + 140} Q{x - 9},{y + 134} {x},{y + 120} Z" fill="#c4ccdc"/>')


def plaster(s, x, y, ang):
    """A plaster with a silver pad."""
    s.a(f'<g transform="rotate({ang} {x} {y})">'
        f'<rect x="{x - 130}" y="{y - 34}" width="260" height="68" rx="30" fill="#c99a78"/>'
        f'<rect x="{x - 48}" y="{y - 26}" width="96" height="52" rx="8" fill="url(#agBand)"/>'
        + "".join(f'<circle cx="{x + dx}" cy="{y + dy}" r="2.4" fill="#8a6448" opacity="0.6"/>'
                  for dx in (-104, -88, -72, 72, 88, 104) for dy in (-12, 0, 12)) +
        '</g>')


def closeup(s, src):
    """A rod-shaped germ, its skin dotted with sulfur, silver ions clinging to it and more drifting in."""
    cx, cy, R = 985, 220, 140
    opening, closing = magnifier(s, "magGerm", cx, cy, R, COLOR, src=(src[0], src[1], 20), inner="#10261c")
    body = []
    # the germ: a capsule with a skin and a tail
    body.append(f'<path d="M{cx - 150},{cy + 70} Q{cx - 110},{cy + 40} {cx - 96},{cy + 60}" fill="none" stroke="#3a8a5a" '
                'stroke-width="4" stroke-linecap="round"/>')
    body.append(f'<rect x="{cx - 100}" y="{cy - 2}" width="200" height="100" rx="50" fill="#2f8a52"/>')
    body.append(f'<rect x="{cx - 92}" y="{cy + 6}" width="184" height="84" rx="42" fill="#46b06c"/>')
    body.append(f'<rect x="{cx - 70}" y="{cy + 18}" width="110" height="18" rx="9" fill="#7ad896" opacity="0.6"/>')
    # sulfur in its skin, and silver ions holding on to some of them
    spots = [(cx - 60, cy + 4), (cx - 10, cy), (cx + 40, cy + 2), (cx + 86, cy + 30), (cx - 94, cy + 40), (cx + 20, cy + 98)]
    for (x, y) in spots:
        body.append(f'<circle cx="{x}" cy="{y}" r="7" fill="#ffd84d"/>')
    for (x, y) in spots[:4]:
        body.append(aion(x + 4, y - 22, 17, "Ag"))
    for (x, y) in ((cx - 70, cy - 80), (cx + 30, cy - 96), (cx + 96, cy - 50)):
        body.append(aion(x, y, 15, "Ag", op=0.85))
        body.append(f'<line x1="{x}" y1="{y + 18}" x2="{x}" y2="{y + 40}" stroke="#c8d0dc" stroke-width="3" opacity="0.4" '
                    'stroke-dasharray="4 4"/>')
    s.a(opening, "".join(body), closing)


def build():
    s = Svg("Ag", COLOR)
    adefs(s)
    background(s, glows=[(520, 360, 380, 0.55)], seed=1880, stars=60, star_box=(0, 0, 1200, 300), bokeh=6)
    rnd = rng(1893)
    s.a(station(s, 190, 104, 0.95), sparkle(300, 70, 10, "#ffffff", 0.9))
    src = dish(s, rnd)
    bottle(s, 120, 440)
    plaster(s, 1010, 540, -12)
    closeup(s, src)
    finish(s)
    s.save("germs")


if __name__ == "__main__":
    build()
