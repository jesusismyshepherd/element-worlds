"""Board 'fuel': two things that burn hydrogen into water. On the left the Space Shuttle on its pad at the
moment its three main engines start: their flames pale blue and almost clear, with shock diamonds, and
clouds of steam rolling out (the boosters not yet lit). On the right a hydrogen bus with tanks on its
roof, a drop of water falling from its exhaust; over it a close-up of its fuel cell: hydrogen splits,
the protons cross the membrane, the electrons go round through a lamp, and water comes out with oxygen."""
import math
import os
import random
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from hkit import *  # noqa: E402,F401

COLOR = "#7ee86a"
GROUND = 560


def shuttle(s, x, base):
    """The Shuttle stack from the side: the orange tank, a white booster in front of it on the left, the
    orbiter on the right with its black nose and belly, its tail fin and wing."""
    s.d(lin("tank", [(0, "#8a3a10"), (0.3, "#e07a2c"), (0.55, "#f29a4a"), (1, "#7a3010")], x1=0, y1=0, x2=1, y2=0),
        lin("srb", [(0, "#7a8494"), (0.35, "#e4e8ee"), (0.6, "#c8ced8"), (1, "#6a7484")], x1=0, y1=0, x2=1, y2=0),
        lin("orb", [(0, "#16181e"), (0.28, "#2a2e38"), (0.32, "#c8ced8"), (0.6, "#eef1f6"), (1, "#8a92a2")], x1=0, y1=0, x2=1, y2=0))
    out = []
    # the tank
    tw, top = 70, base - 400
    out.append(f'<path d="M{f(x - tw / 2)},{f(base)} L{f(x - tw / 2)},{f(top + 70)} Q{f(x - tw / 2)},{f(top + 10)} {f(x)},{f(top)} '
               f'Q{f(x + tw / 2)},{f(top + 10)} {f(x + tw / 2)},{f(top + 70)} L{f(x + tw / 2)},{f(base)} Z" fill="url(#tank)" stroke="#4a1e08" stroke-width="2"/>')
    for k in (0.32, 0.58):
        yy = top + 70 + (base - top - 70) * k
        out.append(f'<line x1="{f(x - tw / 2)}" y1="{f(yy)}" x2="{f(x + tw / 2)}" y2="{f(yy)}" stroke="#6a2a0a" stroke-width="2" opacity="0.6"/>')
    # the booster, left and in front
    bx, bw, btop = x - 44, 34, base - 330
    out.append(f'<path d="M{f(bx - bw / 2)},{f(base + 6)} L{f(bx - bw / 2)},{f(btop + 40)} Q{f(bx - bw / 2)},{f(btop + 6)} {f(bx)},{f(btop)} '
               f'Q{f(bx + bw / 2)},{f(btop + 6)} {f(bx + bw / 2)},{f(btop + 40)} L{f(bx + bw / 2)},{f(base + 6)} Z" fill="url(#srb)" stroke="#3a4250" stroke-width="2"/>')
    for k in (0.25, 0.5, 0.75):
        yy = btop + 40 + (base - btop - 40) * k
        out.append(f'<line x1="{f(bx - bw / 2)}" y1="{f(yy)}" x2="{f(bx + bw / 2)}" y2="{f(yy)}" stroke="#5a6272" stroke-width="2"/>')
    out.append(f'<path d="M{f(bx - bw * 0.55)},{f(base + 6)} L{f(bx - bw * 0.7)},{f(base + 26)} L{f(bx + bw * 0.7)},{f(base + 26)} L{f(bx + bw * 0.55)},{f(base + 6)} Z" fill="#3a4250"/>')
    # the orbiter on the right of the tank, nose up
    ox, ow, otop = x + tw / 2 + 24, 48, base - 300
    out.append(f'<path d="M{f(ox + ow * 0.62)},{f(base - 8)} L{f(ox + ow * 0.62 + 92)},{f(base - 30)} L{f(ox + ow * 0.62)},{f(base - 150)} Z" fill="#d8dde6" stroke="#5a6272" stroke-width="2"/>')
    out.append(f'<path d="M{f(ox + ow * 0.5)},{f(base - 30)} L{f(ox + ow * 0.5 + 70)},{f(base - 52)} L{f(ox + ow * 0.5 + 66)},{f(base - 96)} L{f(ox + ow * 0.5)},{f(base - 90)} Z" fill="#c8ced8" stroke="#5a6272" stroke-width="2"/>')
    out.append(f'<path d="M{f(ox - ow / 2)},{f(base)} L{f(ox - ow / 2)},{f(otop + 50)} Q{f(ox - ow / 2)},{f(otop)} {f(ox + 2)},{f(otop - 6)} '
               f'Q{f(ox + ow / 2)},{f(otop + 16)} {f(ox + ow / 2)},{f(otop + 56)} L{f(ox + ow / 2)},{f(base)} Z" fill="url(#orb)" stroke="#2a2e38" stroke-width="2"/>')
    out.append(f'<path d="M{f(ox - ow / 2 + 3)},{f(otop + 34)} Q{f(ox - ow / 2 + 4)},{f(otop + 4)} {f(ox + 2)},{f(otop - 4)} Q{f(ox + 10)},{f(otop + 4)} {f(ox + 14)},{f(otop + 16)} Z" fill="#16181e"/>')
    for k in range(3):
        out.append(f'<rect x="{f(ox + 4 + k * 7)}" y="{f(otop + 30)}" width="5" height="7" rx="1.5" fill="#2a3a5a"/>')
    # the three main engines' bells under the orbiter
    bells = [(ox - 12, base + 14), (ox + 12, base + 6), (ox + 10, base + 26)]
    for (ex, ey) in bells:
        out.append(f'<path d="M{f(ex - 6)},{f(base)} L{f(ex - 12)},{f(ey)} L{f(ex + 12)},{f(ey)} L{f(ex + 6)},{f(base)} Z" fill="#4a505c" stroke="#22262e" stroke-width="1.5"/>')
    s.a("".join(out))
    return bells


def flame(x, y, length, w):
    """A hydrogen-oxygen flame: pale blue, nearly clear, with a row of shock diamonds."""
    out = [f'<path d="M{f(x - w / 2)},{f(y)} Q{f(x - w * 0.8)},{f(y + length * 0.5)} {f(x)},{f(y + length)} Q{f(x + w * 0.8)},{f(y + length * 0.5)} {f(x + w / 2)},{f(y)} Z" fill="#8fd2ff" opacity="0.4" filter="url(#s2)"/>']
    for k in range(4):
        cy = y + length * (0.14 + k * 0.21)
        dw = w * (0.5 - k * 0.08)
        out.append(f'<polygon points="{P([(x, cy - dw * 0.9), (x + dw * 0.5, cy), (x, cy + dw * 0.9), (x - dw * 0.5, cy)])}" fill="#e6f6ff" opacity="{0.85 - k * 0.15:.2f}"/>')
    return "".join(out)


def bus(s, x, y, L, H):
    """A hydrogen city bus seen from the side: green and white, tanks under a fairing on its roof, a drop
    of water falling from its exhaust at the back."""
    s.d(lin("busBody", [(0, "#eef3f0"), (0.5, "#c8d6cc"), (1, "#8aa092")], x1=0, y1=0, x2=0, y2=1),
        lin("busGreen", [(0, "#4ad06a"), (1, "#1e8a3a")], x1=0, y1=0, x2=0, y2=1))
    out = [f'<ellipse cx="{f(x + L / 2)}" cy="{f(y + H + 8)}" rx="{f(L * 0.55)}" ry="10" fill="#000" opacity="0.35" filter="url(#s8)"/>']
    out.append(f'<rect x="{f(x)}" y="{f(y)}" width="{f(L)}" height="{f(H)}" rx="18" fill="url(#busBody)" stroke="#3a4a40" stroke-width="2.5"/>')
    out.append(f'<rect x="{f(x)}" y="{f(y + H * 0.62)}" width="{f(L)}" height="{f(H * 0.26)}" fill="url(#busGreen)"/>')
    # windows and the door
    for k in range(6):
        wx = x + 26 + k * (L - 60) / 6
        out.append(f'<rect x="{f(wx)}" y="{f(y + 16)}" width="{f((L - 60) / 6 - 10)}" height="{f(H * 0.36)}" rx="5" fill="#1d3a5a" stroke="#0e1e30" stroke-width="1.5"/>'
                   f'<rect x="{f(wx + 4)}" y="{f(y + 20)}" width="{f(((L - 60) / 6 - 10) * 0.35)}" height="{f(H * 0.3)}" rx="3" fill="#5a8ab0" opacity="0.45"/>')
    out.append(f'<rect x="{f(x + L - 36)}" y="{f(y + 10)}" width="24" height="{f(H * 0.5)}" rx="6" fill="#1d3a5a"/>')
    # the roof fairing over the hydrogen tanks
    out.append(f'<rect x="{f(x + L * 0.14)}" y="{f(y - 30)}" width="{f(L * 0.6)}" height="34" rx="14" fill="#d8e2dc" stroke="#3a4a40" stroke-width="2"/>')
    for k in range(4):
        out.append(f'<ellipse cx="{f(x + L * 0.2 + k * L * 0.15)}" cy="{f(y - 13)}" rx="{f(L * 0.06)}" ry="9" fill="#b8c6be" stroke="#7a8a80" stroke-width="1.5"/>')
    # a hydrogen molecule painted on its side (no words)
    out.append(h2(x + L * 0.42, y + H * 0.75, 15, 0))
    # wheels
    for wx in (x + L * 0.2, x + L * 0.8):
        out.append(f'<circle cx="{f(wx)}" cy="{f(y + H)}" r="30" fill="#1a1e24"/><circle cx="{f(wx)}" cy="{f(y + H)}" r="14" fill="#8a929e"/>')
    # the exhaust at the back, and the water drop
    ex, ey = x + 4, y + H - 14
    out.append(f'<rect x="{f(ex - 18)}" y="{f(ey - 4)}" width="22" height="9" rx="3" fill="#6a727e"/>')
    s.d(rad("drop", [(0, "#e8fbff"), (0.5, "#7fd6ff"), (1, "#2a8ac0")], cx=0.38, cy=0.4, r=0.7))
    dx, dy = ex - 16, ey + 34
    out.append(f'<path d="M{f(dx)},{f(dy - 24)} Q{f(dx + 13)},{f(dy - 3)} {f(dx + 13)},{f(dy + 6)} A13,13 0 1 1 {f(dx - 13)},{f(dy + 6)} Q{f(dx - 13)},{f(dy - 3)} {f(dx)},{f(dy - 24)} Z" fill="url(#drop)"/>')
    out.append(f'<ellipse cx="{f(dx - 4)}" cy="{f(y + H + 26)}" rx="26" ry="5" fill="#7fd6ff" opacity="0.4"/>')
    s.a("".join(out))
    return (x + L * 0.45, y - 14)


def build():
    s = Svg("H", COLOR)
    particles(s)
    background(s, glows=[(230, 400, 300, 0.55), (860, 250, 300, 0.6)], seed=1981, stars=40, star_box=(0, 0, 1200, 360), bokeh=3)
    rnd = random.Random(2018)
    # the ground and a far shore line
    s.d(lin("pad", [(0, "#1e2a40"), (1, "#0e1426")], x1=0, y1=0, x2=0, y2=1))
    s.a(f'<rect x="0" y="{GROUND}" width="1200" height="{800 - GROUND}" fill="url(#pad)"/>',
        f'<path d="M0,{GROUND} L1200,{GROUND}" stroke="#3a5a6a" stroke-width="2" opacity="0.6"/>')

    # ---------- the launch tower and the Shuttle on its pad
    tx = 72
    s.a(f'<rect x="{tx}" y="{GROUND - 470}" width="44" height="470" fill="none" stroke="#5a3a3a" stroke-width="5"/>')
    for k in range(12):
        yy = GROUND - 470 + k * 39
        s.a(f'<line x1="{tx}" y1="{yy}" x2="{tx + 44}" y2="{yy + 39}" stroke="#5a3a3a" stroke-width="3"/><line x1="{tx}" y1="{yy}" x2="{tx + 44}" y2="{yy}" stroke="#5a3a3a" stroke-width="3"/>')
    base = GROUND - 92
    bells = shuttle(s, 230, base)
    # the launch platform under the tank and booster; the engines fire down into the flame trench
    s.a(f'<rect x="100" y="{base + 26}" width="170" height="{GROUND - base - 26}" fill="#2a3040" stroke="#4a5262" stroke-width="2"/>',
        f'<rect x="340" y="{base + 26}" width="60" height="{GROUND - base - 26}" fill="#2a3040" stroke="#4a5262" stroke-width="2"/>')
    # steam rolling out of the trench on both sides (mid-toned: big pale areas glow on the wall)
    for k in range(30):
        side = -1 if k % 2 else 1
        x = 290 + side * rnd.uniform(70, 260)
        y = GROUND - rnd.uniform(-20, 50) + abs(x - 290) * -0.05
        r = rnd.uniform(30, 62)
        col = rnd.choice(["#7d8ea6", "#8a9cb2", "#96a8bc", "#a2b2c4"])
        s.a(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r)}" fill="{col}" opacity="0.85"/>')
        s.a(f'<circle cx="{f(x - r * 0.25)}" cy="{f(y - r * 0.3)}" r="{f(r * 0.5)}" fill="#c0ccda" opacity="0.3"/>')
    for (ex, ey) in bells:
        s.a(flame(ex, ey, 96, 24))
    # water molecules drifting up out of the steam
    for (x, y, a) in ((420, 400, 20), (470, 330, -40), (360, 290, 60)):
        svg, _ = water(x, y, 14, a)
        s.a(svg)

    # ---------- the bus and its fuel cell
    src = bus(s, 640, 440, 470, 120)
    mx, my, mr = 860, 215, 160
    opening, closing = magnifier(s, "zoomCell", mx, my, mr, COLOR, src=(src[0], src[1], 20), inner="#10243a")
    s.a(opening)
    # anode | membrane | cathode
    ax0, mx0, mx1, cx1 = mx - 70, mx - 14, mx + 14, mx + 70
    top, bot = my - 60, my + 120
    s.a(f'<rect x="{f(ax0 - 18)}" y="{f(top)}" width="{f(mx0 - ax0 + 18)}" height="{f(bot - top)}" fill="#5a6474"/>',
        f'<rect x="{f(mx0)}" y="{f(top)}" width="{f(mx1 - mx0)}" height="{f(bot - top)}" fill="{COLOR}" opacity="0.55"/>',
        f'<rect x="{f(mx1)}" y="{f(top)}" width="{f(cx1 - mx1 + 18)}" height="{f(bot - top)}" fill="#5a6474"/>')
    for k in range(8):
        yy = top + 10 + k * 22
        s.a(f'<circle cx="{f(ax0 + 20)}" cy="{f(yy)}" r="3" fill="#8a94a4"/><circle cx="{f(cx1 - 20)}" cy="{f(yy + 11)}" r="3" fill="#8a94a4"/>')
    # hydrogen coming in on the left, oxygen on the right
    s.a(h2(mx - 112, my - 26, 14, 70), h2(mx - 112, my + 56, 14, 100))
    s.a(pair(mx + 116, my - 20, 14, "O", 80))
    # protons crossing the membrane
    for (x, y) in ((mx - 40, my + 10), (mx - 2, my + 46), (mx + 36, my + 80)):
        s.a(sball(x, y, 11, "pP") + charge(x + 1, y + 1, 10, "+"))
    # electrons going round through the lamp
    wire = [(ax0 - 4, top), (ax0 - 4, my - 104), (mx, my - 130), (cx1 + 4, my - 104), (cx1 + 4, top)]
    s.a(f'<path d="{smooth(wire, closed=False)}" fill="none" stroke="#1a1e2a" stroke-width="9"/>',
        f'<path d="{smooth(wire, closed=False)}" fill="none" stroke="#e8b84a" stroke-width="4"/>')
    s.a(glow(mx, my - 130, 30, "#ffe08a", 0.8, "s8"), f'<circle cx="{mx}" cy="{my - 130}" r="14" fill="#fff0b8"/>')
    for (x, y) in ((ax0 - 4, my - 80), (mx - 44, my - 124), (mx + 44, my - 124), (cx1 + 4, my - 80)):
        s.a(electron(x, y, 6) + charge(x, y, 7, "-", "#0a3a5a"))
    # water leaving the cathode
    svg, _ = water(mx + 114, my + 62, 14, 200)
    s.a(svg)
    s.a(closing)
    finish(s)
    s.save("fuel")


if __name__ == "__main__":
    build()
