"""Board 'water': a glossy drop holding one water molecule (big O, two small H at 104.5 degrees),
ocean waves below and a balance tipping towards the oxygen."""
import math
import random
from kit import *


def drop_path(cx, cy, r, tip_y):
    """Water drop: round bottom (centre cx,cy radius r) and a tip at tip_y."""
    h = cy - tip_y
    return (f"M{f(cx)},{f(tip_y)} C{f(cx + r * 0.2)},{f(tip_y + h * 0.28)} {f(cx + r)},{f(cy - r * 0.75)} {f(cx + r)},{f(cy)} "
            f"A{f(r)},{f(r)} 0 0 1 {f(cx - r)},{f(cy)} "
            f"C{f(cx - r)},{f(cy - r * 0.75)} {f(cx - r * 0.2)},{f(tip_y + h * 0.28)} {f(cx)},{f(tip_y)}Z")


def water_molecule(cx, cy, rO, rH, d, ang_deg=104.5):
    half = math.radians(ang_deg / 2)
    out = []
    for sg in (-1, 1):
        out.append(ball(cx + sg * d * math.sin(half), cy + d * math.cos(half), rH, "H"))
    out.append(ball(cx, cy, rO, "O"))
    return "".join(out)


def build():
    s = Svg("#5ab8ff")
    background(s, [(560, 330, 420, 0.8), (980, 330, 250, 0.35)], seed=31, stars=55)
    rnd = random.Random(8)
    s.d(rad("dropF", [(0, "#d8f0ff", 0.42), (0.55, "#7cc8ff", 0.32), (0.85, "#3b8fe8", 0.5), (1, "#1f5fc0", 0.75)],
            cx=0.42, cy=0.38, r=0.62),
        lin("dropRim", [(0, "#e8f6ff"), (1, "#7cc8ff")], x1=0, y1=0, x2=0, y2=1),
        lin("wave1", [(0, "#3e9cf0"), (1, "#1a4f9e")], x1=0, y1=0, x2=0, y2=1),
        lin("wave2", [(0, "#2a7fd8"), (1, "#123a7a")], x1=0, y1=0, x2=0, y2=1),
        lin("wave3", [(0, "#1d63b8"), (1, "#0d2a5e")], x1=0, y1=0, x2=0, y2=1),
        lin("brass", [(0, "#fff0b8"), (0.45, "#ffcc5a"), (1, "#b07a1c")], x1=0, y1=0, x2=0, y2=1),
        lin("brassV", [(0, "#b07a1c"), (0.5, "#ffe08a"), (1, "#a06a14")], x1=0, y1=0, x2=1, y2=0))

    # ---------- ocean waves (low, mostly under the caption)
    def wave_band(y0, amp, period, phase, fill, foam_op):
        pts = []
        x = -60 + phase
        d = f"M-80,800 L-80,{y0} "
        while x < 1300:
            d += (f"C{f(x + period * 0.25)},{f(y0 - amp)} {f(x + period * 0.45)},{f(y0 - amp * 1.1)} {f(x + period * 0.55)},{f(y0 - amp * 0.6)} "
                  f"C{f(x + period * 0.62)},{f(y0 - amp * 0.2)} {f(x + period * 0.8)},{f(y0 + amp * 0.15)} {f(x + period)},{f(y0)} ")
            pts.append((x + period * 0.45, y0 - amp * 1.05))
            x += period
        d += "L1300,800Z"
        s.a(f'<path d="{d}" fill="{fill}"/>')
        foam = "".join(f"M{f(px - period * 0.18)},{f(py + amp * 0.35)} Q{f(px)},{f(py - 2)} {f(px + period * 0.12)},{f(py + amp * 0.5)}"
                       for px, py in pts)
        s.a(f'<path d="{foam}" fill="none" stroke="#e6f6ff" stroke-width="5" stroke-linecap="round" opacity="{foam_op}"/>')

    s.a('<ellipse cx="600" cy="640" rx="700" ry="90" fill="#5ab8ff" opacity="0.18" filter="url(#s30)"/>')
    wave_band(600, 26, 190, -30, "url(#wave1)", 0.55)
    wave_band(640, 30, 230, 60, "url(#wave2)", 0.5)
    wave_band(690, 34, 260, -10, "url(#wave3)", 0.4)

    # ---------- the big drop with the molecule
    cx, cy, r, tip = 530, 356, 198, 58
    dp = drop_path(cx, cy, r, tip)
    s.d(f'<clipPath id="dropClip"><path d="{dp}"/></clipPath>')
    s.a(f'<path d="{dp}" fill="#5ab8ff" opacity="0.45" filter="url(#s16)"/>',
        f'<path d="{dp}" fill="url(#dropF)"/>')
    # refraction glow along the bottom inside the drop
    s.a(f'<g clip-path="url(#dropClip)">'
        f'<ellipse cx="{cx + 20}" cy="{cy + r - 10}" rx="{r * 0.85}" ry="60" fill="#c8ecff" opacity="0.35" filter="url(#s16)"/>'
        f'<circle cx="{cx}" cy="{cy}" r="{r + 40}" fill="none" stroke="#0d2f6e" stroke-width="40" opacity="0.25" filter="url(#s16)"/>'
        f'</g>')
    # bond-angle arc between the hydrogens
    mx, my = cx, cy + 6
    d_oh = 128
    half = math.radians(104.5 / 2)
    ra = 116
    a1 = (mx - ra * math.sin(half), my + ra * math.cos(half))
    a2 = (mx + ra * math.sin(half), my + ra * math.cos(half))
    s.a(f'<path d="M{P([a1])} A{ra},{ra} 0 0 0 {P([a2])}" fill="none" stroke="#e8f6ff" stroke-width="4" '
        f'stroke-dasharray="2 9" stroke-linecap="round" opacity="0.9"/>')
    s.a(f'<circle cx="{mx}" cy="{my}" r="118" fill="#ff4d4d" opacity="0.18" filter="url(#s16)"/>')
    s.a(water_molecule(mx, my, 94, 49, d_oh))
    # drop rim and gloss on top
    s.a(f'<path d="{dp}" fill="none" stroke="url(#dropRim)" stroke-width="4" opacity="0.85"/>',
        f'<path d="M{cx - 150},{cy - 40} C{cx - 150},{cy - 120} {cx - 90},{cy - 190} {cx - 40},{cy - 240}" fill="none" '
        f'stroke="#fff" stroke-width="16" stroke-linecap="round" opacity="0.5"/>',
        f'<circle cx="{cx - 160}" cy="{cy + 10}" r="9" fill="#fff" opacity="0.55"/>',
        f'<path d="M{cx + 120},{cy + 150} C{cx + 160},{cy + 110} {cx + 180},{cy + 60} {cx + 182},{cy + 20}" fill="none" '
        f'stroke="#e8f6ff" stroke-width="6" stroke-linecap="round" opacity="0.4"/>')

    # ---------- the balance: one O outweighs two H
    px, py = 955, 214
    tilt = 16
    arm = 118
    ta = math.radians(tilt)
    le = (px - arm * math.cos(ta), py + arm * math.sin(ta))
    re = (px + arm * math.cos(ta), py - arm * math.sin(ta))
    hang = 120
    s.a(f'<circle cx="{px}" cy="{py + 150}" r="190" fill="#5ab8ff" opacity="0.12" filter="url(#s30)"/>')
    # stand
    s.a(f'<rect x="{px - 7}" y="{py}" width="14" height="{528 - py}" rx="6" fill="url(#brassV)"/>',
        f'<path d="M{px - 70},{545} Q{px - 64},{522} {px - 26},{518} H{px + 26} Q{px + 64},{522} {px + 70},{545} Z" fill="url(#brass)" '
        f'stroke="#8a5a10" stroke-width="2.5"/>')
    # beam
    s.a(f'<path d="M{P([le])} L{P([re])}" stroke="#8a5a10" stroke-width="15" stroke-linecap="round"/>',
        f'<path d="M{P([le])} L{P([re])}" stroke="url(#brassV)" stroke-width="10" stroke-linecap="round"/>',
        f'<circle cx="{px}" cy="{py}" r="15" fill="url(#brass)" stroke="#8a5a10" stroke-width="2.5"/>',
        f'<path d="M{px - 9},{py - 32} L{px + 9},{py - 32} L{px},{py - 14} Z" fill="url(#brass)" stroke="#8a5a10" stroke-width="2"/>')

    def pan(ex, ey, contents):
        by = ey + hang
        s.a(f'<path d="M{f(ex)},{f(ey)} L{f(ex - 50)},{f(by)} M{f(ex)},{f(ey)} L{f(ex + 50)},{f(by)}" stroke="#ffdf8a" '
            f'stroke-width="2.5" opacity="0.9"/>',
            f'<circle cx="{f(ex)}" cy="{f(ey)}" r="6" fill="url(#brass)" stroke="#8a5a10" stroke-width="2"/>')
        s.a(contents(ex, by))
        s.a(f'<path d="M{f(ex - 58)},{f(by)} Q{f(ex)},{f(by + 42)} {f(ex + 58)},{f(by)} Z" fill="url(#brass)" '
            f'stroke="#8a5a10" stroke-width="2.5"/>',
            f'<ellipse cx="{f(ex)}" cy="{f(by)}" rx="58" ry="7" fill="#ffe9a8" stroke="#8a5a10" stroke-width="2"/>')

    pan(*le, lambda x, y: ball(x, y - 38, 42, "O"))
    pan(*re, lambda x, y: ball(x - 21, y - 19, 20, "H") + ball(x + 21, y - 19, 20, "H"))

    # ---------- small droplets on the left, each with its own tiny molecule
    for (x, y, rr) in ((180, 200, 48), (250, 420, 38), (130, 520, 28)):
        p = drop_path(x, y, rr, y - rr * 1.55)
        s.a(f'<path d="{p}" fill="url(#dropF)" stroke="#bfe6ff" stroke-width="2.5" opacity="0.95"/>')
        s.a(water_molecule(x, y + 2, rr * 0.36, rr * 0.19, rr * 0.48))
        s.a(f'<path d="M{f(x - rr * 0.6)},{f(y - rr * 0.1)} Q{f(x - rr * 0.55)},{f(y - rr * 0.6)} {f(x - rr * 0.2)},{f(y - rr * 0.95)}" '
            f'fill="none" stroke="#fff" stroke-width="{f(rr * 0.12)}" stroke-linecap="round" opacity="0.55"/>')
    for i in range(10):
        x, y = rnd.uniform(90, 1120), rnd.uniform(70, 560)
        if 330 < x < 800 and y > 40:
            continue
        s.a(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(rnd.uniform(4, 9))}" fill="none" stroke="#bfe6ff" stroke-width="2" opacity="0.5"/>')

    finish(s)
    return s


if __name__ == "__main__":
    s = build()
    print(s.save("water"))
