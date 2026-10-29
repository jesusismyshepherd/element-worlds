"""Board 'ozone': Earth from space, a thin glowing ozone shell, UV zig-zags from the Sun stopped by it."""
import math
import random
from kit import *

LAT0, LON0 = 18, 12

AFRICA = [(35.8, -5.9), (37, 10), (32.5, 15), (31.5, 25), (31.2, 32), (22, 36.5), (15, 39.5), (11.5, 43.5),
          (11.8, 51.2), (2, 45.5), (-4, 39.7), (-10.5, 40.5), (-15, 40.7), (-20, 35), (-25.9, 32.9), (-29.8, 31),
          (-34.4, 21), (-34, 18.4), (-29, 16.5), (-22.5, 14.5), (-17, 11.8), (-12, 13.5), (-6, 12.2), (-1, 9),
          (4.3, 9.5), (4.4, 7), (6.4, 3.4), (5, -2), (4.4, -7.5), (7, -12), (10.5, -15), (14.7, -17.5), (21, -17),
          (27, -13), (31, -9.8)]
MADAGASCAR = [(-12, 49.3), (-16, 50.3), (-25.5, 47), (-24, 43.7), (-16, 44.4)]
EURASIA = [(36, -5.6), (37, -9), (43, -9.2), (43.6, -1.8), (46.2, -1.2), (48.6, -4.6), (49.5, 0), (51, 2.5),
           (53.5, 6.5), (54.8, 8.6), (57.5, 8.5), (57.7, 10.5), (55.5, 10.5), (54.5, 11), (54.6, 18), (56.5, 21),
           (59.4, 24), (60.5, 22), (63.5, 21.5), (65.8, 24.5), (65, 21.4), (62.5, 17.6), (59.3, 18.1), (56, 16),
           (55.4, 13), (58, 11.5), (59, 10.5), (58, 7), (59.4, 5.4), (62, 5), (64, 10), (67.5, 14), (70, 19),
           (71, 26), (70, 31), (68, 40), (66.5, 41), (68.5, 44), (68, 55), (69, 60), (73, 70), (73, 80), (76, 100),
           (73, 120), (60, 130), (45, 135), (35, 125), (25, 118), (15, 108), (8, 98.3), (16, 97.5), (22, 91),
           (20, 86), (15, 80.2), (8, 77.5), (19, 72.8), (22.5, 68), (25.3, 61.6), (25.5, 57), (27, 56.3),
           (30, 50), (29.5, 48), (26.5, 50), (24.5, 51.5), (24.4, 54.5), (26, 56.3), (22.5, 59.8), (19, 56),
           (17, 52.5), (15, 50), (13, 45), (12.7, 43.5), (16.5, 42.8), (21.5, 39), (24, 37.5), (28, 34.6),
           (29.5, 35), (31.5, 34.4), (33, 35), (36.5, 36), (36.6, 30.5), (36.8, 28), (39, 26.5), (40.6, 22.9),
           (38, 23.8), (36.5, 22.5), (38.3, 21), (40, 19.6), (42.6, 18), (45.3, 13.6), (44, 12.6), (42, 14.5),
           (40, 18.5), (38, 16), (40, 15.5), (41.2, 13.5), (42.4, 11), (44, 9.5), (43.5, 7), (43.3, 5),
           (43.5, 3.3), (42.4, 3.2), (41, 1), (39.5, -0.3), (37.6, -0.8), (36.7, -2.2), (36.7, -4.4)]
SOUTH_AM = [(12, -72), (10.5, -64), (10, -61.5), (8.5, -60), (6, -57), (4, -52), (1.5, -50), (-1.5, -48),
            (-2.5, -44), (-5, -36), (-8, -35), (-13, -38.5), (-23, -42), (-25, -48), (-33, -52.5), (-38.5, -57.5),
            (-41, -63), (-46, -67.5), (-52, -69), (-55, -67), (-53, -74), (-45, -74), (-37, -73.5), (-30, -71.5),
            (-18.5, -70.3), (-14, -76.3), (-5.5, -81), (-1, -80.5), (1.5, -79), (7, -77.8), (9, -79.5)]
NORTH_AM = [(60, -64), (55, -60), (52, -56), (47.5, -53), (46.5, -60), (44, -66), (41.5, -70), (40.5, -74),
            (35, -76), (31, -81), (25.5, -80.3), (25, -81), (30, -84), (30, -89), (29, -95), (26, -97.5),
            (21, -97), (18.5, -95), (18.5, -91), (21.5, -87), (16, -88), (15.8, -84), (11, -83.7), (9, -79.5),
            (16, -95), (20, -105), (30, -115), (40, -124), (50, -127), (60, -145), (70, -160), (71, -155),
            (70, -130), (68, -110), (68, -95), (64, -88), (60, -94), (56, -88), (55, -82), (51, -79), (55, -77),
            (60, -78), (62.5, -72)]
GREENLAND = [(60, -43), (65, -40), (70, -22), (76, -19), (81, -15), (83, -35), (82, -60), (78, -72), (76, -68),
             (70, -54), (65, -52), (61, -48)]
BRITAIN = [(50.2, -5.5), (51.2, 1.4), (53, 1.7), (55.8, -2), (58.6, -3), (58.5, -5), (56, -6), (54.5, -3.4),
           (53.3, -4.6), (51.6, -5.2)]
BLACK_SEA = [(41, 29), (41.5, 32), (41.6, 36), (41, 40), (43, 41.5), (45.2, 37), (46.6, 31), (44.2, 28.6), (42.5, 27.8)]
CASPIAN = [(37, 50), (36.8, 54), (40, 53), (42.5, 52.7), (46.5, 53), (47, 50), (44, 47.5), (41, 49)]


def ortho(lat, lon, R, cx, cy):
    ph, la = math.radians(lat), math.radians(lon)
    p0, l0 = math.radians(LAT0), math.radians(LON0)
    x = R * math.cos(ph) * math.sin(la - l0)
    y = R * (math.cos(p0) * math.sin(ph) - math.sin(p0) * math.cos(ph) * math.cos(la - l0))
    cosc = math.sin(p0) * math.sin(ph) + math.cos(p0) * math.cos(ph) * math.cos(la - l0)
    if cosc < 0:
        m = math.hypot(x, y) or 1
        x, y = x / m * R * 1.02, y / m * R * 1.02
    return cx + x, cy - y


def zigzag(x0, y0, x1, y1, amp=9, wl=24):
    L = math.hypot(x1 - x0, y1 - y0)
    ux, uy = (x1 - x0) / L, (y1 - y0) / L
    nx, ny = -uy, ux
    pts = [(x0, y0)]
    n = int(L / (wl / 2))
    for i in range(1, n):
        t = i * (wl / 2)
        sg = 1 if i % 2 else -1
        pts.append((x0 + ux * t + nx * amp * sg, y0 + uy * t + ny * amp * sg))
    pts.append((x1, y1))
    return "M" + " L".join(f"{f(x)},{f(y)}" for x, y in pts)


def build():
    s = Svg("#9b8cff")
    background(s, [(440, 350, 420, 0.75), (1060, 140, 260, 0.35)], seed=41, stars=80)
    rnd = random.Random(4)
    E = (430, 352)
    RE, RS = 196, 252
    SUN = (1050, 138)

    s.d(rad("ocean", [(0, "#4fb0ff"), (0.55, "#1f6fd1"), (1, "#0c2f78")], cx=0.62, cy=0.32, r=0.75),
        lin("night", [(0, "#0b0f24", 0), (0.45, "#0b0f24", 0.1), (0.75, "#0b0f24", 0.55), (1, "#0b0f24", 0.9)], x1=0.9, y1=0.05, x2=0.1, y2=0.95),
        rad("sunF", [(0, "#ffffff"), (0.45, "#fff3b0"), (0.8, "#ffd23f"), (1, "#ffa21f")]),
        rad("sunG", [(0, "#fff3b0", 0.7), (0.4, "#ffd23f", 0.25), (1, "#ffa21f", 0)]),
        rad("shell", [(0, "#9b8cff", 0), (0.86, "#9b8cff", 0), (0.93, "#8ec8ff", 0.35), (0.97, "#b3a8ff", 0.55),
                      (1, "#9b8cff", 0)], cx=E[0], cy=E[1], r=RS + 16, user=True),
        rad("zoomF", [(0, "#2a2466"), (1, "#120f33")], cx=0.5, cy=0.4, r=0.6),
        f'<clipPath id="earthClip"><circle cx="{E[0]}" cy="{E[1]}" r="{RE}"/></clipPath>')

    # ---------- the Sun
    sx, sy = SUN
    s.a(f'<circle cx="{sx}" cy="{sy}" r="190" fill="url(#sunG)"/>')
    for i in range(12):
        a = math.radians(i * 30 + 8)
        s.a(f'<path d="M{f(sx + math.cos(a) * 66)},{f(sy + math.sin(a) * 66)} L{f(sx + math.cos(a) * 92)},{f(sy + math.sin(a) * 92)}" '
            f'stroke="#ffe08a" stroke-width="6" stroke-linecap="round" opacity="0.8"/>')
    s.a(f'<circle cx="{sx}" cy="{sy}" r="56" fill="url(#sunF)" filter="url(#g2)"/>')

    # ---------- Earth
    ex, ey = E
    s.a(f'<circle cx="{ex}" cy="{ey}" r="{RE + 14}" fill="#5ab8ff" opacity="0.5" filter="url(#s8)"/>',
        f'<circle cx="{ex}" cy="{ey}" r="{RE}" fill="url(#ocean)"/>')
    land = []
    land_paths = []
    for poly, col in ((AFRICA, "#4cc26a"), (EURASIA, "#5ccf72"), (SOUTH_AM, "#3fb862"), (NORTH_AM, "#4cc26a"),
                      (MADAGASCAR, "#4cc26a"), (BRITAIN, "#5ccf72")):
        pts = [ortho(la, lo, RE, ex, ey) for la, lo in poly]
        land.append(f'<path d="{smooth(pts, k=0.8)}" fill="{col}"/>')
        land_paths.append(smooth(pts, k=0.8))
    s.d(f'<clipPath id="landClip"><path d="{"".join(land_paths)}"/></clipPath>')
    pts = [ortho(la, lo, RE, ex, ey) for la, lo in GREENLAND]
    land.append(f'<path d="{smooth(pts, k=0.8)}" fill="#eaf4ff"/>')
    # deserts tinted sand
    sahara = [(30, -8), (31, 10), (30, 25), (24, 33), (17, 30), (16, 18), (17, 5), (19, -10), (25, -13)]
    arabia = [(29, 38), (27, 47), (22, 55), (18, 52), (17, 45), (22, 40)]
    des = []
    for poly in (sahara, arabia):
        pts = [ortho(la, lo, RE, ex, ey) for la, lo in poly]
        des.append(f'<path d="{smooth(pts)}" fill="#dcc070" opacity="0.8"/>')
    land.append('<g clip-path="url(#landClip)">' + "".join(des) + '</g>')
    for poly in (BLACK_SEA, CASPIAN):
        pts = [ortho(la, lo, RE, ex, ey) for la, lo in poly]
        land.append(f'<path d="{smooth(pts)}" fill="#2a7fd8"/>')
    # ice cap
    pts = [ortho(84, lo, RE, ex, ey) for lo in range(-180, 180, 20)]
    land.append(f'<path d="{smooth(pts)}" fill="#eaf4ff" opacity="0.9"/>')
    # clouds
    clouds = []
    for (la, lo, ln) in ((48, -30, 40), (5, -25, 30), (-40, 0, 45), (-8, 70, 30), (55, 50, 35), (25, -50, 25), (-25, -20, 35)):
        p1 = ortho(la, lo, RE, ex, ey)
        p2 = ortho(la + 6, lo + ln * 0.5, RE, ex, ey)
        p3 = ortho(la, lo + ln, RE, ex, ey)
        clouds.append(f"M{P([p1])} Q{P([p2])} {P([p3])}")
    land.append(f'<path d="{"".join(clouds)}" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity="0.6"/>')
    s.a(f'<g clip-path="url(#earthClip)">' + "".join(land)
        + f'<circle cx="{ex}" cy="{ey}" r="{RE}" fill="url(#night)"/>'
        + f'<circle cx="{ex}" cy="{ey}" r="{RE}" fill="none" stroke="#bfe6ff" stroke-width="10" opacity="0.45" filter="url(#s4)"/>'
        + '</g>')

    # ---------- the ozone shell
    s.a(f'<circle cx="{ex}" cy="{ey}" r="{RS + 16}" fill="url(#shell)"/>',
        f'<circle cx="{ex}" cy="{ey}" r="{RS}" fill="none" stroke="#a99cff" stroke-width="18" opacity="0.4" filter="url(#s8)"/>',
        f'<circle cx="{ex}" cy="{ey}" r="{RS}" fill="none" stroke="#d6d0ff" stroke-width="3" opacity="0.9"/>')
    # small ozone molecules sitting in the shell
    for i in range(16):
        a = math.radians(i * 22.5 + 6)
        x, y = ex + math.cos(a) * RS, ey + math.sin(a) * RS
        s.a(o3(x, y, 6.5, rnd.uniform(0, 360)))

    # ---------- UV rays: violet zig-zags stopped at the shell
    def shell_pt(deg, extra=0):
        a = math.radians(deg)
        return ex + math.cos(a) * (RS + extra), ey + math.sin(a) * (RS + extra)

    rays = [(-64, 196), (-44, 170), (-24, 148), (-4, 126)]
    for k, (deg, sdeg) in enumerate(rays):
        tx, ty = shell_pt(deg, 12)
        x0, y0 = sx + math.cos(math.radians(sdeg)) * 100, sy + math.sin(math.radians(sdeg)) * 100
        a0 = math.atan2(ty - y0, tx - x0)
        zz = zigzag(x0, y0, tx, ty, amp=9, wl=26)
        s.a(f'<path d="{zz}" fill="none" stroke="#b46bff" stroke-width="11" stroke-linejoin="round" opacity="0.45" filter="url(#s4)"/>',
            f'<path d="{zz}" fill="none" stroke="#e2c6ff" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>')
        if k == 1:
            # one ray bounces back to space
            nx, ny = (tx - ex) / (RS + 12), (ty - ey) / (RS + 12)
            dx, dy = math.cos(a0), math.sin(a0)
            dot = dx * nx + dy * ny
            rx, ry = dx - 2 * dot * nx, dy - 2 * dot * ny
            zz2 = zigzag(tx, ty, tx + rx * 95, ty + ry * 95, amp=8, wl=24)
            s.a(f'<path d="{zz2}" fill="none" stroke="#b46bff" stroke-width="9" stroke-linejoin="round" opacity="0.35" filter="url(#s4)"/>',
                f'<path d="{zz2}" fill="none" stroke="#e2c6ff" stroke-width="3.5" stroke-linejoin="round" '
                f'stroke-linecap="round" opacity="0.8"/>')
        s.a(f'<g filter="url(#g1)">' + star_burst(tx, ty, 17, 6, 6, "#f3e8ff", 0.95, rot=k * 13) + '</g>')

    # visible sunlight passes through to the ground
    tgt = ortho(22, 30, RE, ex, ey)
    a0 = math.atan2(tgt[1] - sy, tgt[0] - sx)
    nx, ny = -math.sin(a0), math.cos(a0)
    b0 = (sx + math.cos(a0) * 60, sy + math.sin(a0) * 60)
    wedge = [(b0[0] + nx * 22, b0[1] + ny * 22), (tgt[0] + nx * 5, tgt[1] + ny * 5),
             (tgt[0] - nx * 5, tgt[1] - ny * 5), (b0[0] - nx * 22, b0[1] - ny * 22)]
    s.d(lin("beam", [(0, "#fff3b0", 0.55), (1, "#ffe08a", 0.25)], x1=b0[0], y1=b0[1], x2=tgt[0], y2=tgt[1], user=True))
    s.a(f'<polygon points="{P(wedge)}" fill="url(#beam)" filter="url(#s2)"/>',
        f'<circle cx="{f(tgt[0])}" cy="{f(tgt[1])}" r="16" fill="#fff3b0" opacity="0.55" filter="url(#s4)"/>')

    # ---------- zoom circle: one ozone molecule, big
    zx, zy, zr = 948, 474, 104
    p_on = shell_pt(24)
    s.a(f'<path d="M{P([p_on])} L{f(zx - zr)},{f(zy - 6)}" stroke="#c9c0ff" stroke-width="3" stroke-dasharray="3 9" '
        f'stroke-linecap="round" opacity="0.8"/>',
        f'<circle cx="{f(p_on[0])}" cy="{f(p_on[1])}" r="20" fill="none" stroke="#c9c0ff" stroke-width="3" opacity="0.85"/>',
        f'<circle cx="{zx}" cy="{zy}" r="{zr + 12}" fill="#9b8cff" opacity="0.35" filter="url(#s16)"/>',
        f'<circle cx="{zx}" cy="{zy}" r="{zr}" fill="url(#zoomF)" stroke="#9b8cff" stroke-width="6"/>',
        f'<circle cx="{zx}" cy="{zy}" r="{zr - 10}" fill="none" stroke="#d6d0ff" stroke-width="2" opacity="0.4"/>')
    s.a(o3(zx, zy + 4, 34, 0))

    finish(s)
    return s


if __name__ == "__main__":
    s = build()
    print(s.save("ozone"))
