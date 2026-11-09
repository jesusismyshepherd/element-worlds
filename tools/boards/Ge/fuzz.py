"""Board 'fuzz': a little stage at night under magenta and violet spotlights. On the left a red electric
guitar leans on its stand; its cable runs across the floor to a fuzz pedal (a bronze wedge with two knobs and
a foot switch) and on to an amplifier on the right, its speaker glowing. Above the guitar a smooth wave; above
the amplifier the same wave squashed flat on top and bottom, almost square. In the middle a close-up of the
pedal's insides: three germanium transistors (small metal cans on three legs) on a little circuit board."""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gekit import *  # noqa: E402,F401

COLOR = "#ff4fd8"
WAVE = "#ffb0f0"


def guitar(s, cx, cy, ang):
    """An electric guitar standing, body at (cx, cy), turned by ang degrees."""
    s.d(lin("gBody", [(0, "#ff5a4a"), (0.5, "#c0202a"), (1, "#6a0a1a")], x1=0, y1=0, x2=1, y2=1),
        lin("gNeck", [(0, "#c08850"), (1, "#7a5028")], x1=0, y1=0, x2=1, y2=0))
    out = [f'<g transform="rotate({ang} {cx} {cy})">']
    # neck and headstock
    out.append(f'<rect x="{cx - 13}" y="{cy - 330}" width="26" height="300" rx="5" fill="url(#gNeck)"/>')
    for k in range(1, 15):
        out.append(f'<line x1="{cx - 13}" y1="{cy - 50 - k * 19}" x2="{cx + 13}" y2="{cy - 50 - k * 19}" stroke="#d8d0c0" stroke-width="2"/>')
    out.append(f'<path d="M{cx - 16},{cy - 330} L{cx - 22},{cy - 400} Q{cx},{cy - 412} {cx + 22},{cy - 396} L{cx + 16},{cy - 330}Z" fill="#2a1a1a"/>')
    for k in range(3):
        for side in (-1, 1):
            out.append(f'<circle cx="{cx + side * 26}" cy="{cy - 345 - k * 20}" r="6" fill="#c8ccd4"/>')
    # the body: two horns and a round bottom
    body = [(cx - 30, cy - 70), (cx - 62, cy - 120), (cx - 92, cy - 96), (cx - 86, cy - 30), (cx - 104, cy + 40),
            (cx - 80, cy + 110), (cx, cy + 130), (cx + 80, cy + 110), (cx + 104, cy + 40), (cx + 84, cy - 30),
            (cx + 80, cy - 90), (cx + 52, cy - 104), (cx + 30, cy - 70)]
    out.append(f'<path d="{smooth(body)}" fill="url(#gBody)" stroke="#3a0a10" stroke-width="3"/>')
    out.append(f'<path d="{smooth([(cx - 50, cy - 40), (cx - 20, cy - 56), (cx + 40, cy - 40), (cx + 56, cy + 30), (cx + 20, cy + 90), (cx - 40, cy + 84), (cx - 60, cy + 20)])}" fill="#f4ece0" opacity="0.9"/>')
    for (y, w) in ((cy - 24, 60), (cy + 18, 60)):
        out.append(f'<rect x="{cx - w / 2}" y="{y}" width="{w}" height="18" rx="6" fill="#1a1a1e" stroke="#8a8a90" stroke-width="2"/>')
    out.append(f'<rect x="{cx - 26}" y="{cy + 54}" width="52" height="12" rx="3" fill="#a0a4ac"/>')
    for k in range(6):
        x = cx - 9 + k * 3.6
        out.append(f'<line x1="{x}" y1="{cy - 330}" x2="{x}" y2="{cy + 60}" stroke="#e8e8f0" stroke-width="1" opacity="0.8"/>')
    for k in range(3):
        out.append(f'<circle cx="{cx + 54 + k * 6}" cy="{cy + 58 + k * 16}" r="8" fill="#e8e0d0"/>')
    out.append("</g>")
    s.a("".join(out))


def pedal(s, cx, cy):
    s.d(lin("pedalTop", [(0, "#e0a050"), (1, "#9a5a1a")], x1=0, y1=0, x2=1, y2=1))
    s.a(f'<ellipse cx="{cx}" cy="{cy + 46}" rx="110" ry="14" fill="#000" opacity="0.4"/>',
        f'<polygon points="{P([(cx - 100, cy + 40), (cx + 100, cy + 40), (cx + 80, cy - 34), (cx - 80, cy - 34)])}" fill="url(#pedalTop)" stroke="#5a3010" stroke-width="3"/>',
        f'<rect x="{cx - 100}" y="{cy + 40}" width="200" height="12" fill="#6a3a10"/>')
    for dx in (-62, -22):
        s.a(f'<circle cx="{cx + dx}" cy="{cy - 12}" r="14" fill="#1a1a1e" stroke="#8a8a90" stroke-width="2"/>',
            f'<line x1="{cx + dx}" y1="{cy - 12}" x2="{cx + dx + 8}" y2="{cy - 22}" stroke="#e8e8f0" stroke-width="3"/>')
    s.a(f'<rect x="{cx + 22}" y="{cy + 2}" width="52" height="24" rx="6" fill="#c8ccd4" stroke="#5a5e66" stroke-width="2"/>',
        f'<circle cx="{cx + 70}" cy="{cy - 22}" r="5" fill="#ff4a6a" filter="url(#g1)"/>')


def amp(s, x, y, w, h):
    s.d(rad("cone", [(0, "#ff9ae8", 0.6), (0.3, "#5a1a50"), (1, "#14101c")]))
    s.a(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="#1a1820" stroke="#4a4458" stroke-width="4"/>',
        f'<rect x="{x + 14}" y="{y + 14}" width="{w - 28}" height="34" rx="6" fill="#2a2632"/>')
    for k in range(5):
        s.a(f'<circle cx="{x + 40 + k * (w - 80) / 4}" cy="{y + 31}" r="8" fill="#d8d0c0"/>')
    s.a(f'<rect x="{x + 14}" y="{y + 60}" width="{w - 28}" height="{h - 74}" rx="8" fill="#26222e"/>')
    cx, cy = x + w / 2, y + 60 + (h - 74) / 2
    s.a(glow(cx, cy, 90, COLOR, 0.35, "s16"), f'<circle cx="{cx}" cy="{cy}" r="{(h - 90) / 2}" fill="url(#cone)"/>',
        f'<circle cx="{cx}" cy="{cy}" r="16" fill="#3a2a40"/>')
    for k in range(-5, 6):
        s.a(f'<line x1="{x + 16}" y1="{cy + k * 16}" x2="{x + w - 16}" y2="{cy + k * 16}" stroke="#4a4458" stroke-width="1.5" opacity="0.6"/>')


def sinewave(x0, x1, y, amp_, periods, clip=None):
    pts = []
    n = 160
    for i in range(n + 1):
        t = i / n
        v = math.sin(t * periods * math.tau)
        if clip:
            v = max(-clip, min(clip, v * 2.4)) / clip
        pts.append((x0 + (x1 - x0) * t, y - v * amp_))
    return pts


def transistor_can(cx, cy, r):
    """A germanium transistor of the 1960s: a small metal can on three legs, its rim and a tab."""
    s = ""
    for dx in (-0.45, 0, 0.45):
        s += f'<line x1="{f(cx + dx * r)}" y1="{f(cy + r * 0.8)}" x2="{f(cx + dx * r * 1.4)}" y2="{f(cy + r * 2.0)}" stroke="#c8ccd4" stroke-width="{f(r * 0.12)}"/>'
    s += (f'<rect x="{f(cx - r)}" y="{f(cy - r * 1.1)}" width="{f(2 * r)}" height="{f(r * 1.9)}" rx="{f(r * 0.3)}" fill="url(#can)"/>'
          f'<ellipse cx="{f(cx)}" cy="{f(cy - r * 1.1)}" rx="{f(r)}" ry="{f(r * 0.32)}" fill="#c8d0dc"/>'
          f'<rect x="{f(cx - r * 1.12)}" y="{f(cy + r * 0.62)}" width="{f(r * 2.24)}" height="{f(r * 0.2)}" rx="{f(r * 0.1)}" fill="#8a929e"/>'
          f'<rect x="{f(cx + r * 0.75)}" y="{f(cy + r * 0.5)}" width="{f(r * 0.4)}" height="{f(r * 0.24)}" fill="#8a929e"/>')
    return s


def build():
    s = Svg("Ge", COLOR)
    gdefs(s)
    background(s, glows=[(600, 260, 380, 0.55)], seed=1965, stars=30, star_box=(0, 0, 1200, 300), bokeh=6, tint=0.6)
    # spotlights from above
    for (x, a, col) in ((240, 8, COLOR), (960, -8, "#a070ff")):
        s.a(f'<polygon points="{P([(x - 20, -10), (x + 20, -10), (x + 220 * math.sin(math.radians(a)) + 170, 560), (x + 220 * math.sin(math.radians(a)) - 170, 560)])}" '
            f'fill="{col}" opacity="0.07"/>')
    # the stage
    s.d(lin("stage", [(0, "#3a2440"), (1, "#140c1c")], x1=0, y1=0, x2=0, y2=1))
    s.a('<rect x="0" y="540" width="1200" height="260" fill="url(#stage)"/>',
        '<rect x="0" y="536" width="1200" height="6" fill="#6a3a6a" opacity="0.6"/>')
    for (x, col) in ((240, COLOR), (960, "#a070ff")):
        s.a(f'<ellipse cx="{x}" cy="566" rx="170" ry="22" fill="{col}" opacity="0.16"/>')

    # guitar, cables, pedal, amp
    s.a(f'<path d="M190,516 C240,580 400,560 470,548" fill="none" stroke="#1a1a22" stroke-width="7" stroke-linecap="round"/>',
        f'<path d="M730,548 C800,556 840,560 880,540" fill="none" stroke="#1a1a22" stroke-width="7" stroke-linecap="round"/>')
    s.a('<path d="M150,540 L200,440 L250,540" fill="none" stroke="#2a2a30" stroke-width="7"/>')
    guitar(s, 210, 420, -12)
    pedal(s, 600, 520)
    amp(s, 880, 300, 250, 250)

    # the waves: smooth from the guitar, squashed out of the amp
    s.a(f'<polyline points="{P(sinewave(215, 435, 110, 40, 2.0))}" fill="none" stroke="{WAVE}" stroke-width="6" stroke-linecap="round" '
        'stroke-linejoin="round" filter="url(#g1)"/>',
        f'<polyline points="{P(sinewave(860, 1140, 140, 46, 2.0, clip=1.0))}" fill="none" stroke="{WAVE}" stroke-width="7" '
        'stroke-linecap="round" stroke-linejoin="round" filter="url(#g2)"/>')
    for x in (845, 905, 970, 1035, 1100):
        s.a(sparkle(x, 92 + (x % 3) * 10, 6, "#ffd0f4", 0.7))

    # the close-up: three germanium transistors on a little board
    s.d(lin("can", [(0, "#5a626e"), (0.3, "#c8d0dc"), (0.55, "#8a929e"), (1, "#3a404a")], x1=0, y1=0, x2=1, y2=0),
        lin("pcb", [(0, "#2a6a3a"), (1, "#163a20")], x1=0, y1=0, x2=0, y2=1))
    o, c = magnifier(s, "pedalIn", 600, 250, 150, COLOR, src=(600, 500, 40))
    s.a(o)
    s.a('<rect x="440" y="250" width="320" height="180" fill="url(#pcb)"/>')
    for k in range(6):
        s.a(f'<path d="M{460 + k * 50},{430} L{460 + k * 50},{330} L{480 + k * 50},{310}" fill="none" stroke="#c89a40" stroke-width="5" opacity="0.7"/>')
    for (x, y, w, h, col) in ((470, 360, 40, 16, "#c8a070"), (690, 360, 40, 16, "#c8a070"), (560, 380, 20, 40, "#3a6aa0")):
        s.a(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="6" fill="{col}"/>')
    for x in (510, 600, 690):
        s.a(transistor_can(x, 214, 30))
    s.a(gball(600, 136, 14, "Ge"), gball(570, 140, 9, "Ge", op=0.8), gball(630, 140, 9, "Ge", op=0.8))
    s.a(c)
    finish(s)
    s.save("fuzz")


if __name__ == "__main__":
    build()
