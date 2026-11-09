"""Board 'mirror': inside the dome of the great telescope on Mount Wilson at night. Through the open slit, the
stars and the Andromeda galaxy; at the bottom, the telescope's great round mirror lying in its cell, being given
a new coat of silver: a jar pours the silvering liquid, and where it has spread, the glass has become a bright
mirror that shows the galaxy again, while the rest is still dark, bare glass. Starlight comes down and bounces
back up. A close-up of the mirror's face: glass below, one thin layer of silver atoms on top, light bouncing
off it."""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from agkit import *  # noqa: E402,F401

COLOR = "#b48cff"
MX, MY, MRX, MRY = 470, 470, 330, 78  # the mirror's face: an ellipse seen from above at a slant


def dome(s, rnd):
    """The dome: dark curved walls with ribs, the slit open on the sky, the galaxy in it."""
    s.d(lin("domeWall", [(0, "#1f1a44"), (1, "#0e0c24")], x1=0, y1=0, x2=0, y2=1),
        lin("slitSky", [(0, "#2a1f5e"), (1, "#3c2a7a")], x1=0, y1=0, x2=0, y2=1),
        rad("andro", [(0, "#fff2dc", 0.95), (0.12, "#ffd9b0", 0.75), (0.4, "#c8a8ff", 0.35), (1, "#8a6cff", 0)]),
        '<clipPath id="slit"><path d="M380,0 L720,0 L690,330 Q600,350 510,330 Z"/></clipPath>')
    # the dome's inside: two dark curved walls either side of the slit
    s.a('<path d="M0,0 L380,0 L510,330 Q300,360 0,420 Z" fill="url(#domeWall)"/>',
        '<path d="M1200,0 L720,0 L690,330 Q900,360 1200,420 Z" fill="url(#domeWall)"/>')
    for k in range(5):
        t = k / 4
        s.a(f'<path d="M{f(40 + t * 300)},0 Q{f(120 + t * 260)},{f(200)} {f(60 + t * 380)},{f(380 - t * 40)}" fill="none" '
            'stroke="#2c2660" stroke-width="5" opacity="0.8"/>',
            f'<path d="M{f(1160 - t * 300)},0 Q{f(1080 - t * 260)},{f(200)} {f(1140 - t * 380)},{f(380 - t * 40)}" fill="none" '
            'stroke="#2c2660" stroke-width="5" opacity="0.8"/>')
    # the slit: sky, stars, the Andromeda galaxy tilted
    sky = ['<rect x="370" y="0" width="360" height="360" fill="url(#slitSky)"/>']
    for _ in range(70):
        x, y = rnd.uniform(380, 720), rnd.uniform(0, 340)
        sky.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(rnd.choice([0.9, 1.2, 1.5, 2.0]))}" fill="#ffffff" '
                   f'opacity="{rnd.uniform(0.4, 0.95):.2f}"/>')
    gx, gy = 560, 120
    sky.append(f'<ellipse cx="{gx}" cy="{gy}" rx="120" ry="34" transform="rotate(-28 {gx} {gy})" fill="url(#andro)"/>')
    sky.append(f'<ellipse cx="{gx}" cy="{gy}" rx="70" ry="16" transform="rotate(-28 {gx} {gy})" fill="none" stroke="#e8d8ff" '
               'stroke-width="2" opacity="0.35"/>')
    sky.append(f'<ellipse cx="{gx}" cy="{gy}" rx="22" ry="9" transform="rotate(-28 {gx} {gy})" fill="#fff0d8" opacity="0.85"/>')
    sky.append(sparkle(gx + 70, gy - 52, 9, "#fff6e0", 0.9))
    s.a('<g clip-path="url(#slit)">' + "".join(sky) + "</g>")
    s.a('<path d="M380,0 L510,330 Q600,350 690,330 L720,0" fill="none" stroke="#3a3290" stroke-width="6"/>')
    return gx, gy


def tube(s):
    """The telescope's open tube, drawn simply: two side girders rising from the mirror cell towards the slit,
    three rings round it."""
    out = []
    for (x0, x1) in ((180, 300), (760, 640)):
        out.append(f'<line x1="{x0}" y1="430" x2="{x1}" y2="30" stroke="#1a1638" stroke-width="18"/>')
        out.append(f'<line x1="{x0}" y1="430" x2="{x1}" y2="30" stroke="#3a3478" stroke-width="3" opacity="0.7"/>')
    for (y, w) in ((60, 6), (200, 8), (330, 10)):
        t = (430 - y) / 400
        xl, xr = 180 + 120 * t, 760 - 120 * t
        out.append(f'<ellipse cx="{f((xl + xr) / 2)}" cy="{y}" rx="{f((xr - xl) / 2)}" ry="{f(10 + (1 - t) * 18)}" fill="none" '
                   f'stroke="#1a1638" stroke-width="{w}"/>')
        out.append(f'<path d="M{f(xl)},{y} A{f((xr - xl) / 2)},{f(10 + (1 - t) * 18)} 0 0 0 {f(xr)},{y}" fill="none" '
                   'stroke="#3a3478" stroke-width="2" opacity="0.7"/>')
    s.a("".join(out))


def mirror(s, gal):
    """The great mirror in its cell, half silvered: a bright mirror where the liquid has spread, dark glass beyond."""
    s.d(lin("glassSide", [(0, "#2c5a5c"), (1, "#123032")], x1=0, y1=0, x2=0, y2=1),
        lin("bareGlass", [(0, "#1c3a44"), (1, "#0c1c26")], x1=0, y1=0, x2=1, y2=0),
        f'<clipPath id="face"><ellipse cx="{MX}" cy="{MY}" rx="{MRX}" ry="{MRY}"/></clipPath>')
    # the cell and the glass disc's edge (the 2.5 m mirror is 33 cm thick)
    s.a(f'<ellipse cx="{MX}" cy="{MY + 70}" rx="{MRX + 40}" ry="{MRY + 18}" fill="#141032"/>',
        f'<rect x="{MX - MRX - 40}" y="{MY}" width="{2 * MRX + 80}" height="70" fill="#1a1640"/>',
        f'<ellipse cx="{MX}" cy="{MY}" rx="{MRX + 40}" ry="{MRY + 18}" fill="#241e52"/>',
        f'<path d="M{MX - MRX},{MY} L{MX - MRX},{MY + 44} A{MRX},{MRY} 0 0 0 {MX + MRX},{MY + 44} L{MX + MRX},{MY} Z" '
        'fill="url(#glassSide)"/>')
    s.a(f'<ellipse cx="{MX}" cy="{MY}" rx="{MRX}" ry="{MRY}" fill="url(#bareGlass)"/>')
    # the silvered part: everything left of a wavy front, a mirror showing bands of light and the galaxy
    front = []
    for k in range(13):
        t = k / 12
        y = MY - MRY - 6 + t * (2 * MRY + 12)
        x = MX + 120 + math.sin(t * 7.0) * 26 - t * 60
        front.append((x, y))
    path = (f"M{MX - MRX - 10},{MY - MRY - 10} L{f(front[0][0])},{f(front[0][1])} " +
            " ".join(f"L{f(x)},{f(y)}" for x, y in front[1:]) + f" L{MX - MRX - 10},{MY + MRY + 10} Z")
    face = [f'<path d="{path}" fill="url(#agBand)"/>']
    # the reflection of the galaxy and the slit, upside down in the mirror
    gx = MX - 70
    face.append(f'<path d="M{MX - 190},{MY - 70} L{MX - 30},{MY - 70} L{MX - 50},{MY + 80} L{MX - 175},{MY + 80} Z" fill="#2a1f5e" '
                'opacity="0.5" filter="url(#s8)"/>')
    face.append(f'<ellipse cx="{gx}" cy="{MY - 4}" rx="70" ry="13" transform="rotate(18 {gx} {MY - 4})" fill="url(#andro)" opacity="0.9"/>')
    face.append(f'<ellipse cx="{gx}" cy="{MY - 4}" rx="12" ry="5" transform="rotate(18 {gx} {MY - 4})" fill="#fff0d8" opacity="0.8"/>')
    # the wet front: a thin bright line where silver is just forming
    face.append(f'<path d="M{f(front[0][0])},{f(front[0][1])} ' + " ".join(f"L{f(x)},{f(y)}" for x, y in front[1:]) +
                '" fill="none" stroke="#d8dfea" stroke-width="5" opacity="0.6"/>')
    # the liquid still spreading on the bare glass: a faint pale pool beyond the front
    face.append(f'<ellipse cx="{MX + 175}" cy="{MY + 8}" rx="90" ry="32" fill="#8a93a4" opacity="0.28"/>')
    s.a('<g clip-path="url(#face)">' + "".join(face) + "</g>")
    s.a(f'<ellipse cx="{MX}" cy="{MY}" rx="{MRX}" ry="{MRY}" fill="none" stroke="#3a3478" stroke-width="5"/>')
    # the jar pouring the silvering liquid
    jx, jy = 800, 300
    s.a(f'<g transform="rotate(-38 {jx} {jy})">'
        f'<path d="M{jx - 46},{jy - 70} L{jx + 46},{jy - 70} L{jx + 46},{jy + 60} Q{jx},{jy + 74} {jx - 46},{jy + 60} Z" '
        'fill="#c8d0ff" opacity="0.12"/>'
        f'<path d="M{jx - 46},{jy - 70} L{jx + 46},{jy - 70} L{jx + 46},{jy + 60} Q{jx},{jy + 74} {jx - 46},{jy + 60} Z" '
        'fill="none" stroke="#d8e0ff" stroke-width="4" opacity="0.8"/>'
        f'<path d="M{jx - 44},{jy - 10} L{jx + 44},{jy - 10} L{jx + 44},{jy + 58} Q{jx},{jy + 72} {jx - 44},{jy + 58} Z" '
        'fill="#9aa2b4" opacity="0.55"/>'
        '</g>')
    s.a(f'<path d="M{jx - 60},{jy - 36} Q{jx - 76},{jy + 40} {MX + 190},{MY - 2}" fill="none" stroke="#b0b8c8" stroke-width="10" '
        'stroke-linecap="round" opacity="0.75"/>')
    s.a(f'<path d="M{jx - 62},{jy - 30} Q{jx - 76},{jy + 40} {MX + 192},{MY - 6}" fill="none" stroke="#e8ecf4" stroke-width="3" '
        'stroke-linecap="round" opacity="0.6"/>')
    # starlight coming down the tube, and bouncing back up off the silvered half
    for k, x in enumerate((300, 360, 420)):
        y1 = MY - 18 + k * 6
        s.a(f'<line x1="{x + 120}" y1="40" x2="{x}" y2="{y1}" stroke="#fff2c0" stroke-width="3" opacity="0.55" stroke-dasharray="14 8"/>',
            f'<line x1="{x}" y1="{y1}" x2="{x - 40 + k * 70}" y2="90" stroke="#fff2c0" stroke-width="3" opacity="0.4" stroke-dasharray="14 8"/>')
    s.a(glow(360, MY - 10, 60, "#fff2c0", 0.35, "s16"))
    s.a(sparkle(250, MY - 20, 12, "#ffffff", 0.9), sparkle(410, MY + 26, 9, "#ffffff", 0.8))


def closeup(s):
    """The mirror's face magnified: glass below, one layer of silver atoms on it, light bouncing off."""
    cx, cy, R = 985, 225, 140
    opening, closing = magnifier(s, "magAg", cx, cy, R, COLOR, src=(330, 470, 22), inner="#1a1438")
    body = []
    # the glass: a pale teal block under the silver
    body.append(f'<rect x="{cx - R}" y="{cy + 34}" width="{2 * R}" height="{R}" fill="#1f5560"/>')
    for k in range(8):
        y = cy + 50 + k * 14
        body.append(f'<line x1="{cx - R}" y1="{y}" x2="{cx + R}" y2="{y}" stroke="#2f7280" stroke-width="2" opacity="0.5"/>')
    # one layer of silver atoms on its surface
    for i in range(-5, 6):
        body.append(aball(cx + i * 30, cy + 20, 15, "Ag"))
    # light coming in and bouncing back off the silver
    for k, xh in enumerate((cx - 70, cx + 10)):
        yh = cy + 2
        body.append(f'<path d="{wave(xh - 90, cy - 130, xh, yh, 5, 4.5)}" fill="none" stroke="#ffe08a" stroke-width="4" '
                    'stroke-linecap="round"/>')
        body.append(f'<path d="{wave(xh, yh, xh + 58, cy - 84, 5, 3)}" fill="none" stroke="#ffe08a" stroke-width="4" '
                    'stroke-linecap="round"/>')
        a = math.atan2(-86, 58)
        tip = (xh + 68, cy - 99)
        side = (math.cos(a + math.pi / 2) * 9, math.sin(a + math.pi / 2) * 9)
        back = (tip[0] - math.cos(a) * 18, tip[1] - math.sin(a) * 18)
        body.append(f'<polygon points="{P([tip, (back[0] + side[0], back[1] + side[1]), (back[0] - side[0], back[1] - side[1])])}" '
                    'fill="#ffe08a"/>')
    s.a(opening, "".join(body), closing)


def build():
    s = Svg("Ag", COLOR)
    adefs(s)
    background(s, glows=[(560, 140, 300, 0.5), (420, 470, 320, 0.35)], seed=1917, stars=20, star_box=(0, 0, 1200, 300), bokeh=4)
    rnd = rng(1923)
    gal = dome(s, rnd)
    tube(s)
    mirror(s, gal)
    closeup(s)
    finish(s)
    s.save("mirror")


if __name__ == "__main__":
    build()
