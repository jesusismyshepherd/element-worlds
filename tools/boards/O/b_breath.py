"""Board 'breath': lungs, red blood cells carrying O2 along a vessel to a cell's mitochondrion."""
import math
import random
from kit import *


def mirror_path_points(pts, axis):
    return [(2 * axis - x, y) for x, y in pts]


def tree(x, y, ang, length, width, depth, rnd, out_lines, tips):
    a = math.radians(ang)
    x2, y2 = x + math.cos(a) * length, y + math.sin(a) * length
    out_lines.append((x, y, x2, y2, width))
    if depth == 0:
        tips.append((x2, y2))
        return
    spread = rnd.uniform(22, 32)
    for sgn in (-1, 1):
        tree(x2, y2, ang + sgn * spread + rnd.uniform(-6, 6), length * rnd.uniform(0.68, 0.78),
             width * 0.68, depth - 1, rnd, out_lines, tips)


def lung_points(side):
    # viewer-left lung outline (closed), x grows to the right
    pts = [(228, 148), (196, 162), (164, 200), (138, 258), (120, 330), (110, 410), (110, 470), (122, 512),
           (150, 512), (186, 494), (222, 488), (250, 496), (254, 450), (248, 390), (252, 320), (256, 250),
           (252, 190)]
    if side == "R":
        pts = mirror_path_points(pts, 270)
        pts.reverse()
    return pts


def build():
    s = Svg("#ff7b7b")
    background(s, [(270, 330, 360, 0.55), (965, 320, 360, 0.7), (620, 420, 300, 0.25)], seed=11, stars=55)
    rnd = random.Random(5)

    # ---------- defs
    s.d(rad("lungF", [(0, "#ffb3bf"), (0.45, "#ff7f96"), (0.85, "#e04a6c"), (1, "#b52c52")], cx=0.45, cy=0.4, r=0.65),
        rad("rbc", [(0, "#ff7a7a"), (0.55, "#e2324c"), (1, "#9e0f2e")], cx=0.45, cy=0.4, r=0.6),
        rad("dimple", [(0, "#8c0b27", 0.85), (1, "#c8203c", 0)]),
        lin("vesF", [(0, "#c0304f"), (0.5, "#a3203f"), (1, "#7d1532")], x1=0, y1=0, x2=0, y2=1),
        rad("cellF", [(0, "#ffe3b8"), (0.5, "#ffb48a", 0.95), (0.85, "#ff8a7a", 0.9), (1, "#e2566e", 0.9)],
            cx=0.45, cy=0.42, r=0.6),
        rad("nucF", [(0, "#d7c2ff"), (0.6, "#9b74ff"), (1, "#5a37b8")], cx=0.4, cy=0.35, r=0.7),
        rad("mitoF", [(0, "#ffd27a"), (0.6, "#ffa23c"), (1, "#d46a14")], cx=0.45, cy=0.35, r=0.7),
        rad("spark", [(0, "#ffffff"), (0.25, "#fff4b0"), (0.6, "#ffd23f", 0.7), (1, "#ff9a1f", 0)]),
        lin("trach", [(0, "#ffc7d2"), (0.5, "#ff9fb2"), (1, "#e06a86")], x1=0, y1=0, x2=1, y2=0))

    s.a('<g transform="translate(0,18)">')
    # ---------- air flowing in (with O2) from the upper left, out (with CO2) to the upper right
    inflow = "M76,50 C160,40 232,48 262,112"
    outflow = "M278,112 C320,50 420,40 516,56"
    s.a(f'<path d="{inflow}" fill="none" stroke="#9fd8ff" stroke-width="40" stroke-linecap="round" opacity="0.13"/>',
        f'<path d="{inflow}" fill="none" stroke="#cdeaff" stroke-width="3" stroke-linecap="round" '
        f'stroke-dasharray="3 12" opacity="0.7"/>',
        f'<path d="{outflow}" fill="none" stroke="#c9b8ff" stroke-width="30" stroke-linecap="round" opacity="0.09"/>',
        f'<path d="{outflow}" fill="none" stroke="#ddd3ff" stroke-width="2.5" stroke-linecap="round" '
        f'stroke-dasharray="3 12" opacity="0.45"/>')
    # arrow heads
    s.a('<path d="M246,92 L262,114 L270,88" fill="none" stroke="#cdeaff" stroke-width="4" stroke-linecap="round" '
        'stroke-linejoin="round" opacity="0.8"/>',
        '<path d="M496,44 L518,56 L498,70" fill="none" stroke="#ddd3ff" stroke-width="3.5" stroke-linecap="round" '
        'stroke-linejoin="round" opacity="0.55"/>')
    for (x, y, r, ang) in ((118, 46, 14, -10), (188, 50, 14, 20), (240, 78, 11, 60)):
        s.a(o2(x, y, r, ang))
    # carbon dioxide breathed out: O=C=O, straight
    for (x, y, r) in ((376, 50, 10), (450, 48, 10)):
        s.a(ball(x - r * 1.45, y, r, "O", op=0.8), ball(x + r * 1.45, y, r, "O", op=0.8), ball(x, y, r * 1.08, "C", op=0.85))

    # ---------- vessel (drawn before the lungs and the cell so it emerges from behind them)
    p0, p1, p2, p3 = (360, 430), (520, 600), (640, 210), (860, 330)
    vd = f"M{P([p0])} C{P([p1])} {P([p2])} {P([p3])}"
    s.a(f'<path d="{vd}" fill="none" stroke="#ff7b7b" stroke-width="118" opacity="0.18" filter="url(#s16)"/>',
        f'<path d="{vd}" fill="none" stroke="#5c1230" stroke-width="100" stroke-linecap="round"/>',
        f'<path d="{vd}" fill="none" stroke="#9a1e3e" stroke-width="88" stroke-linecap="round"/>',
        f'<path d="{vd}" fill="none" stroke="#c0405e" stroke-width="56" stroke-linecap="round" opacity="0.55" filter="url(#s8)"/>')
    # wall highlight
    s.a(f'<path d="{vd}" fill="none" stroke="#ff9fb0" stroke-width="4" opacity="0.35" transform="translate(0,-38)"/>')

    # red blood cells along the vessel, each carrying an O2 (the last one has just let it go)
    ts = [0.1, 0.24, 0.38, 0.52, 0.66, 0.8]
    for k, t in enumerate(ts):
        x, y, ang = bez(p0, p1, p2, p3, t)
        x += rnd.uniform(-6, 6)
        y += rnd.uniform(-8, 8)
        rot = ang + rnd.uniform(-25, 25)
        s.a(f'<g transform="translate({f(x)},{f(y)}) rotate({f(rot)})">'
            f'<ellipse rx="34" ry="27" fill="#6b0c24" opacity="0.45" transform="translate(3,5)"/>'
            f'<ellipse rx="34" ry="27" fill="url(#rbc)"/>'
            f'<ellipse rx="16" ry="11" fill="url(#dimple)"/>'
            f'<ellipse rx="30" ry="23" fill="none" stroke="#ff9eaa" stroke-width="2.5" opacity="0.55"/>'
            f'</g>')
        if k < len(ts) - 1:
            s.a(o2(x + 14, y - 28, 12, rnd.uniform(-40, 40), rim="#ffe9ec"))

    # ---------- lungs
    trach_top = 150
    s.a(f'<rect x="252" y="{trach_top - 26}" width="36" height="120" rx="16" fill="url(#trach)" stroke="#b33a5a" stroke-width="3"/>')
    for yy in range(trach_top - 14, trach_top + 86, 14):
        s.a(f'<path d="M256,{yy} Q270,{yy + 6} 284,{yy}" fill="none" stroke="#fff" stroke-width="3" opacity="0.55" stroke-linecap="round"/>')

    for side in ("L", "R"):
        pts = lung_points(side)
        path = smooth(pts)
        cid = f"clip{side}"
        s.d(f'<clipPath id="{cid}"><path d="{path}"/></clipPath>')
        s.a(f'<path d="{path}" fill="#ff7b7b" opacity="0.35" filter="url(#s16)"/>',
            f'<path d="{path}" fill="url(#lungF)" stroke="#a62a4e" stroke-width="4"/>')
        # soft lobe line
        if side == "L":
            s.a(f'<path d="M248,300 C210,330 170,360 120,410" fill="none" stroke="#c43e62" stroke-width="3" opacity="0.5"/>')
        else:
            s.a(f'<path d="M292,330 C330,360 380,380 420,420" fill="none" stroke="#c43e62" stroke-width="3" opacity="0.5"/>')
        # bronchial tree
        lines, tips = [], []
        sg = -1 if side == "L" else 1
        hx, hy = 270 + sg * 40, 262
        for ang, ln, dep in ((-74, 52, 3), (-24, 52, 4), (30, 58, 4), (78, 72, 4)):
            # angles with y down (0 = right, 90 = down); the left lung mirrors them
            base = ang if side == "R" else 180 - ang
            tree(hx, hy, base, ln, 9, dep, rnd, lines, tips)
        g = [f'<g clip-path="url(#{cid})">']
        by_w = {}
        for (x1, y1, x2, y2, w) in lines:
            by_w.setdefault(round(w, 1), []).append(f"M{f(x1)},{f(y1)}L{f(x2)},{f(y2)}")
        for w, segs in by_w.items():
            g.append(f'<path d="{"".join(segs)}" stroke="#b8395c" stroke-width="{f(w + 3)}" stroke-linecap="round"/>')
        for w, segs in by_w.items():
            g.append(f'<path d="{"".join(segs)}" stroke="#ffe6eb" stroke-width="{f(w)}" stroke-linecap="round"/>')
        circ = []
        for (x, y) in tips:
            for (dx, dy) in ((0, 0), (5, 4), (-4, 5)):
                cx_, cy_ = x + dx, y + dy
                circ.append(f"M{f(cx_ - 4.2)},{f(cy_)}a4.2,4.2 0 1,0 8.4,0a4.2,4.2 0 1,0 -8.4,0")
        g.append(f'<path d="{"".join(circ)}" fill="#ffd0da" stroke="#d65578" stroke-width="1.4"/>')
        g.append("</g>")
        s.a("".join(g))
        # main bronchus from the trachea
        s.a(f'<path d="M270,{trach_top + 88} Q{270 + sg * 18},{trach_top + 104} {hx},{hy}" fill="none" '
            f'stroke="#b8395c" stroke-width="22" stroke-linecap="round"/>',
            f'<path d="M270,{trach_top + 88} Q{270 + sg * 18},{trach_top + 104} {hx},{hy}" fill="none" '
            f'stroke="#ffe6eb" stroke-width="15" stroke-linecap="round"/>')
        # glossy highlight on the lung
        hxl = 170 if side == "L" else 370
        s.a(f'<ellipse cx="{hxl}" cy="250" rx="22" ry="58" transform="rotate({20 * sg} {hxl} 250)" '
            f'fill="#fff" opacity="0.22"/>')

    # ---------- body cell with a mitochondrion
    cx, cy, R = 975, 318, 168
    s.a(f'<circle cx="{cx}" cy="{cy}" r="{R + 30}" fill="#ffb07a" opacity="0.35" filter="url(#s30)"/>',
        f'<circle cx="{cx}" cy="{cy}" r="{R}" fill="url(#cellF)"/>',
        f'<circle cx="{cx}" cy="{cy}" r="{R}" fill="none" stroke="#ffe0d0" stroke-width="7"/>',
        f'<circle cx="{cx}" cy="{cy}" r="{R - 9}" fill="none" stroke="#e86a7e" stroke-width="3" opacity="0.7"/>')
    # small organelles
    for (x, y, r) in ((900, 230, 9), (1080, 400, 8), (915, 420, 7), (1040, 205, 6), (1100, 300, 7), (950, 470, 6)):
        s.a(f'<circle cx="{x}" cy="{y}" r="{r}" fill="#ff9e8a" stroke="#e46a6a" stroke-width="2" opacity="0.8"/>')
    # nucleus
    s.a(f'<circle cx="1048" cy="250" r="50" fill="url(#nucF)" stroke="#4b2aa0" stroke-width="3"/>',
        f'<circle cx="1060" cy="258" r="15" fill="#5b3ab8" opacity="0.7"/>',
        f'<ellipse cx="1032" cy="232" rx="14" ry="8" transform="rotate(-30 1032 232)" fill="#fff" opacity="0.45"/>')
    # mitochondrion
    mx, my = 958, 350
    s.a(f'<g transform="translate({mx},{my}) rotate(-14)">'
        f'<ellipse rx="112" ry="58" fill="#ff9a3c" opacity="0.55" filter="url(#s8)"/>'
        f'<ellipse rx="108" ry="56" fill="url(#mitoF)" stroke="#a84a0c" stroke-width="4"/>'
        f'<ellipse rx="92" ry="42" fill="#ffd89a" stroke="#d27020" stroke-width="3"/>')
    folds = []
    for i, x in enumerate(range(-72, 80, 24)):
        if i % 2 == 0:
            folds.append(f'<path d="M{x},-41 L{x},8" stroke="#d27020" stroke-width="9" stroke-linecap="round"/>')
            folds.append(f'<path d="M{x},-40 L{x},8" stroke="#ffbe66" stroke-width="3.5" stroke-linecap="round"/>')
        else:
            folds.append(f'<path d="M{x},41 L{x},-8" stroke="#d27020" stroke-width="9" stroke-linecap="round"/>')
            folds.append(f'<path d="M{x},40 L{x},-8" stroke="#ffbe66" stroke-width="3.5" stroke-linecap="round"/>')
    s.a("".join(folds),
        '<ellipse cx="-50" cy="-36" rx="36" ry="9" fill="#fff" opacity="0.4"/></g>')
    # the warm spark of energy
    sx, sy = 1004, 300
    s.a(f'<circle cx="{sx}" cy="{sy}" r="70" fill="url(#spark)"/>',
        f'<g filter="url(#g2)">' + star_burst(sx, sy, 40, 11, 4, "#fffbe0", 1, rot=0)
        + star_burst(sx, sy, 24, 8, 4, "#fff", 1, rot=45) + '</g>')
    for (x, y, r) in ((1060, 330, 9), (962, 268, 7), (1040, 268, 6), (1010, 360, 6)):
        s.a(sparkle(x, y, r, "#fff3b0", 0.95))
    # freed O2 drifting from the vessel into the cell, towards the mitochondrion
    for (x, y, ang) in ((858, 296, -10), (878, 352, 30)):
        s.a(f'<path d="M{x - 66},{y + 8} L{x - 22},{y + 1}" stroke="#ffd0d6" stroke-width="3" stroke-linecap="round" '
            f'stroke-dasharray="2 9" opacity="0.8"/>')
        s.a(o2(x, y, 12, ang, rim="#ffe9ec"))
    s.a('</g>')

    finish(s)
    return s


if __name__ == "__main__":
    s = build()
    print(s.save("breath"))
