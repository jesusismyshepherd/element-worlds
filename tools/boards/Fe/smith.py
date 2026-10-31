"""Board 'smith': an Iron Age smelting place at dusk. A clay shaft furnace (a bloomery) glows at its base,
flames licking from its top; leather bellows blow into it through a clay pipe; beside it heaps of red iron
ore and black charcoal. On the right an anvil on a tree stump, a glowing bloom on it, a hammer striking and
sparks flying; a bucket of water steaming. A roundhouse and a dark wood behind. A close-up inside the
furnace: carbon monoxide carrying oxygen away from iron oxide, iron left behind."""
import math
import os
import random
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from lib.style import *  # noqa: E402,F401

RED = "#ff5a4e"
GROUND = 560


def furnace(s, x, base, rnd):
    """A clay shaft furnace: tapering, cracked, its tapping arch glowing at the foot, flames at the top."""
    h, w0, w1 = 290, 82, 52
    top = base - h
    s.d(lin("clay", [(0, "#4a2a1c"), (0.3, "#8a5a3a"), (0.55, "#a8714a"), (1, "#3a2216")], x1=0, y1=0, x2=1, y2=0),
        rad("mouth", [(0, "#fff0b0"), (0.35, "#ffb030"), (0.8, "#e0441a"), (1, "#7a1a0a")], cx=0.5, cy=0.7, r=0.7),
        lin("flame", [(0, "#ffe9a0", 0.95), (0.5, "#ff9a2a", 0.8), (1, "#ff3a1a", 0)], x1=0, y1=1, x2=0, y2=0))
    out = [glow(x, base - 40, 150, "#ff6a2a", 0.45, "s30")]
    # flames and smoke above the mouth
    for k, (dx, hh, ww) in enumerate(((-14, 120, 34), (10, 150, 30), (0, 95, 46))):
        pts = [(x + dx - ww, top + 8), (x + dx - ww * 0.4, top - hh * 0.5), (x + dx + rnd.uniform(-8, 8), top - hh),
               (x + dx + ww * 0.45, top - hh * 0.45), (x + dx + ww, top + 8)]
        out.append(f'<path d="{smooth(pts, closed=True, k=0.8)}" fill="url(#flame)" opacity="0.85" filter="url(#s2)"/>')
    for k in range(5):
        out.append(f'<circle cx="{f(x - 20 + k * 22 + rnd.uniform(-10, 10))}" cy="{f(top - 170 - k * 34)}" r="{f(24 + k * 8)}" '
                   f'fill="#3a3448" opacity="{0.35 - k * 0.05:.2f}" filter="url(#s8)"/>')
    body = [(x - w0, base), (x - w1, top), (x + w1, top), (x + w0, base)]
    out.append(f'<path d="{poly(body)}" fill="url(#clay)" stroke="#2a160c" stroke-width="3" stroke-linejoin="round"/>')
    out.append(f'<ellipse cx="{f(x)}" cy="{f(top)}" rx="{f(w1)}" ry="12" fill="#2a160c"/>'
               f'<ellipse cx="{f(x)}" cy="{f(top + 2)}" rx="{f(w1 - 10)}" ry="7" fill="#ffb030" opacity="0.9" filter="url(#g1)"/>')
    # cracks and the glow of heat through the clay at the bottom
    for (cx0, cy0, pts) in ((x - 30, base - 210, [(0, 0), (6, 18), (2, 34), (9, 52)]), (x + 24, base - 150, [(0, 0), (-5, 16), (2, 30)])):
        out.append(f'<path d="M{" L".join(f"{f(cx0 + a)},{f(cy0 + b)}" for a, b in pts)}" fill="none" stroke="#ff7a2a" stroke-width="2.5" opacity="0.7"/>')
    s.d(lin("heat", [(0, "#ff6a2a", 0), (1, "#ff6a2a", 0.45)], x1=0, y1=0, x2=0, y2=1))
    out.append(f'<path d="{poly([(x - w0 + 4, base), (x - w0 * 0.85, base - 120), (x + w0 * 0.85, base - 120), (x + w0 - 4, base)])}" fill="url(#heat)"/>')
    # the tapping arch at the foot, glowing, with slag running out
    out.append(f'<path d="M{f(x - 30)},{f(base)} L{f(x - 30)},{f(base - 34)} A30,30 0 0 1 {f(x + 30)},{f(base - 34)} L{f(x + 30)},{f(base)}Z" fill="url(#mouth)" filter="url(#g1)"/>')
    out.append(f'<path d="M{f(x - 10)},{f(base - 4)} C{f(x)},{f(base + 6)} {f(x + 30)},{f(base + 4)} {f(x + 60)},{f(base + 12)}" fill="none" '
               f'stroke="#ff8a2a" stroke-width="8" stroke-linecap="round" opacity="0.9"/>')
    s.a("".join(out))
    return top


def bellows(s, x, y, nozzle):
    """Two leather bellows, pumped in turn, and the clay pipe into the furnace."""
    out = []
    for k, (dx, dy, sq) in enumerate(((0, 0, 1.0), (-36, 30, 0.75))):
        bx, by = x + dx, y + dy
        out.append(f'<path d="M{f(bx - 70)},{f(by)} C{f(bx - 70)},{f(by - 46 * sq)} {f(bx + 10)},{f(by - 52 * sq)} {f(bx + 46)},{f(by - 8)} '
                   f'L{f(bx + 46)},{f(by + 8)} C{f(bx + 10)},{f(by + 40 * sq)} {f(bx - 70)},{f(by + 34 * sq)} {f(bx - 70)},{f(by)}Z" '
                   f'fill="#7a4a2a" stroke="#3a2010" stroke-width="3"/>')
        for j in range(3):
            out.append(f'<path d="M{f(bx - 50 + j * 24)},{f(by - 34 * sq)} Q{f(bx - 40 + j * 24)},{f(by)} {f(bx - 50 + j * 24)},{f(by + 30 * sq)}" '
                       f'fill="none" stroke="#4a2a14" stroke-width="2" opacity="0.7"/>')
        out.append(f'<rect x="{f(bx - 92)}" y="{f(by - 5)}" width="26" height="10" rx="4" fill="#5a3a20"/>')
    # the pipe (a clay tuyere) into the furnace's foot
    out.append(f'<path d="M{f(x + 44)},{f(y)} L{f(nozzle[0])},{f(nozzle[1])}" stroke="#8a5a3a" stroke-width="16" stroke-linecap="round"/>')
    out.append(f'<path d="M{f(x + 44)},{f(y - 4)} L{f(nozzle[0])},{f(nozzle[1] - 4)}" stroke="#b07a52" stroke-width="4" stroke-linecap="round" opacity="0.6"/>')
    s.a("".join(out))


def heap(s, x, y, w, cols, rnd, n=26, r=(8, 15)):
    out = []
    # from the bottom of the heap up, so the upper lumps sit on the lower ones
    lumps = []
    for _ in range(n):
        dx = rnd.uniform(-1, 1)
        lumps.append((dx, rnd.uniform(0, 1) * (1 - abs(dx) ** 1.5)))
    for dx, up in sorted(lumps, key=lambda q: q[1]):
        hx = x + dx * w
        hy = y - up * w * 0.75
        rr = rnd.uniform(*r)
        pts = [(hx + math.cos(a) * rr * rnd.uniform(0.7, 1.1), hy + math.sin(a) * rr * rnd.uniform(0.6, 0.9))
               for a in [k / 6 * math.tau for k in range(6)]]
        out.append(f'<polygon points="{P(pts)}" fill="{rnd.choice(cols)}" stroke="#000" stroke-opacity="0.25" stroke-width="1.5"/>')
    s.a("".join(out))


def anvil(s, x, base):
    """An anvil on a stump, a glowing bloom on it, the hammer coming down, sparks."""
    s.d(lin("anvil", [(0, "#5a6270"), (0.4, "#363c48"), (1, "#1c2028")], x1=0, y1=0, x2=0, y2=1),
        rad("bloom", [(0, "#fff2b0"), (0.35, "#ffb030"), (0.75, "#ff5a1a"), (1, "#a8280a")], cx=0.45, cy=0.4, r=0.65),
        lin("stump", [(0, "#4a3020"), (0.5, "#6a4a30"), (1, "#3a2416")], x1=0, y1=0, x2=1, y2=0))
    top = base - 150
    out = [f'<ellipse cx="{f(x)}" cy="{f(base + 4)}" rx="80" ry="12" fill="#000" opacity="0.4"/>',
           f'<path d="M{f(x - 52)},{f(base)} L{f(x - 48)},{f(top + 60)} L{f(x + 48)},{f(top + 60)} L{f(x + 52)},{f(base)}Z" fill="url(#stump)"/>',
           f'<ellipse cx="{f(x)}" cy="{f(top + 60)}" rx="48" ry="9" fill="#8a6a46"/>']
    body = [(x - 110, top), (x + 70, top), (x + 70, top + 22), (x + 34, top + 30), (x + 30, top + 52), (x + 44, top + 60),
            (x - 44, top + 60), (x - 30, top + 52), (x - 34, top + 30), (x - 70, top + 26), (x - 110, top + 8)]
    out.append(f'<path d="{poly(body)}" fill="url(#anvil)" stroke="#12141a" stroke-width="2.5" stroke-linejoin="round"/>')
    out.append(f'<path d="M{f(x - 104)},{f(top + 2)} L{f(x + 66)},{f(top + 2)}" stroke="#9aa4b4" stroke-width="3" opacity="0.6"/>')
    # the bloom: a glowing, lumpy, spongy cake of iron
    bx, by = x - 10, top - 16
    out.append(glow(bx, by, 60, "#ff8a2a", 0.6, "s16"))
    pts = [(bx - 46, by + 14), (bx - 40, by - 10), (bx - 18, by - 22), (bx + 10, by - 20), (bx + 36, by - 12), (bx + 46, by + 10), (bx + 20, by + 16), (bx - 20, by + 16)]
    out.append(f'<path d="{smooth(pts)}" fill="url(#bloom)" stroke="#8a2a0a" stroke-width="2"/>')
    for (px, py, pr) in ((bx - 20, by - 4, 5), (bx + 8, by - 8, 4), (bx + 24, by + 4, 5), (bx - 4, by + 8, 3.5)):
        out.append(f'<circle cx="{f(px)}" cy="{f(py)}" r="{f(pr)}" fill="#c83a10" opacity="0.8"/>')
    # the hammer, swung down onto it
    hx, hy = bx + 6, by - 46
    out.append(f'<g transform="rotate(-28 {f(hx)} {f(hy)})">'
               f'<rect x="{f(hx - 4)}" y="{f(hy - 20)}" width="150" height="14" rx="6" fill="#8a6038" stroke="#4a3018" stroke-width="2"/>'
               f'<rect x="{f(hx - 26)}" y="{f(hy - 40)}" width="40" height="56" rx="6" fill="url(#anvil)" stroke="#12141a" stroke-width="2.5"/></g>')
    s.a("".join(out))
    return bx, by


def sparks(s, x, y, rnd, n=34):
    out = []
    for _ in range(n):
        a = rnd.uniform(-math.pi * 0.95, -math.pi * 0.05)
        d = rnd.uniform(30, 150)
        x1, y1 = x + math.cos(a) * d, y + math.sin(a) * d
        x0, y0 = x + math.cos(a) * (d - rnd.uniform(8, 22)), y + math.sin(a) * (d - rnd.uniform(8, 22))
        out.append(f'<line x1="{f(x0)}" y1="{f(y0)}" x2="{f(x1)}" y2="{f(y1)}" stroke="{rnd.choice(["#ffd27a", "#ffb030", "#fff0c0"])}" '
                   f'stroke-width="{f(rnd.uniform(1.5, 3))}" stroke-linecap="round" opacity="{rnd.uniform(0.6, 1):.2f}"/>')
    s.a("".join(out))


def bucket(s, x, base, rnd):
    s.d(lin("wood", [(0, "#5a3a22"), (0.5, "#7a5232"), (1, "#4a2e1a")], x1=0, y1=0, x2=1, y2=0))
    out = [f'<path d="M{f(x - 44)},{f(base - 80)} L{f(x - 36)},{f(base)} L{f(x + 36)},{f(base)} L{f(x + 44)},{f(base - 80)}Z" fill="url(#wood)" stroke="#2a1a0e" stroke-width="2.5"/>',
           f'<rect x="{f(x - 44)}" y="{f(base - 62)}" width="88" height="7" fill="#3a3e48"/>',
           f'<rect x="{f(x - 40)}" y="{f(base - 22)}" width="80" height="7" fill="#3a3e48"/>',
           f'<ellipse cx="{f(x)}" cy="{f(base - 80)}" rx="44" ry="9" fill="#3a6a8a"/>']
    for k in range(3):
        out.append(f'<path d="M{f(x - 18 + k * 18)},{f(base - 90)} c-14,-20 14,-34 0,-56 c-12,-18 10,-30 2,-46" fill="none" '
                   f'stroke="#d8e2f0" stroke-width="7" stroke-linecap="round" opacity="0.35" filter="url(#s2)"/>')
    s.a("".join(out))


def build():
    s = Svg("Fe", RED)
    background(s, glows=[(330, 380, 320, 0.7), (780, 380, 260, 0.6)], seed=1200, stars=50, star_box=(0, 0, 1200, 300), bokeh=4, tint=0.5)
    rnd = random.Random(3200)

    # dusk over a wood: the last light low in the west, dark trees, a roundhouse
    s.d(lin("dusk", [(0, "#ff8a5a", 0), (1, "#ff8a5a", 0.32)], x1=0, y1=0, x2=0, y2=1))
    s.a(f'<rect x="0" y="200" width="1200" height="{GROUND - 200}" fill="url(#dusk)"/>')
    trees = []
    x = -20
    while x < 1240:
        h = rnd.uniform(90, 170)
        trees.append(f'<path d="M{f(x - 34)},{GROUND - 40} L{f(x)},{f(GROUND - 40 - h)} L{f(x + 34)},{GROUND - 40}Z" fill="#1a1428"/>')
        x += rnd.uniform(36, 60)
    s.a("".join(trees))
    # the roundhouse: a low wall and a tall thatched cone, a warm door
    rx = 1010
    s.a(f'<path d="M{rx - 130},{GROUND - 30} L{rx - 120},{GROUND - 90} L{rx + 120},{GROUND - 90} L{rx + 130},{GROUND - 30}Z" fill="#2a1e26"/>',
        f'<path d="M{rx - 150},{GROUND - 84} L{rx},{GROUND - 260} L{rx + 150},{GROUND - 84}Z" fill="#3a2a22" stroke="#22161a" stroke-width="3"/>',
        f'<rect x="{rx - 22}" y="{GROUND - 82}" width="44" height="52" rx="6" fill="#ffb05a" opacity="0.8"/>')
    for k in range(1, 6):
        y = GROUND - 84 - k * 28
        hw = 150 * (1 - (k * 28) / 176) - 6
        s.a(f'<path d="M{rx - hw:.0f},{y} L{rx + hw:.0f},{y}" stroke="#4a382a" stroke-width="3" opacity="0.6"/>')
    # the ground
    s.a(f'<path d="M0,{GROUND - 40} C300,{GROUND - 54} 700,{GROUND - 30} 1200,{GROUND - 46} L1200,800 L0,800Z" fill="#2a1a20"/>',
        f'<path d="M0,{GROUND + 10} C400,{GROUND} 800,{GROUND + 16} 1200,{GROUND + 6} L1200,800 L0,800Z" fill="#22151c"/>')

    # the furnace, its bellows, the ore and charcoal heaps
    fx = 330
    top = furnace(s, fx, GROUND + 10, rnd)
    bellows(s, 120, GROUND - 30, (fx - 70, GROUND - 14))
    heap(s, 495, GROUND + 30, 62, ["#8a3a24", "#a8482a", "#6a2a1a", "#b8583a"], rnd, n=46, r=(9, 16))
    heap(s, 625, GROUND + 34, 56, ["#16161c", "#24242c", "#0e0e12", "#2e2e38"], rnd, n=40, r=(9, 15))

    # the anvil, the bloom, the hammer and the sparks; the water bucket
    bx, by = anvil(s, 780, GROUND + 20)
    sparks(s, bx, by - 6, rnd)
    bucket(s, 935, GROUND + 22, rnd)

    # inside the furnace: CO takes oxygen from iron oxide; iron stays
    opening, closing = magnifier(s, "zoomBloomery", 165, 175, 118, RED, src=(fx, top + 150, 24))
    s.a(opening)
    cx, cy = 165, 175
    s.a(f'<rect x="{cx - 118}" y="{cy - 118}" width="236" height="236" fill="#ff7a2a" opacity="0.18"/>')
    # iron oxide below: iron and oxygen in a block
    for j in range(2):
        for i in range(-2, 3):
            x, y = cx - 30 + i * 34 + j * 17, cy + 50 + j * 30
            s.a(ball(x, y, 15, "O" if (i + j) % 2 else "Fe"))
    # iron left behind (on the right), bare
    for (x, y) in ((cx + 70, cy + 70), (cx + 88, cy + 40), (cx + 56, cy + 40)):
        s.a(ball(x, y, 15, "Fe"))
    # a carbon monoxide coming in, a carbon dioxide leaving with the stolen oxygen
    s.a(ball(cx - 60, cy - 30, 13, "O"), ball(cx - 38, cy - 22, 14, "C"))
    s.a(arrow([(cx - 30, cy - 4), (cx - 16, cy + 22)], "#ffe1a0", w=5, head=14, op=0.9))
    s.a(co2(cx + 30, cy - 60, 13, ang=-25))
    s.a(arrow([(cx + 8, cy - 20), (cx + 22, cy - 40)], "#ffe1a0", w=5, head=14, op=0.9))
    s.a(closing)
    finish(s)
    s.save("smith")


if __name__ == "__main__":
    build()
