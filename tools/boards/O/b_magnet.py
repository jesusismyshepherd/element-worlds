"""Board 'magnet': a horseshoe magnet holding a bridge of pale blue liquid oxygen between its poles,
cold vapour curling off; a rocket with a frosty oxygen tank on its pad behind."""
import math
import random
from kit import *


def build():
    s = Svg("#8fd0ff")
    background(s, [(400, 360, 400, 0.75), (960, 300, 330, 0.45)], seed=71, stars=70)
    rnd = random.Random(9)
    s.d(lin("red", [(0, "#ff7a7a"), (0.35, "#ff4d4d"), (0.75, "#d42a35"), (1, "#9e1420")], x1=0, y1=0, x2=1, y2=0),
        lin("redTop", [(0, "#ff9a9a", 0.7), (1, "#ff4d4d", 0)], x1=0, y1=0, x2=0, y2=1),
        lin("silver", [(0, "#ffffff"), (0.35, "#dfe6f0"), (0.7, "#a9b4c4"), (1, "#7d889a")], x1=0, y1=0, x2=1, y2=0),
        lin("lox", [(0, "#e6f6ff"), (0.35, "#b8e2ff"), (1, "#6fb4ff")], x1=0, y1=0, x2=0, y2=1),
        lin("body", [(0, "#c9d3e2"), (0.3, "#ffffff"), (0.7, "#eef3fa"), (1, "#a7b3c6")], x1=0, y1=0, x2=1, y2=0),
        lin("frost", [(0, "#cfe6ff"), (0.3, "#f4fbff"), (0.7, "#e2f2ff"), (1, "#a9c8e8")], x1=0, y1=0, x2=1, y2=0),
        lin("ground", [(0, "#162248"), (1, "#0b0f24")], x1=0, y1=0, x2=0, y2=1),
        lin("beamL", [(0, "#cfeaff", 0), (1, "#cfeaff", 0.22)], x1=0, y1=0, x2=0, y2=1),
        rad("loxGlow", [(0, "#cfeaff", 0.8), (1, "#8fd0ff", 0)]))

    # ---------- rocket on its pad (background, right)
    rx = 945
    s.a(f'<polygon points="{P([(832, 592), (846, 592), (900, 60), (790, 60)])}" fill="url(#beamL)" filter="url(#s4)"/>',
        f'<polygon points="{P([(1122, 592), (1136, 592), (1150, 60), (1030, 60)])}" fill="url(#beamL)" filter="url(#s4)"/>',
        f'<circle cx="839" cy="590" r="7" fill="#e6f6ff" filter="url(#g1)"/>',
        f'<circle cx="1129" cy="590" r="7" fill="#e6f6ff" filter="url(#g1)"/>')
    # tower
    tw = []
    tx0, tx1 = 1032, 1072
    tw.append(f'<path d="M{tx0},560 V118 M{tx1},560 V118" stroke="#3a4a6e" stroke-width="6"/>')
    lat = ""
    for y in range(126, 560, 34):
        lat += f"M{tx0},{y} L{tx1},{y + 34} M{tx1},{y} L{tx0},{y + 34} M{tx0},{y} H{tx1} "
    tw.append(f'<path d="{lat}" stroke="#3a4a6e" stroke-width="3"/>')
    tw.append(f'<path d="M{tx0},204 H{rx + 36} M{tx0},330 H{rx + 36}" stroke="#4a5a82" stroke-width="7"/>')
    tw.append(f'<circle cx="{tx1 - 20}" cy="112" r="5" fill="#ff5a5a" filter="url(#g1)"/>')
    s.a("".join(tw))
    # body
    s.a(f'<rect x="{rx - 36}" y="168" width="72" height="372" fill="url(#body)" stroke="#6b7890" stroke-width="2.5"/>',
        f'<path d="M{rx - 36},168 C{rx - 34},120 {rx - 14},84 {rx},70 C{rx + 14},84 {rx + 34},120 {rx + 36},168Z" fill="url(#body)" '
        f'stroke="#6b7890" stroke-width="2.5"/>',
        f'<path d="M{rx - 34},150 C{rx - 30},140 {rx + 30},140 {rx + 34},150 L{rx + 35},160 L{rx - 35},160Z" fill="#ff4d4d"/>',
        f'<rect x="{rx - 36}" y="226" width="72" height="20" fill="#1c2236"/>')
    # frosty liquid-oxygen tank section
    fy0, fy1 = 268, 430
    s.a(f'<rect x="{rx - 36}" y="{fy0}" width="72" height="{fy1 - fy0}" fill="url(#frost)"/>')
    frost = []
    for i in range(26):
        x = rx - 32 + rnd.uniform(0, 64)
        y = rnd.uniform(fy0 + 4, fy1 - 4)
        frost.append(f"M{f(x)},{f(y)} v{f(rnd.uniform(6, 16))}")
    s.a(f'<path d="{"".join(frost)}" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.9"/>')
    for i in range(10):
        s.a(sparkle(rx - 30 + rnd.uniform(0, 60), rnd.uniform(fy0 + 6, fy1 - 6), rnd.uniform(3, 5), "#ffffff", 0.95))
    s.a(f'<rect x="{rx - 36}" y="{fy0}" width="72" height="{fy1 - fy0}" fill="none" stroke="#9fc4ea" stroke-width="2.5"/>')
    # fins and engines
    s.a(f'<path d="M{rx - 36},470 L{rx - 66},540 L{rx - 36},540Z M{rx + 36},470 L{rx + 66},540 L{rx + 36},540Z" fill="#ff4d4d" '
        f'stroke="#9e1420" stroke-width="2.5"/>',
        f'<path d="M{rx - 26},540 L{rx - 32},562 L{rx - 8},562 L{rx - 12},540Z M{rx + 12},540 L{rx + 8},562 L{rx + 32},562 L{rx + 26},540Z" '
        f'fill="#3a4258"/>')
    # venting vapour
    for (x, y, r, op) in ((rx - 52, 300, 18, 0.55), (rx - 80, 290, 24, 0.4), (rx - 114, 278, 28, 0.28),
                          (rx + 50, 360, 16, 0.5), (rx + 72, 372, 22, 0.32), (rx - 46, 404, 14, 0.5)):
        s.a(f'<circle cx="{x}" cy="{y}" r="{r}" fill="#ffffff" opacity="{op}" filter="url(#s8)"/>')
    # pad and ground
    s.a('<path d="M0,598 C300,586 900,582 1200,594 L1200,800 L0,800Z" fill="url(#ground)"/>',
        f'<rect x="{rx - 110}" y="560" width="250" height="24" rx="4" fill="#2a3656" stroke="#4a5a82" stroke-width="2"/>',
        f'<path d="M{rx - 90},584 V604 M{rx + 120},584 V604" stroke="#2a3656" stroke-width="10"/>')

    # ---------- horseshoe magnet (poles down)
    cx, cy, Ro, Ri = 380, 300, 190, 92
    legb = 470
    mag = (f"M{cx - Ro},{cy} A{Ro},{Ro} 0 0 1 {cx + Ro},{cy} L{cx + Ro},{legb} L{cx + Ri},{legb} L{cx + Ri},{cy} "
           f"A{Ri},{Ri} 0 0 0 {cx - Ri},{cy} L{cx - Ri},{legb} L{cx - Ro},{legb}Z")
    s.a(f'<path d="{mag}" fill="#ff4d4d" opacity="0.35" filter="url(#s16)"/>',
        f'<path d="{mag}" fill="url(#red)" stroke="#7a0e18" stroke-width="5" stroke-linejoin="round"/>',
        f'<path d="M{cx - Ro + 22},{cy + 40} V{cy} A{Ro - 22},{Ro - 22} 0 0 1 {cx + 30},{cy - Ro + 23}" fill="none" stroke="#ffb3b3" '
        f'stroke-width="10" stroke-linecap="round" opacity="0.55"/>')
    # silver pole pieces, turned inward to make a narrow gap
    gapL, gapR = cx - 56, cx + 56
    top = 402
    left_pole = (f"M{cx - Ro},{top} H{cx - Ri} V{top + 22} H{gapL - 8} Q{gapL},{top + 22} {gapL},{top + 30} V{legb + 14} "
                 f"Q{gapL},{legb + 22} {gapL - 8},{legb + 22} H{cx - Ro + 8} Q{cx - Ro},{legb + 22} {cx - Ro},{legb + 14}Z")
    right_pole = (f"M{cx + Ro},{top} H{cx + Ri} V{top + 22} H{gapR + 8} Q{gapR},{top + 22} {gapR},{top + 30} V{legb + 14} "
                  f"Q{gapR},{legb + 22} {gapR + 8},{legb + 22} H{cx + Ro - 8} Q{cx + Ro},{legb + 22} {cx + Ro},{legb + 14}Z")
    s.a(f'<path d="{left_pole}" fill="url(#silver)" stroke="#4a5468" stroke-width="4" stroke-linejoin="round"/>',
        f'<path d="{right_pole}" fill="url(#silver)" stroke="#4a5468" stroke-width="4" stroke-linejoin="round"/>')
    # frost on the cold poles
    for (x, y) in ((gapL - 14, top + 34), (gapL - 30, legb + 8), (gapR + 18, top + 40), (gapR + 34, legb + 6), (cx - Ro + 30, legb + 4)):
        s.a(sparkle(x, y, 7, "#ffffff", 0.9))

    # field lines below the gap (faint, dashed)
    fl = ""
    for k in range(3):
        dy = 30 + k * 26
        fl += f"M{gapL},{legb - 4 - k * 4} C{gapL + 6},{legb + dy} {gapR - 6},{legb + dy} {gapR},{legb - 4 - k * 4} "
    s.a(f'<path d="{fl}" fill="none" stroke="#bfe6ff" stroke-width="2.5" stroke-dasharray="3 8" stroke-linecap="round" opacity="0.6"/>')

    # ---------- the liquid-oxygen bridge
    bt, bb = top + 26, legb + 20
    bridge = (f"M{gapL - 2},{bt} C{gapL + 20},{bt - 8} {gapR - 20},{bt - 8} {gapR + 2},{bt} "
              f"L{gapR + 2},{bb - 8} C{gapR + 2},{bb + 4} {cx + 30},{bb + 8} {cx + 14},{bb + 14} "
              f"C{cx + 24},{bb + 30} {cx + 14},{bb + 44} {cx},{bb + 44} C{cx - 14},{bb + 44} {cx - 24},{bb + 30} {cx - 14},{bb + 14} "
              f"C{cx - 30},{bb + 8} {gapL - 2},{bb + 4} {gapL - 2},{bb - 8}Z")
    s.a(f'<circle cx="{cx}" cy="{(bt + bb) / 2 + 10}" r="135" fill="url(#loxGlow)" opacity="0.9"/>',
        f'<path d="{bridge}" fill="#cfeaff" opacity="0.6" filter="url(#s8)"/>',
        f'<path d="{bridge}" fill="url(#lox)" stroke="#e6f6ff" stroke-width="3"/>',
        f'<path d="M{gapL + 10},{bt + 10} C{gapL + 30},{bt + 4} {gapR - 34},{bt + 4} {gapR - 14},{bt + 10}" fill="none" stroke="#fff" '
        f'stroke-width="5" stroke-linecap="round" opacity="0.7"/>',
        f'<ellipse cx="{gapL + 16}" cy="{bt + 34}" rx="5" ry="12" fill="#fff" opacity="0.6"/>')
    # the oxygen inside it
    s.a(o2(cx - 20, bt + 38, 9.5, 20), o2(cx + 22, bt + 58, 9.5, -30), o2(cx - 2, bb + 22, 7.5, 60))
    # falling drops
    for (x, y, r) in ((cx, bb + 74, 7), (cx + 2, bb + 108, 5.5)):
        s.a(f'<path d="M{x},{y - r * 2.1} C{x + r * 0.4},{y - r * 1.2} {x + r},{y - r * 0.5} {x + r},{y} '
            f'A{r},{r} 0 0 1 {x - r},{y} C{x - r},{y - r * 0.5} {x - r * 0.4},{y - r * 1.2} {x},{y - r * 2.1}Z" fill="url(#lox)" '
            f'stroke="#e6f6ff" stroke-width="1.5"/>')

    # ---------- cold vapour curling off (it sinks and spreads)
    vap = []
    curls = (
        (f"M{gapL - 6},{bb - 4} C{gapL - 60},{bb + 14} {gapL - 110},{bb - 6} {gapL - 140},{bb + 26} "
         f"C{gapL - 160},{bb + 52} {gapL - 120},{bb + 66} {gapL - 104},{bb + 46}", 26, 0.5),
        (f"M{gapR + 6},{bb - 4} C{gapR + 60},{bb + 18} {gapR + 116},{bb} {gapR + 150},{bb + 30} "
         f"C{gapR + 174},{bb + 56} {gapR + 132},{bb + 72} {gapR + 116},{bb + 50}", 26, 0.5),
        (f"M{gapL - 30},{bb + 46} C{gapL - 10},{bb + 84} {gapR + 10},{bb + 84} {gapR + 30},{bb + 52}", 30, 0.32),
        (f"M{cx - 22},{bt - 4} C{cx - 46},{bt - 40} {cx + 8},{bt - 56} {cx - 6},{bt - 90}", 16, 0.32))
    for (d, w, op) in curls:
        vap.append(f'<path d="{d}" fill="none" stroke="#ffffff" stroke-width="{w}" stroke-linecap="round" opacity="{op}" filter="url(#s8)"/>')
        vap.append(f'<path d="{d}" fill="none" stroke="#ffffff" stroke-width="{w * 0.4}" stroke-linecap="round" opacity="{op * 0.8:.2f}" filter="url(#s2)"/>')
    s.a("".join(vap))
    for (x, y, r, op) in ((cx - 150, bb + 64, 34, 0.2), (cx + 160, bb + 70, 36, 0.2), (cx, bb + 92, 46, 0.18),
                          (cx - 70, bb + 40, 22, 0.3), (cx + 74, bb + 44, 22, 0.3)):
        s.a(f'<circle cx="{x}" cy="{y}" r="{r}" fill="#ffffff" opacity="{op}" filter="url(#s8)"/>')

    for (x, y, r) in ((150, 140, 7), (640, 120, 6), (680, 430, 7), (110, 430, 6)):
        s.a(sparkle(x, y, r, "#dff2ff", 0.8))

    finish(s)
    return s


if __name__ == "__main__":
    s = build()
    print(s.save("magnet"))
