"""Board 'radio': a radio telescope on a hill at night, listening to the sky. Above, our galaxy drawn as the
hydrogen map made from that whisper: spiral arms strung with glowing clouds of cold hydrogen, radio waves
running down from them into the dish. A close-up of one hydrogen atom: the electron's spin flips over
against the proton's and out goes a wave, one wavelength of it marked like a ruler. Far off, Pioneer
flies out of the solar system with its golden plaque, the hydrogen flip drawn on it."""
import math
import os
import random
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from hkit import *  # noqa: E402,F401

COLOR = "#c47cff"
GX, GY = 640, 220   # the galaxy's centre
GRX, GRY = 300, 132  # its size on the sky
HILL = 560


def gal(r, a):
    """A point of the galaxy's disc (r in 0..1 of its radius, a its angle), tilted onto the sky."""
    return GX + math.cos(a) * r * GRX, GY + math.sin(a) * r * GRY


def spin(x, y, up, size, col="#ffffff"):
    """A spin arrow drawn over a ball: up or down."""
    d = -1 if up else 1
    tip = (x, y + d * size)
    tail = (x, y - d * size * 0.75)
    h = size * 0.5
    return (f'<line x1="{f(tail[0])}" y1="{f(tail[1])}" x2="{f(tip[0])}" y2="{f(tip[1] - d * h * 0.8)}" stroke="#1a0a33" stroke-width="{f(size * 0.36)}" stroke-linecap="round" opacity="0.5" transform="translate(1.5 1.5)"/>'
            f'<line x1="{f(tail[0])}" y1="{f(tail[1])}" x2="{f(tip[0])}" y2="{f(tip[1] - d * h * 0.8)}" stroke="{col}" stroke-width="{f(size * 0.3)}" stroke-linecap="round"/>'
            f'<polygon points="{P([tip, (x - h * 0.7, tip[1] - d * h), (x + h * 0.7, tip[1] - d * h)])}" fill="{col}"/>')


def wave_path(x0, y0, x1, y1, amp, waves, n=80):
    a = math.atan2(y1 - y0, x1 - x0)
    nx, ny = -math.sin(a), math.cos(a)
    pts = []
    for i in range(n + 1):
        t = i / n
        w = math.sin(t * waves * math.tau) * amp
        pts.append((x0 + (x1 - x0) * t + nx * w, y0 + (y1 - y0) * t + ny * w))
    return smooth(pts, closed=False)


def build():
    s = Svg("H", COLOR)
    particles(s)
    background(s, glows=[(GX, GY, 360, 0.55), (980, 430, 220, 0.45)], seed=1951, stars=90, star_box=(0, 0, 1200, 560), bokeh=4)
    rnd = random.Random(1420)

    # ---------- our galaxy: a soft disc, a bright bar, two arms strung with hydrogen clouds
    s.d(rad("disc", [(0, "#ffe6c8", 0.55), (0.25, "#c8a0ff", 0.25), (0.7, "#7a5ac8", 0.1), (1, "#7a5ac8", 0)]))
    s.a(f'<ellipse cx="{GX}" cy="{GY}" rx="{GRX}" ry="{GRY}" fill="url(#disc)"/>')
    clouds = []
    for arm in range(2):
        pts = []
        for i in range(70):
            t = i / 69
            r = 0.12 + t * 0.9
            a = arm * math.pi + 0.3 + t * 4.4
            pts.append(gal(r, a))
            if i % 4 == 2 and r < 0.98:
                clouds.append((*gal(r + rnd.uniform(-0.03, 0.03), a + rnd.uniform(-0.05, 0.05)), r))
        s.a(f'<path d="{smooth(pts, closed=False)}" fill="none" stroke="#b890ff" stroke-width="22" opacity="0.18" filter="url(#s8)"/>',
            f'<path d="{smooth(pts, closed=False)}" fill="none" stroke="#d8c0ff" stroke-width="5" opacity="0.35" filter="url(#s2)"/>')
    for (x, y, r) in clouds:
        rr = 8 + (1 - r) * 6 + rnd.uniform(0, 6)
        s.a(glow(x, y, rr * 1.8, "#ff7ad8", 0.45, "s4"), f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(rr * 0.5)}" fill="#ffb0e8" opacity="0.8"/>')
    s.a(f'<ellipse cx="{GX}" cy="{GY}" rx="52" ry="24" fill="#ffe0b8" opacity="0.55" filter="url(#s8)" transform="rotate(-14 {GX} {GY})"/>',
        f'<ellipse cx="{GX}" cy="{GY}" rx="22" ry="11" fill="#fff0d8" opacity="0.8" filter="url(#s2)"/>')
    # the Sun's place in it: a small gold ring
    sx, sy = gal(0.62, 1.9)
    s.a(f'<circle cx="{f(sx)}" cy="{f(sy)}" r="7" fill="none" stroke="#ffd166" stroke-width="2.5"/><circle cx="{f(sx)}" cy="{f(sy)}" r="2.4" fill="#ffd166"/>')

    # ---------- the hill and the radio telescope
    s.d(lin("hill", [(0, "#1e1a40"), (1, "#0c0e24")], x1=0, y1=0, x2=0, y2=1))
    s.a(f'<path d="M0,{HILL - 40} Q220,{HILL - 90} 470,{HILL - 30} T900,{HILL - 10} T1200,{HILL - 24} L1200,800 L0,800 Z" fill="url(#hill)"/>')
    dx, dy, dr = 250, 400, 118
    turn = 32  # the dish turned from straight up toward the galaxy (degrees, clockwise)
    s.a(f'<path d="M{dx - 70},{HILL - 62} L{dx - 24},{dy + 40} L{dx + 24},{dy + 40} L{dx + 70},{HILL - 62} Z" fill="#5a6078" stroke="#2a2e40" stroke-width="2"/>',
        f'<rect x="{dx - 90}" y="{HILL - 70}" width="180" height="16" rx="4" fill="#4a5068"/>')
    s.d(lin("dishFace", [(0, "#c8cede"), (0.6, "#8a92a8"), (1, "#5a6278")], x1=0, y1=0, x2=1, y2=1))
    g = f'<g transform="rotate({turn} {dx} {dy})">'
    g += f'<path d="M{dx - dr},{dy - 20} Q{dx},{dy + 70} {dx + dr},{dy - 20} Q{dx},{dy + 20} {dx - dr},{dy - 20} Z" fill="url(#dishFace)" stroke="#3a3e50" stroke-width="2.5"/>'
    g += f'<ellipse cx="{dx}" cy="{dy - 20}" rx="{dr}" ry="26" fill="#9aa2b8" stroke="#3a3e50" stroke-width="2.5"/>'
    for k in range(-3, 4):
        g += f'<line x1="{dx + k * dr / 3.6}" y1="{dy - 20 - 22 * math.sqrt(max(0, 1 - (k / 3.6) ** 2))}" x2="{dx + k * dr / 3.6}" y2="{dy - 20 + 22 * math.sqrt(max(0, 1 - (k / 3.6) ** 2))}" stroke="#6a7288" stroke-width="1.4"/>'
    fx, fy = dx, dy - 130
    for sx2 in (-dr * 0.7, dr * 0.7):
        g += f'<line x1="{dx + sx2}" y1="{dy - 20}" x2="{fx}" y2="{fy}" stroke="#4a5068" stroke-width="3"/>'
    g += f'<rect x="{fx - 9}" y="{fy - 16}" width="18" height="22" rx="3" fill="#4a5068"/>'
    g += "</g>"
    s.a(g)
    # where the feed sits after the turn
    t = math.radians(turn)
    feed = (dx + (fx - dx) * math.cos(t) - (fy - dy) * math.sin(t), dy + (fx - dx) * math.sin(t) + (fy - dy) * math.cos(t))
    s.a(glow(feed[0], feed[1], 16, COLOR, 0.8, "s4"))

    # ---------- radio waves from the clouds down to the dish
    for (x, y, r) in sorted(clouds, key=lambda c: c[0])[2:9:3]:
        d = wave_path(x, y, feed[0] + 6, feed[1] + 6, 6, int(math.hypot(x - feed[0], y - feed[1]) / 34))
        s.a(f'<path d="{d}" fill="none" stroke="#d8a8ff" stroke-width="3" opacity="0.7" stroke-linecap="round"/>')

    # ---------- Pioneer, far off, with its plaque
    px, py = 1080, 92
    s.a(f'<g transform="rotate(-20 {px} {py})">'
        f'<line x1="{px - 50}" y1="{py + 6}" x2="{px + 46}" y2="{py + 6}" stroke="#a8b0c0" stroke-width="2.5"/>'
        f'<rect x="{px - 58}" y="{py + 1}" width="12" height="10" rx="2" fill="#7a8292"/><rect x="{px + 42}" y="{py + 1}" width="12" height="10" rx="2" fill="#7a8292"/>'
        f'<line x1="{px}" y1="{py + 6}" x2="{px + 10}" y2="{py + 60}" stroke="#a8b0c0" stroke-width="1.8"/>'
        f'<ellipse cx="{px}" cy="{py - 4}" rx="30" ry="9" fill="#dde2ea" stroke="#6a7282" stroke-width="1.5"/>'
        f'<rect x="{px - 9}" y="{py}" width="18" height="12" fill="#8a7a5a"/>'
        f'<rect x="{px + 6}" y="{py - 2}" width="10" height="7" fill="#ffd166"/></g>')
    s.a(sparkle(px + 14, py - 6, 9, "#fff2c0", 0.95))

    # ---------- the close-up: the spin flip and its wave
    mx, my, mr = 990, 410, 146
    cl = sorted(clouds, key=lambda c: -c[0])[1]
    opening, closing = magnifier(s, "zoomFlip", mx, my, mr, COLOR, src=(cl[0], cl[1], 16), inner="#1a1240")
    s.a(opening)
    for (ax, up_e) in ((mx - 68, True), (mx + 68, False)):
        ay = my - 46
        s.a(ring(ax, ay, 50, 20, -12, w=2.6))
        ex, ey = on_ring(ax, ay, 50, 20, -12, 2.6)
        s.a(sball(ax, ay, 21, "pP"), spin(ax, ay, True, 17))
        s.a(electron(ex, ey, 14), spin(ex, ey, up_e, 15, "#0e3a5a"))
    s.a(arrow([(mx - 14, my - 46), (mx + 14, my - 46)], "#e8d8ff", w=6))
    # the wave leaving, one wavelength marked with a gold ruler under it
    wy = my + 44
    s.a(f'<path d="{wave_path(mx - 118, wy, mx + 118, wy, 18, 3)}" fill="none" stroke="#e0b8ff" stroke-width="6" stroke-linecap="round"/>')
    x0 = mx - 118 + 236 / 3
    x1 = x0 + 236 / 3
    s.a(f'<rect x="{f(x0)}" y="{wy + 34}" width="{f(x1 - x0)}" height="20" rx="3" fill="#e8b84a" stroke="#8a6a1a" stroke-width="1.5"/>')
    for k in range(9):
        xx = x0 + (x1 - x0) * k / 8
        s.a(f'<line x1="{f(xx)}" y1="{wy + 34}" x2="{f(xx)}" y2="{wy + (44 if k % 4 else 52)}" stroke="#6a4a10" stroke-width="1.8"/>')
    s.a(f'<line x1="{f(x0)}" y1="{wy + 30}" x2="{f(x0)}" y2="{wy - 22}" stroke="#e8b84a" stroke-width="2.5" stroke-dasharray="5 4"/>',
        f'<line x1="{f(x1)}" y1="{wy + 30}" x2="{f(x1)}" y2="{wy - 22}" stroke="#e8b84a" stroke-width="2.5" stroke-dasharray="5 4"/>')
    s.a(closing)
    finish(s)
    s.save("radio")


if __name__ == "__main__":
    build()
