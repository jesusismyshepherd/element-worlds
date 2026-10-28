"""Bands of twisted bilayer graphene near the Fermi level, for the carbon gallery's twisted sheets
(src/worlds/wings/carbon/tbgBands.json): the Bistritzer-MacDonald continuum model (PNAS 108, 12233,
2011), one valley, with the relaxation-corrected couplings (w_AA = 80 meV, w_AB = 110 meV; Koshino et
al., PRX 8, 031087, 2018). For each twist angle: the 8 bands nearest zero along K' - K - Gamma - M - K'
of the moire Brillouin zone, the width of the two middle bands, and how fast electrons move at K
compared with plain graphene. The gallery interpolates between the angles.

    py -3.11 scripts/data/tbg_bands.py      (about a minute)
"""
import base64
import json
import os

import numpy as np

A = 0.246  # graphene's lattice constant, nm
HV = 0.5944  # hbar * v_F, eV nm (v_F about 0.9e6 m/s)
W_AB = 0.110  # eV
W_AA = 0.080  # eV
# moire reciprocal lattice vectors kept, |G| <= shells |b|: more at small angles, where the coupling is
# strong against the Dirac energy across the moire zone
shells_for = lambda deg: min(7.0, max(4.0, 4.4 / deg))
BANDS = 8
POINTS = 72
# fine steps where the bands change fast, coarser at large angles
ANGLES = [round(x, 3) for x in np.arange(0.5, 3.0001, 0.05)] + [round(x, 3) for x in np.arange(3.25, 12.0001, 0.25)]
OUT = os.path.join(os.path.dirname(__file__), '..', '..', 'src', 'worlds', 'wings', 'carbon', 'tbgBands.json')


def path_points():
    """K' - K - Gamma - M - K' in units of k_theta (K at the origin, the two layers' Dirac points at K
    and K'), POINTS spread by length; returns the points, their distance along the path, the ticks."""
    corners = [('K′', (0.0, 1.0)), ('K', (0.0, 0.0)), ('Γ', (np.sqrt(3) / 2, 0.5)), ('M', (0.0, 0.5)), ('K′', (0.0, 1.0))]
    segs = [(np.array(a[1]), np.array(b[1])) for a, b in zip(corners, corners[1:])]
    lengths = [np.linalg.norm(b - a) for a, b in segs]
    total = sum(lengths)
    # each segment gets points by its length and starts on its corner, so the plot passes through
    # K, Gamma and M exactly (where the bands touch or turn)
    pts, dist, acc = [], [], 0.0
    for i, ((a, b), L) in enumerate(zip(segs, lengths)):
        n = max(2, round((POINTS - 1) * L / total))
        last = i == len(segs) - 1
        for u in np.linspace(0, 1, n + 1)[: None if last else -1]:
            pts.append(a + (b - a) * u)
            dist.append(acc + L * u)
        acc += L
    ticks, acc = [], 0.0
    for (name, _), L in zip(corners, lengths + [0]):
        ticks.append({'label': name, 'x': round(acc / total, 4)})
        acc += L
    return np.array(pts), np.array(dist) / total, ticks


def bands_at(theta_deg, kpts):
    th = np.radians(theta_deg)
    kd = 4 * np.pi / (3 * A)  # |K|
    kt = 2 * kd * np.sin(th / 2)  # k_theta
    q1 = kt * np.array([0.0, -1.0])
    q2 = kt * np.array([np.sqrt(3) / 2, 0.5])
    q3 = kt * np.array([-np.sqrt(3) / 2, 0.5])
    b1, b2 = q2 - q1, q3 - q1
    bl = np.linalg.norm(b1)
    shells = shells_for(theta_deg)
    span = int(np.ceil(shells)) + 2
    sites = [(m, n) for m in range(-span, span + 1) for n in range(-span, span + 1)
             if np.linalg.norm(m * b1 + n * b2 + q1 / 2) <= shells * bl]
    index = {s: i for i, s in enumerate(sites)}
    ns = len(sites)
    dim = 4 * ns  # two layers, two sublattices
    phi = 2 * np.pi / 3
    T = [np.array([[W_AA, W_AB * np.exp(-1j * j * phi)], [W_AB * np.exp(1j * j * phi), W_AA]]) for j in range(3)]
    # the interlayer part does not depend on k
    H0 = np.zeros((dim, dim), complex)
    for (m, n), i in index.items():
        for j, (dm, dn) in enumerate([(0, 0), (1, 0), (0, 1)]):
            o = index.get((m + dm, n + dn))
            if o is None:
                continue
            r, c = 2 * i, 2 * ns + 2 * o
            H0[r:r + 2, c:c + 2] = T[j]
            H0[c:c + 2, r:r + 2] = T[j].conj().T
    Q = np.array([m * b1 + n * b2 for m, n in sites])
    out = []
    for k in kpts:
        kk = k * kt
        H = H0.copy()
        for layer, rot, shift in ((0, -th / 2, 0), (1, th / 2, 1)):
            p = kk + Q + (q1 if shift else 0)
            off = HV * (p[:, 0] - 1j * p[:, 1]) * np.exp(1j * rot)
            base = 2 * ns * layer
            idx = base + 2 * np.arange(ns)
            H[idx, idx + 1] = off
            H[idx + 1, idx] = off.conj()
        e = np.linalg.eigvalsh(H)
        mid = dim // 2
        out.append(e[mid - BANDS // 2: mid + BANDS // 2])
    return np.array(out) * 1000, kt  # meV


def main():
    kpts, xs, ticks = path_points()
    data = np.zeros((len(ANGLES), len(kpts), BANDS), np.int16)
    width, speed = [], []
    for a, th in enumerate(ANGLES):
        e, kt = bands_at(th, kpts)
        data[a] = np.round(e * 2)  # half-meV steps
        mid = e[:, BANDS // 2 - 1: BANDS // 2 + 1]
        width.append(round(float(mid.max() - mid.min()), 2))
        # speed at K: half the split of the two middle bands a little way from K toward Gamma, over the
        # distance (the split, not one band, so a small shift of the Dirac point's energy cancels)
        dk = 0.02
        e2, _ = bands_at(th, [np.array([np.sqrt(3) / 2, 0.5]) * dk])
        slope = (e2[0, BANDS // 2] - e2[0, BANDS // 2 - 1]) / 2 / 1000 / (dk * kt)
        speed.append(round(float(abs(slope) / HV), 4))
        print(f'{th:5.2f} deg: middle bands {width[-1]:8.2f} meV wide, electrons at {speed[-1] * 100:5.1f} % of graphene speed')
    best = int(np.argmin(width))
    print('flattest at', ANGLES[best], 'deg')
    payload = {
        'model': 'Bistritzer-MacDonald continuum model, one valley; hbar v = 5.944 eV Å, w_AB = 110 meV, w_AA = 80 meV',
        'angles': ANGLES,
        'x': [round(float(v), 4) for v in xs],
        'ticks': ticks,
        'bands': BANDS,
        'scale': 0.5,
        'energies': base64.b64encode(data.tobytes()).decode(),
        'width': width,
        'speed': speed,
    }
    tmp = OUT + '.tmp'
    with open(tmp, 'w', encoding='utf-8') as f:
        json.dump(payload, f, ensure_ascii=False, separators=(',', ':'))
    os.replace(tmp, OUT)
    print('wrote', os.path.normpath(OUT), os.path.getsize(OUT) // 1024, 'KB')


if __name__ == '__main__':
    main()
