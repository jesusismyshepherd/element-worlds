"""Board 'meteorite': a fireball streaking down the night sky over a dark savanna (iron that fell from the
sky). In front, Tutankhamun's dagger lying on the ground: a grey iron blade, a golden hilt banded with
granulation and a rock-crystal knob. On the right a polished slice of an iron meteorite, etched so its
criss-cross Widmanstätten crystals show, its rim dark brown crust; a close-up of the metal: iron atoms with
a few nickel atoms among them."""
import math
import os
import random
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from lib.style import *  # noqa: E402,F401

VIOLET = "#9a8cff"
NI = ("#e6ffe6", "#50d050", "#1f6e1f")  # nickel's CPK green, deepened so it shades


def fireball(s, x0, y0, x1, y1, rnd):
    """A meteor from (x0, y0) to its head at (x1, y1): a tapering glowing tail, sparks, a hot head."""
    a = math.atan2(y1 - y0, x1 - x0)
    n = (math.cos(a + math.pi / 2), math.sin(a + math.pi / 2))
    s.d(lin("tail", [(0, "#ff9a3c", 0), (0.6, "#ffb85a", 0.55), (1, "#fff0c8", 0.95)], x1=x0, y1=y0, x2=x1, y2=y1, user=True),
        lin("tailOut", [(0, VIOLET, 0), (1, "#ff8a3c", 0.45)], x1=x0, y1=y0, x2=x1, y2=y1, user=True))
    for w, fill, blur in ((46, "url(#tailOut)", "s16"), (18, "url(#tail)", "s2")):
        pts = [(x0, y0), (x1 + n[0] * w / 2, y1 + n[1] * w / 2), (x1 - n[0] * w / 2, y1 - n[1] * w / 2)]
        s.a(f'<polygon points="{P(pts)}" fill="{fill}" filter="url(#{blur})"/>')
    for _ in range(26):
        t = rnd.uniform(0.35, 0.98)
        off = rnd.uniform(-1, 1) * 30 * t
        x, y = x0 + (x1 - x0) * t + n[0] * off, y0 + (y1 - y0) * t + n[1] * off
        s.a(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(rnd.uniform(1.2, 3.2))}" fill="#ffd27a" opacity="{rnd.uniform(0.4, 0.9):.2f}"/>')
    s.a(glow(x1, y1, 46, "#ff9a3c", 0.75, "s16"), glow(x1, y1, 20, "#ffe6b0", 0.9, "s4"),
        f'<circle cx="{f(x1)}" cy="{f(y1)}" r="9" fill="#fff6dc"/>')


def dagger(s, x0, y0, ang, L):
    """Tutankhamun's iron dagger lying at an angle: the blade from the hilt at (x0, y0) along `ang`, L long."""
    g = []
    blade = L * 0.6
    s.d(lin("blade", [(0, "#c3c9d2"), (0.45, "#8a929e"), (0.55, "#646c78"), (1, "#3c424c")], x1=0, y1=0, x2=0, y2=1),
        lin("gold", [(0, "#ffe9a0"), (0.4, "#e8b030"), (1, "#8a5a10")], x1=0, y1=0, x2=0, y2=1),
        rad("crystal", [(0, "#ffffff", 0.9), (0.4, "#d8ecff", 0.55), (1, "#8aa8d8", 0.35)], cx=0.35, cy=0.3, r=0.75))
    tr = f'transform="translate({f(x0)},{f(y0)}) rotate({f(ang)})"'
    g.append(f"<g {tr}>")
    # the shadow on the ground
    g.append(f'<ellipse cx="{f(L * 0.3)}" cy="26" rx="{f(L * 0.62)}" ry="16" fill="#000" opacity="0.35" filter="url(#s8)"/>')
    # the blade: long, leaf-like, with a ridge down its middle
    w = 34
    bl = [(0, -w / 2), (blade * 0.55, -w / 2 - 3), (blade * 0.9, -w * 0.32), (blade, 0), (blade * 0.9, w * 0.32), (blade * 0.55, w / 2 + 3), (0, w / 2)]
    g.append(f'<path d="{smooth(bl, k=0.6)}" fill="url(#blade)" stroke="#2a2e36" stroke-width="2"/>')
    g.append(f'<path d="M4,0 L{f(blade * 0.96)},0" stroke="#d8dee6" stroke-width="2.5" opacity="0.7"/>')
    g.append(f'<path d="M6,-9 L{f(blade * 0.7)},-8" stroke="#ffffff" stroke-width="3" opacity="0.28" stroke-linecap="round"/>')
    # a few dark spots of age on the iron
    for (px, py, pr) in ((blade * 0.3, 6, 4), (blade * 0.52, -7, 3), (blade * 0.68, 5, 3.5)):
        g.append(f'<circle cx="{f(px)}" cy="{f(py)}" r="{f(pr)}" fill="#4a3a32" opacity="0.5"/>')
    # the guard and the golden hilt, banded with granulation and inlaid stripes
    g.append(f'<rect x="-14" y="{f(-w / 2 - 8)}" width="16" height="{f(w + 16)}" rx="5" fill="url(#gold)" stroke="#6a4208" stroke-width="2"/>')
    hl = L * 0.3
    g.append(f'<rect x="{f(-hl - 14)}" y="-17" width="{f(hl)}" height="34" rx="9" fill="url(#gold)" stroke="#6a4208" stroke-width="2"/>')
    for k in range(6):
        x = -24 - k * (hl - 20) / 5.5
        g.append(f'<rect x="{f(x - 4)}" y="-16" width="8" height="32" fill="{["#2a5ab8", "#c8402a", "#2a5ab8", "#1aa088", "#c8402a", "#2a5ab8"][k]}" opacity="0.8"/>')
        for j in range(5):
            g.append(f'<circle cx="{f(x + 7)}" cy="{f(-12 + j * 6)}" r="1.8" fill="#fff2b0" opacity="0.85"/>')
    # the round knob of rock crystal at the end
    kx = -hl - 22
    g.append(f'<ellipse cx="{f(kx)}" cy="0" rx="20" ry="24" fill="url(#gold)" stroke="#6a4208" stroke-width="2"/>')
    g.append(f'<circle cx="{f(kx - 4)}" cy="0" r="17" fill="url(#crystal)" stroke="#e0f0ff" stroke-width="1.5" opacity="0.95"/>')
    g.append(sparkle(kx - 9, -7, 7, "#ffffff", 0.85))
    g.append("</g>")
    s.a("".join(g))


def etched_slice(s, cx, cy, R, rnd):
    """A polished, etched slice: plates of kamacite in three directions with bright thin taenite between,
    darker fields where they meet, a dark brown crust round the edge."""
    s.d(f'<clipPath id="sliceClip"><path d="{slice_path(cx, cy, R)}"/></clipPath>',
        lin("sheen", [(0, "#ffffff", 0), (0.42, "#ffffff", 0.08), (0.52, "#ffffff", 0.02), (1, "#ffffff", 0)], x1=0, y1=0, x2=1, y2=1))
    out = [f'<ellipse cx="{f(cx + 10)}" cy="{f(cy + R * 0.95)}" rx="{f(R * 0.95)}" ry="22" fill="#000" opacity="0.4" filter="url(#s8)"/>',
           glow(cx, cy, R * 1.05, VIOLET, 0.35, "s16"),
           f'<path d="{slice_path(cx, cy, R * 1.05)}" fill="#3a2418" stroke="#24150c" stroke-width="3"/>',
           # the dark, fine-grained fields (plessite) between the plates
           f'<path d="{slice_path(cx, cy, R)}" fill="#3c424b"/>',
           '<g clip-path="url(#sliceClip)">']
    # the plates of kamacite: three directions, each catching the light in its own shade (as an etched
    # slice does when you tilt it), laid in a random order so the sets weave over and under each other
    plates = []
    for k, (ang, col) in enumerate(((16, "#7c8490"), (76, "#596170"), (136, "#8f97a3"))):
        a = math.radians(ang)
        d = (math.cos(a), math.sin(a))
        nrm = (-d[1], d[0])
        off = -R * 1.25
        while off < R * 1.25:
            w = rnd.uniform(10, 22)
            # a plate runs until it meets another: long and short pieces along the same line
            pos = -R * 1.3
            while pos < R * 1.3:
                seg = rnd.uniform(0.25, 0.9) * R
                plates.append((rnd.random(), cx + nrm[0] * off + d[0] * (pos + seg / 2), cy + nrm[1] * off + d[1] * (pos + seg / 2), d, nrm, seg, w, col))
                pos += seg + rnd.uniform(6, 30)
            off += w + rnd.uniform(5, 14)
    for (_, x, y, d, nrm, seg, w, col) in sorted(plates):
        p1 = (x - d[0] * seg / 2, y - d[1] * seg / 2)
        p2 = (x + d[0] * seg / 2, y + d[1] * seg / 2)
        out.append(f'<line x1="{f(p1[0])}" y1="{f(p1[1])}" x2="{f(p2[0])}" y2="{f(p2[1])}" stroke="{col}" stroke-width="{f(w)}"/>')
        # the bright, thin taenite along each plate's sides
        for sgn in (-1, 1):
            q1 = (p1[0] + nrm[0] * sgn * w / 2, p1[1] + nrm[1] * sgn * w / 2)
            q2 = (p2[0] + nrm[0] * sgn * w / 2, p2[1] + nrm[1] * sgn * w / 2)
            out.append(f'<line x1="{f(q1[0])}" y1="{f(q1[1])}" x2="{f(q2[0])}" y2="{f(q2[1])}" stroke="#bcc4cf" stroke-width="1.4" opacity="0.75"/>')
    out.append(f'<rect x="{f(cx - R * 1.2)}" y="{f(cy - R * 1.2)}" width="{f(R * 2.4)}" height="{f(R * 2.4)}" fill="url(#sheen)"/>')
    out.append("</g>")
    out.append(f'<path d="{slice_path(cx, cy, R)}" fill="none" stroke="#6a4a36" stroke-width="3"/>')
    s.a("".join(out))


def slice_path(cx, cy, R):
    """The slice's outline: a rounded, slightly irregular disc (a meteorite is no perfect circle)."""
    pts = []
    for k in range(28):
        a = k / 28 * math.tau
        r = R * (1 + 0.035 * math.sin(2 * a + 0.7) + 0.02 * math.sin(3 * a + 2.1))
        pts.append((cx + math.cos(a) * r * 1.08, cy + math.sin(a) * r * 0.92))
    return smooth(pts)


def build():
    s = Svg("Fe", VIOLET)
    s.d(rad("bNi", [(0, NI[0]), (0.28, NI[1]), (0.78, mix(NI[1], NI[2], 0.55)), (1, NI[2])], cx=0.36, cy=0.32, r=0.72, fx=0.32, fy=0.26))
    background(s, glows=[(320, 200, 340, 0.6), (860, 360, 320, 0.6)], seed=1920, stars=110, star_box=(0, 0, 1200, 470), bokeh=5)
    rnd = random.Random(1925)

    # the savanna at night: a low horizon, a few flat-topped acacias
    s.a('<path d="M0,500 C200,486 380,494 600,488 C820,482 1000,492 1200,486 L1200,800 L0,800Z" fill="#1a1838"/>',
        '<path d="M0,520 C260,508 520,520 760,512 C960,506 1100,514 1200,510 L1200,800 L0,800Z" fill="#151330"/>')
    for (x, h, w) in ((90, 70, 120), (560, 52, 90), (1130, 64, 110)):
        s.a(f'<path d="M{x - 3},{500} L{x - 2},{500 - h} L{x + 2},{500 - h} L{x + 4},{500}Z" fill="#100e26"/>',
            f'<ellipse cx="{x}" cy="{500 - h - 6}" rx="{w / 2}" ry="12" fill="#100e26"/>')

    # the fireball, from high on the left down towards the horizon
    fireball(s, 30, 20, 470, 250, rnd)

    # Tutankhamun's dagger on the ground
    dagger(s, 250, 520, -14, 470)

    # the etched slice, and a close-up of its metal
    cx, cy, R = 860, 345, 170
    etched_slice(s, cx, cy, R, rnd)
    opening, closing = magnifier(s, "zoomFeNi", 1075, 135, 98, VIOLET, src=(cx + 70, cy - 90, 20))
    s.a(opening)
    for j in range(-3, 4):
        for i in range(-3, 4):
            x = 1075 + i * 34 + (j % 2) * 17
            y = 135 + j * 30
            el = "Ni" if (i * 7 + j * 3) % 9 == 0 else "Fe"
            s.a(ball(x, y, 15, el))
    s.a(closing)
    finish(s)
    s.save("meteorite")


if __name__ == "__main__":
    build()
