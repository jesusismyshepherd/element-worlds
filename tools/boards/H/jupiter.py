"""Board 'jupiter': Jupiter with a slice cut out to show its insides: the thin striped clouds, the deep
ocean of hydrogen getting thicker downward, the glowing layer of liquid metallic hydrogen with currents
running through it, and the fuzzy core in the middle. Its magnetic field loops round it, auroras glow at
its poles, the Great Red Spot turns on its face, the Galileo probe drifts down under its parachute, and a
tiny Earth beside it shows how big it is (Jupiter is about 11 Earths wide)."""
import math
import os
import random
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from hkit import *  # noqa: E402,F401

COLOR = "#ff7062"
CX, CY, R = 520, 340, 248
# the slice cut out: from A0 to A1 (degrees, SVG angles: 0 = right, 90 = down)
A0, A1 = -62, 18


def arc_pt(r, a):
    t = math.radians(a)
    return CX + math.cos(t) * r, CY + math.sin(t) * r


def wedge(r0, r1, a0=A0, a1=A1):
    """An annular sector between radii r0 < r1, angles a0..a1."""
    p0, p1 = arc_pt(r1, a0), arc_pt(r1, a1)
    if r0 <= 0:
        return f"M{f(CX)},{f(CY)} L{f(p0[0])},{f(p0[1])} A{f(r1)},{f(r1)} 0 0 1 {f(p1[0])},{f(p1[1])} Z"
    q1, q0 = arc_pt(r0, a1), arc_pt(r0, a0)
    return (f"M{f(p0[0])},{f(p0[1])} A{f(r1)},{f(r1)} 0 0 1 {f(p1[0])},{f(p1[1])} "
            f"L{f(q1[0])},{f(q1[1])} A{f(r0)},{f(r0)} 0 0 0 {f(q0[0])},{f(q0[1])} Z")


def field_line(L, side, rnd):
    """A dipole field line r = L sin^2(theta) about the vertical axis, outside the planet."""
    pts = []
    for k in range(121):
        th = 0.02 + k * (math.pi - 0.04) / 120
        r = L * math.sin(th) ** 2
        if r < R * 1.0:
            if pts:
                break
            continue
        x = CX + side * r * math.sin(th)
        y = CY - r * math.cos(th)
        pts.append((x, y))
    return pts


def build():
    s = Svg("H", COLOR)
    particles(s)
    background(s, glows=[(CX, CY, 420, 0.5), (1000, 160, 200, 0.4)], seed=1995, stars=70, star_box=(0, 0, 1200, 620), bokeh=4)
    rnd = random.Random(2016)

    # ---------- the magnetic field, looping out and back (behind the planet)
    for L in (1.5, 1.95, 2.6, 3.4):
        for side in (-1, 1):
            pts = field_line(L * R, side, rnd)
            if len(pts) > 3:
                s.a(f'<path d="{smooth(pts, closed=False)}" fill="none" stroke="#c49cff" stroke-width="3" stroke-dasharray="10 9" opacity="{0.55 - (L - 1.5) * 0.1:.2f}"/>')

    # ---------- the planet's face: bands, the Great Red Spot
    s.d(f'<clipPath id="disc"><circle cx="{CX}" cy="{CY}" r="{R}"/></clipPath>',
        rad("limb", [(0, "#000", 0), (0.7, "#000", 0.05), (1, "#000", 0.6)], cx=0.42, cy=0.42, r=0.62),
        rad("grs", [(0, "#d8603a"), (0.6, "#c0482a"), (1, "#8a3420")]))
    s.a(glow(CX, CY, R * 1.05, "#ffb08a", 0.25, "s16"))
    s.a('<g clip-path="url(#disc)">')
    bands = [(-1.0, "#c2ac8c"), (-0.82, "#a87a58"), (-0.66, "#c8b494"), (-0.5, "#9a6444"), (-0.34, "#cab896"), (-0.16, "#b48c6c"),
             (0.02, "#ccb896"), (0.16, "#985f40"), (0.34, "#c4ae8c"), (0.5, "#a06c4c"), (0.66, "#c6b292"), (0.82, "#9a6c4e"), (1.0, "#b49e7e")]
    for (v0, c0), (v1, _) in zip(bands, bands[1:]):
        y0, y1 = CY + v0 * R, CY + v1 * R
        wav = [(x, y0 + math.sin(x / 38 + v0 * 9) * 4) for x in range(CX - R, CX + R + 1, 20)]
        wav2 = [(x, y1 + math.sin(x / 34 + v1 * 7) * 4) for x in range(CX + R, CX - R - 1, -20)]
        s.a(f'<path d="{poly(wav + wav2)}" fill="{c0}"/>')
    # the bands' colours are dimmed a touch so they do not glow on the wall
    s.a(f'<circle cx="{CX}" cy="{CY}" r="{R}" fill="#3a2a40" opacity="0.12"/>')
    gx, gy = CX - 70, CY + 0.36 * R
    s.a(f'<ellipse cx="{gx}" cy="{gy}" rx="56" ry="30" fill="#d8c0a0"/><ellipse cx="{gx}" cy="{gy}" rx="44" ry="22" fill="url(#grs)"/>'
        f'<path d="M{gx - 30},{gy - 4} Q{gx},{gy - 16} {gx + 28},{gy - 2}" fill="none" stroke="#f0a070" stroke-width="3" opacity="0.6"/>')
    s.a(f'<circle cx="{CX}" cy="{CY}" r="{R}" fill="url(#limb)"/>')
    s.a("</g>")

    # ---------- the slice: clouds, molecular hydrogen, metallic hydrogen, the dilute core
    s.d(rad("molec", [(0.82, "#1e4a8a"), (0.97, "#5a8ad0")], cx=CX, cy=CY, r=R, user=True),
        rad("metal", [(0.3, "#6a7aa8"), (0.55, "#9aa8d0"), (0.82, "#5a6aa0")], cx=CX, cy=CY, r=R, user=True),
        rad("core", [(0, "#a8704a"), (0.6, "#8a5a44"), (1, "#8a5a44", 0)], cx=CX, cy=CY, r=R * 0.42, user=True))
    s.a(f'<path d="{wedge(0, R * 1.0)}" fill="#0b0f24"/>')
    s.a(f'<path d="{wedge(R * 0.96, R * 1.0)}" fill="#e8c8a0"/>')
    s.a(f'<path d="{wedge(R * 0.8, R * 0.96)}" fill="url(#molec)"/>')
    s.a(f'<path d="{wedge(0, R * 0.8)}" fill="url(#metal)"/>')
    # metal's sheen: a pale band along the cut, and currents flashing in it
    s.d(f'<clipPath id="metalClip"><path d="{wedge(R * 0.34, R * 0.8)}"/></clipPath>')
    s.a('<g clip-path="url(#metalClip)">')
    for k in range(5):
        a = A0 + 8 + k * (A1 - A0 - 16) / 4
        pts = [arc_pt(R * (0.4 + j * 0.08) + rnd.uniform(-6, 6), a + rnd.uniform(-4, 4)) for j in range(6)]
        s.a(f'<polyline points="{P(pts)}" fill="none" stroke="#dfe8ff" stroke-width="3" stroke-linejoin="round" opacity="0.75"/>',
            f'<polyline points="{P(pts)}" fill="none" stroke="#9fc0ff" stroke-width="9" stroke-linejoin="round" opacity="0.25" filter="url(#s4)"/>')
    s.a("</g>")
    s.a(f'<path d="{wedge(0, R * 0.42)}" fill="url(#core)"/>')
    # small hydrogen molecules in the fluid layer, getting closer together with depth
    for k in range(22):
        rr = rnd.uniform(R * 0.82, R * 0.95)
        a = rnd.uniform(A0 + 4, A1 - 4)
        x, y = arc_pt(rr, a)
        s.a(h2(x, y, 4.2 + (rr - R * 0.8) / R * 6, rnd.uniform(0, 180), grey=True, op=0.85))
    # in the metal: protons in a sea of free electrons
    for k in range(30):
        rr = rnd.uniform(R * 0.45, R * 0.77)
        a = rnd.uniform(A0 + 4, A1 - 4)
        x, y = arc_pt(rr, a)
        if k % 2:
            s.a(sball(x, y, 4.2, "pP", shine=False))
        else:
            s.a(f'<circle cx="{f(x)}" cy="{f(y)}" r="2.6" fill="{ELECTRON}"/>')
    # the cut's edges
    for a in (A0, A1):
        p = arc_pt(R, a)
        s.a(f'<line x1="{CX}" y1="{CY}" x2="{f(p[0])}" y2="{f(p[1])}" stroke="#ffd8b8" stroke-width="2" opacity="0.5"/>')

    # ---------- auroras at the poles
    for (py, ry) in ((CY - R * 0.97, 9), (CY + R * 0.97, 8)):
        s.a(f'<ellipse cx="{CX}" cy="{f(py)}" rx="62" ry="{ry}" fill="none" stroke="#ff7ad8" stroke-width="10" opacity="0.35" filter="url(#s4)"/>',
            f'<ellipse cx="{CX}" cy="{f(py)}" rx="62" ry="{ry}" fill="none" stroke="#ffb0ec" stroke-width="3" opacity="0.85"/>')

    # ---------- the Galileo probe drifting down under its parachute, top left
    px, py = CX - 172, CY - 222
    s.a(f'<path d="M{px - 26},{py - 30} Q{px},{py - 58} {px + 26},{py - 30} Z" fill="#e8e2d8" stroke="#8a8478" stroke-width="1.5"/>')
    for dx in (-24, -8, 8, 24):
        s.a(f'<line x1="{px + dx}" y1="{py - 31}" x2="{px}" y2="{py - 4}" stroke="#c8c2b8" stroke-width="1.2"/>')
    s.a(f'<path d="M{px - 10},{py - 4} L{px + 10},{py - 4} L{px + 7},{py + 10} L{px - 7},{py + 10} Z" fill="#b8892e" stroke="#6a4a14" stroke-width="1.2"/>')

    # ---------- a tiny Earth beside it, to scale
    ex, ey, er = 960, 420, R / 11.2
    s.a(glow(ex, ey, er * 1.5, "#7fc0ff", 0.35, "s4"), ball(ex, ey, er, "N"),
        f'<path d="M{f(ex - er * 0.5)},{f(ey - er * 0.2)} q{f(er * 0.3)},{f(-er * 0.5)} {f(er * 0.7)},{f(-er * 0.1)} q{f(-er * 0.1)},{f(er * 0.5)} {f(-er * 0.7)},{f(er * 0.4)} Z" fill="#4aa064"/>')
    # Io, a little moon further out
    s.a(f'<circle cx="1050" cy="170" r="16" fill="#e8d46a"/><circle cx="1046" cy="166" r="4" fill="#c87a2a" opacity="0.7"/><circle cx="1056" cy="176" r="3" fill="#a85a2a" opacity="0.7"/>')
    finish(s)
    s.save("jupiter")


if __name__ == "__main__":
    build()
