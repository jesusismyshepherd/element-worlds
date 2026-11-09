"""Board 'transistor': the point-contact transistor of December 1947, big, on a lab bench at night. A clear
plastic triangle stands on its point, gold foil down its two lower edges, slit at the tip so two gold points
touch the germanium almost together; a bent spring from a bracket presses it onto a grey germanium slab on a
brass base. A wire from one gold point to a 1940s microphone (small sound rings), from the other to a pair of
headphones (big sound rings): the whisper made loud. Behind on the left, the old way: a vacuum tube glowing
orange, dimmed. A close-up at the tip: the two gold points on the germanium's atoms, a thin trickle in and a
broad stream out."""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gekit import *  # noqa: E402,F401

COLOR = "#6fd0ff"
GOLD = "#ffc93a"
TIP = (600, 404)


def tube(s, cx, base):
    """A vacuum tube: a glass bulb on a black base, its heater glowing orange inside."""
    s.d(lin("tubeGlass", [(0, "#c8d8f0", 0.2), (0.5, "#c8d8f0", 0.06), (1, "#c8d8f0", 0.2)], x1=0, y1=0, x2=1, y2=0))
    s.a(glow(cx, base - 90, 70, "#ff8a3a", 0.5, "s16"),
        f'<rect x="{cx - 34}" y="{base - 26}" width="68" height="26" rx="5" fill="#141418"/>')
    for k in range(4):
        s.a(f'<line x1="{cx - 21 + k * 14}" y1="{base}" x2="{cx - 21 + k * 14}" y2="{base + 16}" stroke="#8a8a90" stroke-width="3"/>')
    s.a(f'<path d="M{cx - 40},{base - 26} L{cx - 40},{base - 150} Q{cx - 40},{base - 196} {cx},{base - 200} Q{cx + 40},{base - 196} {cx + 40},{base - 150} L{cx + 40},{base - 26}Z" '
        f'fill="url(#tubeGlass)" stroke="#9ab0d0" stroke-width="2.5" opacity="0.9"/>',
        f'<rect x="{cx - 20}" y="{base - 150}" width="40" height="100" rx="3" fill="#3a3a44" stroke="#6a6a74" stroke-width="2"/>',
        f'<rect x="{cx - 7}" y="{base - 138}" width="14" height="76" rx="3" fill="#ff9a4a" opacity="0.85" filter="url(#g1)"/>',
        f'<path d="M{cx - 30},{base - 170} Q{cx - 30},{base - 186} {cx - 16},{base - 190}" fill="none" stroke="#fff" stroke-width="4" '
        'stroke-linecap="round" opacity="0.35"/>')


def microphone(s, cx, cy):
    """A 1940s microphone on a short stand: a round grille head in a ring."""
    s.a(f'<rect x="{cx - 6}" y="{cy + 44}" width="12" height="96" fill="#2a2e3a"/>',
        f'<ellipse cx="{cx}" cy="{cy + 142}" rx="54" ry="12" fill="#22262f"/>',
        f'<circle cx="{cx}" cy="{cy}" r="52" fill="#3a404e" stroke="#8a94a8" stroke-width="5"/>',
        f'<circle cx="{cx}" cy="{cy}" r="40" fill="#20242e"/>')
    for k in range(-3, 4):
        s.a(f'<line x1="{cx - 38}" y1="{cy + k * 10}" x2="{cx + 38}" y2="{cy + k * 10}" stroke="#5a6070" stroke-width="3"/>')
    s.a(f'<path d="M{cx - 30},{cy - 28} A40,40 0 0 1 {cx + 6},{cy - 40}" fill="none" stroke="#fff" stroke-width="5" '
        'stroke-linecap="round" opacity="0.35"/>')


def headphones(s, cx, cy):
    s.a(f'<path d="M{cx - 70},{cy + 20} Q{cx - 74},{cy - 92} {cx},{cy - 96} Q{cx + 74},{cy - 92} {cx + 70},{cy + 20}" fill="none" '
        'stroke="#3a3e4a" stroke-width="14" stroke-linecap="round"/>')
    for side in (-1, 1):
        x = cx + side * 72
        s.a(f'<ellipse cx="{x}" cy="{cy + 30}" rx="30" ry="44" fill="#2a2e3a" stroke="#6a7080" stroke-width="4"/>',
            f'<ellipse cx="{x + side * -6}" cy="{cy + 30}" rx="16" ry="28" fill="#1a1d26"/>')


def rings(s, cx, cy, n, r0, step, side, col, w):
    for k in range(n):
        r = r0 + k * step
        a0, a1 = -0.75, 0.75
        if side < 0:
            a0, a1 = math.pi - 0.75, math.pi + 0.75
        x0, y0 = cx + r * math.cos(a0), cy + r * math.sin(a0)
        x1, y1 = cx + r * math.cos(a1), cy + r * math.sin(a1)
        s.a(f'<path d="M{f(x0)},{f(y0)} A{r},{r} 0 0 1 {f(x1)},{f(y1)}" fill="none" stroke="{col}" stroke-width="{w}" '
            f'stroke-linecap="round" opacity="{0.9 - k * 0.15:.2f}"/>')


def device(s):
    """The base, the germanium slab, the triangle with its gold foil, the spring and its bracket."""
    tx, ty = TIP
    s.d(lin("brass", [(0, "#e0b060"), (0.5, "#a8782a"), (1, "#6a4a1a")], x1=0, y1=0, x2=0, y2=1),
        lin("brassTop", [(0, "#f0c878"), (1, "#c09040")], x1=0, y1=0, x2=1, y2=0),
        lin("plastic", [(0, "#bfe8ff", 0.34), (0.5, "#9ad4ff", 0.14), (1, "#bfe8ff", 0.3)], x1=0, y1=0, x2=1, y2=0),
        lin("foil", [(0, "#fff0a8"), (0.5, "#ffc93a"), (1, "#c08a10")], x1=0, y1=0, x2=1, y2=1))
    # brass base: a block seen a little from above
    s.a(f'<polygon points="{P([(440, 470), (760, 470), (800, 446), (480, 446)])}" fill="url(#brassTop)"/>',
        f'<rect x="440" y="470" width="320" height="70" fill="url(#brass)"/>',
        f'<polygon points="{P([(760, 470), (800, 446), (800, 516), (760, 540)])}" fill="#6a4a1a"/>')
    # the germanium slab on it
    s.a(f'<polygon points="{P([(500, 430), (690, 430), (716, 414), (526, 414)])}" fill="url(#geCut)"/>',
        f'<rect x="500" y="430" width="190" height="24" fill="url(#geSide)"/>',
        f'<polygon points="{P([(690, 430), (716, 414), (716, 438), (690, 454)])}" fill="#20252e"/>',
        f'<polygon points="{P([(520, 428), (600, 428), (612, 420), (532, 420)])}" fill="#c8d8e8" opacity="0.18"/>')
    # the triangle on its point
    top = 150
    half = 140
    s.a(f'<polygon points="{P([(tx - half, top), (tx + half, top), (tx, ty - 2)])}" fill="url(#plastic)" stroke="#cfeaff" '
        'stroke-width="3" stroke-opacity="0.7"/>')
    # gold foil down both lower edges, slit at the tip: two points almost together
    gap = 5
    for side in (-1, 1):
        ex = tx - side * half
        pts = [(ex + side * 4, top + 30), (ex + side * 22, top + 30), (tx + side * gap + side * 10, ty - 22), (tx + side * gap, ty - 2),
               (tx + side * gap - side * 2, ty - 18)]
        s.a(f'<polygon points="{P(pts)}" fill="url(#foil)" stroke="#a87a10" stroke-width="1.5"/>')
    s.a(glow(tx, ty - 2, 26, COLOR, 0.8, "s8"))
    # the spring: a bent wire from a bracket on a post, pressing the triangle's top
    s.a(f'<rect x="800" y="120" width="18" height="352" fill="#4a5060"/>',
        f'<rect x="760" y="110" width="80" height="22" rx="4" fill="#5a6070"/>')
    spring = [(770, 122), (700, 120), (660, 104), (640, 128), (660, 150), (620, 140), (600, 150)]
    s.a(f'<path d="{smooth(spring, closed=False)}" fill="none" stroke="#c8d0dc" stroke-width="6" stroke-linecap="round"/>',
        f'<path d="{smooth(spring, closed=False)}" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.5"/>')
    # wires: from the left gold point to the microphone, from the right one to the headphones
    s.a(f'<path d="M{tx - half + 12},{top + 34} C{tx - 220},{top + 40} 330,330 250,300" fill="none" stroke="#d87a3a" stroke-width="5"/>',
        f'<path d="M{tx + half - 12},{top + 34} C{tx + 200},{top + 160} 900,340 950,300" fill="none" stroke="#d87a3a" stroke-width="5"/>',
    )


def build():
    s = Svg("Ge", COLOR)
    gdefs(s)
    background(s, glows=[(600, 320, 360, 0.7)], seed=1947, stars=40, star_box=(0, 0, 1200, 560), bokeh=5, tint=0.6)
    # the bench
    s.d(lin("bench", [(0, "#3a3046"), (1, "#1a1626")], x1=0, y1=0, x2=0, y2=1))
    s.a('<rect x="0" y="540" width="1200" height="260" fill="url(#bench)"/>',
        '<rect x="0" y="536" width="1200" height="6" fill="#5a4a6a" opacity="0.6"/>')
    s.a('<g opacity="0.6">')  # dimmed: the old way
    tube(s, 110, 520)
    s.a('</g>')
    device(s)
    microphone(s, 250, 300)
    rings(s, 250, 300, 2, 70, 16, -1, COLOR, 4)
    headphones(s, 1020, 290)
    rings(s, 1020, 300, 4, 116, 22, 1, COLOR, 7)
    # the close-up at the tip: the two gold points on germanium, a trickle in, a stream out
    o, c = magnifier(s, "tipM", 330, 128, 96, COLOR, src=(TIP[0], TIP[1] - 4, 22))
    s.a(o)
    s.a(lattice(330, 196, 5, 40, 11, "Ge", seed=3, op=0.9))
    for side in (-1, 1):
        x = 330 + side * 22
        s.a(f'<polygon points="{P([(x - side * 4, 20), (x + side * 40, 20), (x + side * 4, 108), (x, 108)])}" fill="url(#foil)" '
            'stroke="#a87a10" stroke-width="1.5"/>')
    s.a(arrow([(300, 44), (294, 76), (301, 104)], COLOR, w=3, op=0.95),
        arrow([(358, 104), (372, 74), (378, 40)], COLOR, w=12, op=0.95))
    s.a(c)
    finish(s)
    s.save("transistor")


if __name__ == "__main__":
    build()
