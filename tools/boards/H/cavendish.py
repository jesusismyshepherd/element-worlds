"""Board 'cavendish': Henry Cavendish's laboratory by candlelight. On the table a bottle of acid with bits of
zinc fizzing in it; a glass tube carries the bubbles into a trough of water, where they rise into an
upturned jar and push the water down: "inflammable air". On the right the sealed glass globe of 1781,
a spark from a Leyden jar crackling inside it and dew on its glass; a close-up shows what the spark did:
two hydrogen molecules and one of oxygen became two of water. His tricorn hat on the table's edge."""
import math
import os
import random
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from hkit import *  # noqa: E402,F401

COLOR = "#ffd166"
TABLE = 530


def glass_outline(d, w=3, op=0.75):
    return (f'<path d="{d}" fill="#bfe0ff" fill-opacity="0.08" stroke="#d8ecff" stroke-width="{w}" stroke-opacity="{op}"/>')


def bubbles(rnd, x0, x1, y0, y1, n, rmax=6):
    out = []
    for _ in range(n):
        x, y = rnd.uniform(x0, x1), rnd.uniform(y0, y1)
        r = rnd.uniform(2, rmax)
        out.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r)}" fill="#e8f6ff" fill-opacity="0.25" stroke="#e8f6ff" stroke-width="1.3" stroke-opacity="0.8"/>')
    return "".join(out)


def build():
    s = Svg("H", COLOR)
    particles(s)
    background(s, glows=[(130, 330, 280, 0.75), (860, 330, 240, 0.5)], seed=1766, stars=0, bokeh=5)
    rnd = random.Random(1781)

    # ---------- the panelled wall behind, warm by the candle
    s.d(lin("wall", [(0, "#2a2238"), (1, "#1a1530")], x1=0, y1=0, x2=0, y2=1))
    s.a(f'<rect x="0" y="0" width="1200" height="{TABLE}" fill="url(#wall)" opacity="0.65"/>')
    for x in range(0, 1200, 200):
        s.a(f'<rect x="{x + 16}" y="40" width="168" height="{TABLE - 90}" rx="6" fill="none" stroke="#3a2e48" stroke-width="4" opacity="0.7"/>')
    s.a(glow(130, 330, 230, "#ffb84a", 0.35, "s30"))
    # a shelf with jars and a book
    s.a('<rect x="470" y="118" width="400" height="12" fill="#4a3020"/>')
    for (x, w, h, c) in ((490, 34, 52, "#3a5a4a"), (534, 26, 40, "#5a3a2a"), (570, 40, 60, "#2a4a6a"), (630, 30, 46, "#6a5a2a")):
        s.a(f'<rect x="{x}" y="{118 - h}" width="{w}" height="{h}" rx="5" fill="{c}" opacity="0.85"/><rect x="{x + 4}" y="{118 - h - 6}" width="{w - 8}" height="8" rx="2" fill="#7a5a3a"/>')
    s.a('<rect x="690" y="70" width="70" height="48" fill="#6a2a2a"/><rect x="696" y="74" width="58" height="40" fill="#7a3a34"/>'
        '<rect x="766" y="78" width="60" height="40" fill="#2a4a3a" transform="rotate(-8 796 98)"/>')

    # ---------- the table
    s.d(lin("tableTop", [(0, "#6a4228"), (1, "#3e2616")], x1=0, y1=0, x2=0, y2=1),
        lin("tableFront", [(0, "#3a2414"), (1, "#1e130c")], x1=0, y1=0, x2=0, y2=1))
    s.a(f'<rect x="0" y="{TABLE}" width="1200" height="22" fill="url(#tableTop)"/>',
        f'<rect x="0" y="{TABLE + 22}" width="1200" height="{800 - TABLE - 22}" fill="url(#tableFront)"/>')

    # ---------- the candle
    cx, cy = 120, TABLE
    s.a(f'<ellipse cx="{cx}" cy="{cy - 4}" rx="44" ry="10" fill="#b08a3a"/><rect x="{cx - 8}" y="{cy - 40}" width="16" height="36" fill="#b08a3a"/>'
        f'<rect x="{cx - 14}" y="{cy - 150}" width="28" height="112" rx="4" fill="#e8dcc0"/><rect x="{cx - 14}" y="{cy - 150}" width="9" height="112" fill="#fff4dc" opacity="0.5"/>')
    s.a(glow(cx, cy - 178, 60, "#ffcf6a", 0.6, "s16"),
        f'<path d="M{cx},{cy - 206} Q{cx + 12},{cy - 176} {cx},{cy - 158} Q{cx - 12},{cy - 176} {cx},{cy - 206} Z" fill="#ffd27a"/>',
        f'<path d="M{cx},{cy - 192} Q{cx + 5},{cy - 172} {cx},{cy - 162} Q{cx - 5},{cy - 172} {cx},{cy - 192} Z" fill="#fff4d0"/>')

    # ---------- the bottle of acid with zinc in it
    bx, bw = 262, 92
    neck_top = TABLE - 250
    body = (f"M{bx - bw / 2},{TABLE} L{bx - bw / 2},{TABLE - 120} Q{bx - bw / 2},{TABLE - 170} {bx - 16},{TABLE - 186} "
            f"L{bx - 16},{neck_top} L{bx + 16},{neck_top} L{bx + 16},{TABLE - 186} Q{bx + bw / 2},{TABLE - 170} {bx + bw / 2},{TABLE - 120} L{bx + bw / 2},{TABLE} Z")
    s.d(f'<clipPath id="bottle"><path d="{body}"/></clipPath>')
    s.a('<g clip-path="url(#bottle)">', f'<rect x="{bx - bw}" y="{TABLE - 118}" width="{bw * 2}" height="120" fill="#7ac8a0" opacity="0.4"/>')
    for k in range(9):
        x = bx - bw / 2 + 12 + k * 9 + rnd.uniform(-3, 3)
        s.a(f'<path d="M{f(x - 8)},{TABLE - 2} L{f(x - 5)},{f(TABLE - 14 - rnd.uniform(0, 8))} L{f(x + 4)},{f(TABLE - 16 - rnd.uniform(0, 6))} L{f(x + 8)},{TABLE - 2} Z" fill="#8a929e" stroke="#4a525e" stroke-width="1.2"/>')
    s.a(bubbles(rnd, bx - bw / 2 + 8, bx + bw / 2 - 8, TABLE - 112, TABLE - 20, 26, 5), "</g>")
    s.a(glass_outline(body))
    s.a(f'<rect x="{bx - 20}" y="{neck_top - 22}" width="40" height="26" rx="5" fill="#8a5a3a"/>')
    # the glass tube over to the trough
    tube = [(bx, neck_top - 20), (bx, neck_top - 60), (bx + 40, neck_top - 84), (430, neck_top - 84), (468, neck_top - 50), (480, TABLE - 120), (520, TABLE - 52)]
    d = smooth(tube, closed=False, k=0.6)
    s.a(f'<path d="{d}" fill="none" stroke="#d8ecff" stroke-width="10" opacity="0.35"/>',
        f'<path d="{d}" fill="none" stroke="#e8f4ff" stroke-width="3" opacity="0.8"/>')

    # ---------- the trough of water, the upturned jar collecting the gas
    tx0, tx1, ttop = 400, 700, TABLE - 150
    s.a(f'<path d="M{tx0},{TABLE} L{tx0 - 10},{ttop} L{tx1 + 10},{ttop} L{tx1},{TABLE} Z" fill="#5a3a22" stroke="#2a1a10" stroke-width="3"/>')
    s.a(f'<rect x="{tx0 + 6}" y="{ttop + 26}" width="{tx1 - tx0 - 12}" height="{TABLE - ttop - 32}" fill="#2a6a9a" opacity="0.8"/>',
        f'<rect x="{tx0 + 6}" y="{ttop + 22}" width="{tx1 - tx0 - 12}" height="8" fill="#7ac0e8" opacity="0.6"/>')
    # the jar, mouth down in the water: gas at its top, water below
    jx, jw, jtop, jbot = 580, 96, TABLE - 300, TABLE - 40
    jar = f"M{jx - jw / 2},{jbot} L{jx - jw / 2},{jtop + 30} Q{jx - jw / 2},{jtop} {jx},{jtop} Q{jx + jw / 2},{jtop} {jx + jw / 2},{jtop + 30} L{jx + jw / 2},{jbot} Z"
    s.d(f'<clipPath id="jar"><path d="{jar}"/></clipPath>')
    level = jtop + 150
    s.a('<g clip-path="url(#jar)">', f'<rect x="{jx - jw}" y="{level}" width="{jw * 2}" height="300" fill="#2a6a9a" opacity="0.85"/>',
        f'<rect x="{jx - jw}" y="{level - 3}" width="{jw * 2}" height="6" fill="#9ad6ff" opacity="0.7"/>',
        f'<rect x="{jx - jw}" y="{jtop}" width="{jw * 2}" height="{level - jtop}" fill="{COLOR}" opacity="0.08"/>',
        bubbles(rnd, jx - 26, jx + 26, level + 10, jbot - 8, 12, 7), "</g>")
    s.a(glass_outline(jar, 3.5, 0.8))
    for k in range(3):
        s.a(h2(jx - 22 + k * 22, jtop + 50 + (k % 2) * 40, 11, 30 + k * 50, grey=True, op=0.9))
    # the front of the trough's water over the jar's foot
    s.a(f'<rect x="{tx0 + 6}" y="{TABLE - 46}" width="{tx1 - tx0 - 12}" height="40" fill="#2a6a9a" opacity="0.45"/>')
    s.a(bubbles(rnd, 516, 560, TABLE - 60, TABLE - 40, 5, 6))

    # ---------- the Leyden jar and the globe with its spark
    lx = 730
    s.a(f'<rect x="{lx - 34}" y="{TABLE - 130}" width="68" height="128" rx="6" fill="#3a4a6a" fill-opacity="0.4" stroke="#d8ecff" stroke-width="3" stroke-opacity="0.6"/>',
        f'<rect x="{lx - 34}" y="{TABLE - 80}" width="68" height="78" rx="4" fill="#7c828e"/><rect x="{lx - 28}" y="{TABLE - 76}" width="14" height="70" fill="#aab0bc" opacity="0.6"/>',
        f'<rect x="{lx - 3}" y="{TABLE - 190}" width="6" height="64" fill="#b8892e"/><circle cx="{lx}" cy="{TABLE - 196}" r="12" fill="#d8a83e"/>')
    gx, gy, gr = 880, TABLE - 178, 84
    # the stand
    s.a(f'<path d="M{gx - 60},{TABLE} L{gx - 34},{TABLE - 30} L{gx + 34},{TABLE - 30} L{gx + 60},{TABLE} Z" fill="#b8892e" stroke="#6a4a14" stroke-width="2"/>',
        f'<rect x="{gx - 12}" y="{gy + gr - 6}" width="24" height="{TABLE - 30 - gy - gr + 6}" fill="#c89a3a"/>')
    s.d(rad("globe", [(0, "#ffffff", 0.0), (0.75, "#bfe0ff", 0.08), (1, "#d8ecff", 0.35)]))
    s.a(f'<circle cx="{gx}" cy="{gy}" r="{gr}" fill="url(#globe)" stroke="#d8ecff" stroke-width="3.5" stroke-opacity="0.8"/>')
    # wires in from the top and the side, the spark between their tips
    tip1, tip2 = (gx - 8, gy - 16), (gx + 22, gy + 8)
    s.a(f'<path d="M{gx},{gy - gr - 26} L{gx},{gy - gr} L{tip1[0]},{tip1[1]}" fill="none" stroke="#b8892e" stroke-width="4"/>',
        f'<circle cx="{gx}" cy="{gy - gr - 30}" r="9" fill="#d8a83e"/>',
        f'<path d="M{gx + gr + 30},{gy + 8} L{gx + gr},{gy + 8} L{tip2[0]},{tip2[1]}" fill="none" stroke="#b8892e" stroke-width="4"/>')
    chain = [(lx, TABLE - 208), (lx + 50, gy - gr - 40), (gx - 40, gy - gr - 46), (gx, gy - gr - 38)]
    s.a(f'<path d="{smooth(chain, closed=False)}" fill="none" stroke="#b8892e" stroke-width="3" stroke-dasharray="5 3"/>')
    zz = [tip1, (gx + 2, gy - 18), (gx - 2, gy - 4), (gx + 12, gy - 6), tip2]
    s.a(glow(gx + 6, gy - 6, 54, "#b8ccff", 0.7, "s16"),
        f'<polyline points="{P(zz)}" fill="none" stroke="#c8d8ff" stroke-width="8" stroke-linejoin="round" opacity="0.8"/>',
        f'<polyline points="{P(zz)}" fill="none" stroke="#ffffff" stroke-width="3" stroke-linejoin="round"/>')
    for (sx, sy, sr) in ((gx + 30, gy - 30, 7), (gx - 22, gy + 2, 6), (gx + 14, gy + 26, 5)):
        s.a(sparkle(sx, sy, sr, "#e8eeff", 0.8))
    # dew on the inside of the glass, and a little water gathered at the bottom
    for k in range(26):
        a = rnd.uniform(0.15, math.pi - 0.15)
        rr = gr - rnd.uniform(5, 14)
        x, y = gx + math.cos(a) * rr, gy + math.sin(a) * rr * 0.98 - rnd.uniform(0, 40)
        if math.hypot(x - gx, y - gy) > gr - 4:
            continue
        r = rnd.uniform(2.2, 4.8)
        s.a(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r)}" fill="#9ad6ff" opacity="0.75"/><circle cx="{f(x - r * 0.3)}" cy="{f(y - r * 0.3)}" r="{f(r * 0.35)}" fill="#ffffff" opacity="0.8"/>')
    s.a(f'<path d="M{gx - 40},{gy + gr - 12} Q{gx},{gy + gr + 2} {gx + 40},{gy + gr - 12} Q{gx},{gy + gr - 4} {gx - 40},{gy + gr - 12} Z" fill="#5ab0e8" opacity="0.8"/>')

    # ---------- the close-up: 2 H2 + O2 -> 2 H2O, drawn without words
    mx, my, mr = 1062, 196, 114
    opening, closing = magnifier(s, "zoomDew", mx, my, mr, COLOR, src=(gx + 40, gy + gr - 22, 18), inner="#1c1a36")
    s.a(opening)
    s.a(h2(mx - 76, my - 40, 14, 20), h2(mx - 76, my + 6, 14, -20), pair(mx - 76, my + 52, 14, "O", 10))
    s.a(arrow([(mx - 34, my + 6), (mx + 14, my + 6)], COLOR, w=6))
    for (x, y, a) in ((mx + 62, my - 30, 10), (mx + 58, my + 44, -20)):
        svg, _ = water(x, y, 20, a)
        s.a(svg)
    s.a(closing)

    # ---------- his tricorn hat at the table's end
    hx, hy = 1120, TABLE + 2
    s.a(f'<path d="M{hx - 64},{hy} Q{hx - 70},{hy - 26} {hx - 40},{hy - 34} Q{hx},{hy - 64} {hx + 40},{hy - 34} Q{hx + 70},{hy - 26} {hx + 64},{hy} Q{hx},{hy - 16} {hx - 64},{hy} Z" fill="#2a2a34" stroke="#121218" stroke-width="2"/>',
        f'<path d="M{hx - 40},{hy - 34} Q{hx},{hy - 50} {hx + 40},{hy - 34}" fill="none" stroke="#c8a84a" stroke-width="2.5" opacity="0.8"/>')
    finish(s)
    s.save("cavendish")


if __name__ == "__main__":
    build()
