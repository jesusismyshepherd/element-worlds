"""Board 'clock': radiocarbon dating. An hourglass of glowing atoms on a tree-ring clock face, a mammoth skull."""
import math
from lib import Svg, f, mix, poly, smooth

C = "#e8c07a"
s = Svg(C, seed=53)
s.background(focus=(560, 320), focus_r=700, strength=.36, stars=80, bokeh=5)
rng = s.rng

# ------------------------------------------------------------------ tree-ring clock face behind the hourglass
HX, HY = 330, 322
RD = 246
s.add(f'<circle cx="{HX}" cy="{HY}" r="{RD + 30}" fill="{C}" opacity=".35" filter="url(#blur30)"/>')
s.rad("bark", [(0, "#8a5a2e"), (1, "#5a3518")])
s.add(f'<circle cx="{HX}" cy="{HY}" r="{RD}" fill="url(#bark)"/>')
s.rad("wood", [(0, "#f6deae"), (.7, "#e3b778"), (1, "#c98f4a")])
s.add(f'<circle cx="{HX}" cy="{HY}" r="{RD - 16}" fill="url(#wood)"/>')
rings = []
r = 14
k = 0
while r < RD - 22:
    wob = []
    for i in range(36):
        a = 2 * math.pi * i / 36
        rr = r * (1 + .025 * math.sin(3 * a + k) + .02 * math.cos(5 * a + 2 * k))
        wob.append((HX + 6 + rr * math.cos(a), HY - 4 + rr * math.sin(a)))
    rings.append(f'<path d="{smooth(wob)}"/>')
    r += 13 + 6 * math.sin(k * 1.7)
    k += 1
s.add(f'<g fill="none" stroke="#b07a3e" stroke-width="2.6" opacity=".55">{"".join(rings)}</g>')
# clock ticks on the rim
ticks = []
for i in range(12):
    a = 2 * math.pi * i / 12
    r1, r2 = RD - 34, RD - 22
    w = 7 if i % 3 == 0 else 4
    ticks.append(f'<line x1="{f(HX + r1 * math.cos(a))}" y1="{f(HY + r1 * math.sin(a))}" x2="{f(HX + r2 * math.cos(a))}" '
                 f'y2="{f(HY + r2 * math.sin(a))}" stroke-width="{w}"/>')
s.add(f'<g stroke="#6b4220" stroke-linecap="round" opacity=".85">{"".join(ticks)}</g>')

# ------------------------------------------------------------------ the hourglass
TOP, NECK, BOT = 120, HY, 524
PW = 100   # bulb half width


def half_w(y):
    """half width of the glass at height y."""
    if y <= NECK:
        t = (y - TOP) / (NECK - TOP)
    else:
        t = (BOT - y) / (BOT - NECK)
    t = max(0, min(1, t))
    # wide round bulb, narrow neck
    u = min(1, (1 - t) * 1.12)
    return 9 + (PW - 9) * (math.sin(math.pi * .5 * u) ** .7) * (1 - .12 * (1 - t) ** 8)


left, right = [], []
for i in range(61):
    y = TOP + (BOT - TOP) * i / 60
    w = half_w(y)
    left.append((HX - w, y))
    right.append((HX + w, y))
glass_d = smooth(left + right[::-1])
s.add_def("glassClip", f'<clipPath id="glassClip"><path d="{glass_d}"/></clipPath>')
s.add(f'<path d="{glass_d}" fill="#dff3ff" fill-opacity=".22" stroke="#ffffff" stroke-width="5" stroke-opacity=".85"/>')

# sand atoms
RA = 7.6
SP = RA * 2.05
ball_g = s.ball_grad("gold")
s.ball_grad("C14")
atoms = []


def fill_region(test, y0, y1):
    yy = y1
    row = 0
    while yy > y0:
        xx = HX - PW + (row % 2) * SP / 2
        while xx < HX + PW:
            if test(xx, yy) and abs(xx - HX) < half_w(yy) - RA * .8:
                atoms.append((xx + rng.uniform(-.8, .8), yy + rng.uniform(-.8, .8)))
            xx += SP
        yy -= SP * .87
        row += 1


SURF = 236  # sand level in the upper bulb
fill_region(lambda x, y: y > SURF + 26 * (1 - min(1, abs(x - HX) / 70) ** 2), SURF - 30, NECK - 6)
fill_region(lambda x, y: y > 438 + 1.05 * abs(x - HX), 430, BOT - 6)
# stream through the neck
for i in range(9):
    atoms.append((HX + rng.uniform(-1.5, 1.5), NECK - 6 + i * 13.5))
glow = "".join(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(RA)}"/>' for x, y in atoms)
s.add(f'<g clip-path="url(#glassClip)">'
      f'<g fill="#ffd36b" opacity=".75" filter="url(#blur8)">{glow}</g>'
      f'<g fill="url(#{ball_g})">{glow}</g></g>')
# a few special atoms (carbon-14) among the sand, glowing teal
special = [atoms[i] for i in range(0, len(atoms), 23)]
s.add('<g>' + "".join(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(RA + 1)}" fill="url(#bC14)" filter="url(#glowS)"/>'
                     for x, y in special) + '</g>')
# glass highlights
s.add(f'<path d="M{HX - PW + 22} {TOP + 30}Q{HX - PW + 6} {TOP + 100} {HX - 30} {NECK - 60}" stroke="#fff" stroke-width="9" '
      f'fill="none" stroke-linecap="round" opacity=".45"/>')
s.add(f'<path d="M{HX - PW + 22} {BOT - 30}Q{HX - PW + 8} {BOT - 100} {HX - 34} {NECK + 64}" stroke="#fff" stroke-width="7" '
      f'fill="none" stroke-linecap="round" opacity=".3"/>')
# wooden frame: plates and posts
s.lin("plate", [(0, "#c98f4a"), (.5, "#8a5a2e"), (1, "#5a3518")])
s.lin("post", [(0, "#8a5a2e"), (.45, "#d9a35e"), (1, "#5a3518")], x1=0, y1=0, x2=1, y2=0)
for x in (HX - PW - 22, HX + PW + 22):
    s.add(f'<rect x="{x - 9}" y="{TOP - 6}" width="18" height="{BOT - TOP + 12}" rx="8" fill="url(#post)"/>')
    for yb in (TOP + 40, NECK, BOT - 40):
        s.add(f'<ellipse cx="{x}" cy="{yb}" rx="14" ry="9" fill="url(#post)"/>')
for y in (TOP - 30, BOT):
    s.add(f'<rect x="{HX - PW - 52}" y="{y}" width="{2 * PW + 104}" height="30" rx="12" fill="url(#plate)"/>')
    s.add(f'<rect x="{HX - PW - 44}" y="{y + 4}" width="{2 * PW + 88}" height="6" rx="3" fill="#f0c88a" opacity=".55"/>')

# atoms drifting away and fading (decay)
for i, (x, y, op, rr) in enumerate(((HX + 150, 176, .9, 9), (HX + 196, 132, .6, 8), (HX + 236, 98, .32, 7),
                                     (HX - 160, 212, .8, 8), (HX - 214, 160, .45, 7))):
    s.add(f'<circle cx="{x}" cy="{y}" r="{rr * 2.2}" fill="#5ef0b4" opacity="{op * .35:.2f}" filter="url(#blur4)"/>')
    s.ball(x, y, rr, "C14", opacity=op)
s.sparkle(HX + 272, 72, 12, "#bfffe6", .7)
s.sparkle(HX - 252, 120, 10, "#bfffe6", .6)

# ------------------------------------------------------------------ mammoth skull (side view, facing left)
s.lin("bone", [(0, "#fbf0d6"), (.55, "#e9cf9c"), (1, "#b98f55")], x1=0, y1=0, x2=.3, y2=1)
s.lin("ivory", [(0, "#fffaf0"), (.6, "#f1ddb0"), (1, "#d9b77a")], x1=0, y1=0, x2=1, y2=1)
s.lin("ivoryFar", [(0, "#d8c094"), (1, "#a8864f")], x1=0, y1=0, x2=1, y2=1)


def catmull(ctrl, per=10):
    out = []
    n = len(ctrl)
    for i in range(n - 1):
        p0 = ctrl[max(0, i - 1)]
        p1, p2 = ctrl[i], ctrl[i + 1]
        p3 = ctrl[min(n - 1, i + 2)]
        for k in range(per):
            u = k / per
            out.append(tuple(.5 * ((2 * p1[j]) + (-p0[j] + p2[j]) * u + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * u * u
                                   + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * u ** 3) for j in (0, 1)))
    out.append(ctrl[-1])
    return out


def tusk(ctrl, w0, w1, fill, stroke, dx=0, dy=0):
    cl = [(x + dx, y + dy) for x, y in catmull(ctrl)]
    n = len(cl)
    L_, R_ = [], []
    for i in range(n):
        a = cl[max(0, i - 1)]
        b = cl[min(n - 1, i + 1)]
        tx, ty = b[0] - a[0], b[1] - a[1]
        l = math.hypot(tx, ty) or 1
        nx, ny = -ty / l, tx / l
        t = i / (n - 1)
        w = (w0 + (w1 - w0) * t ** 1.3) / 2
        L_.append((cl[i][0] + nx * w, cl[i][1] + ny * w))
        R_.append((cl[i][0] - nx * w, cl[i][1] - ny * w))
    d = poly(L_ + R_[::-1])
    s.add(f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="3" stroke-linejoin="round"/>')
    return cl


TUSK = [(752, 452), (716, 532), (640, 586), (556, 574), (500, 516), (494, 440), (524, 378), (566, 344)]
sk = [(880, 122), (952, 110), (1022, 136), (1070, 196), (1090, 276), (1078, 350), (1044, 402), (1000, 424),
      (958, 414), (912, 404), (866, 414), (818, 452), (782, 484), (742, 486), (722, 452), (726, 388),
      (744, 312), (770, 236), (806, 172), (838, 138)]
skull_d = smooth(sk)
s.add(f'<path d="{skull_d}" fill="{C}" opacity=".5" filter="url(#blur16)"/>')
# far tusk (behind everything)
tusk(TUSK, 40, 6, "url(#ivoryFar)", "#7a5528", dx=46, dy=-26)
# lower jaw
jaw = [(858, 432), (920, 440), (990, 436), (1022, 452), (1020, 500), (978, 538), (912, 550), (862, 530),
       (840, 494), (842, 456)]
s.add(f'<path d="{smooth(jaw)}" fill="url(#bone)" stroke="#7a5528" stroke-width="3"/>')
# lower molar ridges
s.add('<g stroke="#fff4dc" stroke-width="4" stroke-linecap="round" opacity=".9">' +
      "".join(f'<line x1="{x}" y1="436" x2="{x - 3}" y2="452"/>' for x in range(872, 990, 14)) + '</g>')
s.add('<path d="M866 448Q930 458 990 448" stroke="#7a5528" stroke-width="3" fill="none"/>')
# skull
s.add(f'<path d="{skull_d}" fill="url(#bone)" stroke="#7a5528" stroke-width="3.5"/>')
# shadowed hollow behind the cheek bar (temporal fossa)
s.add('<path d="M968 318C1000 304 1036 314 1046 342C1034 366 1002 372 974 362C962 348 960 330 968 318Z" fill="#6b4a24" opacity=".45"/>')
# cheek bar
s.add('<path d="M900 346C940 350 990 360 1040 372" stroke="#a9814a" stroke-width="8" fill="none" stroke-linecap="round" opacity=".55"/>')
# upper molar block
s.add('<path d="M856 404C890 392 940 394 966 406L960 426C930 420 890 420 862 428Z" fill="#f6e6c2" stroke="#7a5528" stroke-width="2.5"/>')
s.add('<g stroke="#b08a52" stroke-width="2.5" opacity=".8">' +
      "".join(f'<line x1="{x}" y1="400" x2="{x}" y2="424"/>' for x in range(870, 960, 12)) + '</g>')
# eye socket with bony rim
s.add('<ellipse cx="900" cy="276" rx="40" ry="34" fill="#f6e6c2" stroke="#7a5528" stroke-width="3"/>')
s.add('<ellipse cx="904" cy="280" rx="29" ry="24" fill="#3a2410"/>')
s.add('<ellipse cx="910" cy="288" rx="16" ry="12" fill="#1a0f06"/>')
# nasal opening, high on the face
s.add('<path d="M782 214C792 184 828 168 852 180C860 200 840 226 812 238C794 240 780 230 782 214Z" fill="#3a2410" stroke="#7a5528" stroke-width="3"/>')
# tusk sheath: a tube down the face, with a lip
s.add('<path d="M760 300C752 360 746 420 752 470" stroke="#fff6e0" stroke-width="12" fill="none" stroke-linecap="round" opacity=".45"/>')
s.add('<path d="M800 330C806 380 804 430 792 470" stroke="#9c7a44" stroke-width="3" fill="none" opacity=".6"/>')
# cracks and sutures
s.add('<g stroke="#8a6534" stroke-width="2.5" fill="none" opacity=".55" stroke-linecap="round">'
      '<path d="M952 112C960 160 990 210 1040 236"/><path d="M1000 150l-12 24 10 10-6 22"/>'
      '<path d="M1080 300l-22 8 6 16"/></g>')
s.add('<path d="M842 160C880 132 960 122 1020 150" stroke="#fffaf0" stroke-width="10" fill="none" stroke-linecap="round" opacity=".45"/>')
# near tusk
tusk(TUSK, 50, 7, "url(#ivory)", "#7a5528")
s.add('<path d="M744 470C716 530 660 570 598 576" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".6"/>')
s.add('<path d="M724 448Q752 466 784 452" stroke="#7a5528" stroke-width="4" fill="none"/>')

# glowing carbon-14 atoms in the bone, some drifting away
for (x, y, rr) in ((980, 200, 8), (1040, 280, 7), (960, 470, 7), (820, 300, 6), (620, 576, 6), (1010, 400, 6)):
    s.add(f'<circle cx="{x}" cy="{y}" r="{rr * 2.4}" fill="#5ef0b4" opacity=".4" filter="url(#blur4)"/>')
    s.ball(x, y, rr, "C14")
for (x, y, rr, op) in ((1056, 110, 8, .7), (1090, 76, 7, .45), (1116, 52, 6, .22)):
    s.add(f'<circle cx="{x}" cy="{y}" r="{rr * 2.2}" fill="#5ef0b4" opacity="{op * .35:.2f}" filter="url(#blur4)"/>')
    s.ball(x, y, rr, "C14", opacity=op)
s.sparkle(1132, 36, 10, "#bfffe6", .6)

s.calm_bottom(612)
s.save("clock")
