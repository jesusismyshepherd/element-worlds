"""Exports the curve of binding energy per nucleon (the Star Forge's "why iron is the end",
docs/knowledge/star-forge.md) to src/data/binding.json: for every mass number A from 1 to 260, the
nucleus of that A with the lightest atom (the one its isobars beta-decay toward: the bottom of the valley
of stability), [A, Z, MeV per nucleon], from the atomic masses in the mendeleev package (AME, via its
isotopes table).

    scripts/data/.venv/Scripts/python.exe scripts/data/export_binding.py

Binding energy B = Z m(1H) + N m(n) - m(atom), in u, times 931.49410242 MeV/u (CODATA 2018); the
hydrogen atom's mass carries the electrons' (their binding, a few keV, is left out).
"""
import json
import math
from pathlib import Path

from mendeleev.fetch import fetch_table

OUT = Path(__file__).resolve().parents[2] / 'src' / 'data' / 'binding.json'
M_H = 1.00782503223  # u, the hydrogen-1 atom (AME2020)
M_N = 1.00866491595  # u, the neutron (CODATA 2018)
MEV_PER_U = 931.49410242


def main():
    iso = fetch_table('isotopes')
    best = {}
    for i in iso.itertuples():
        m = i.mass
        if m is None or (isinstance(m, float) and math.isnan(m)):
            continue
        Z, A = int(i.atomic_number), int(i.mass_number)
        if A < 1 or A > 260:
            continue
        N = A - Z
        per = (Z * M_H + N * M_N - float(m)) * MEV_PER_U / A
        if A not in best or float(m) < best[A][0]:
            best[A] = (float(m), [A, Z, round(per, 4)])
    rows = [best[a][1] for a in sorted(best)]
    # one row a line, so a change reads in a diff
    OUT.write_text('[\n' + ',\n'.join(json.dumps(r) for r in rows) + '\n]\n', encoding='utf-8')
    top = max(rows, key=lambda r: r[2])
    print(f'{len(rows)} mass numbers; the most bound: A={top[0]} Z={top[1]} {top[2]} MeV')


if __name__ == '__main__':
    main()
