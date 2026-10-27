"""Exports every known nuclide (3557: each element's isotopes, stable or not) from the mendeleev
package (MIT; its isotope data comes from NUBASE) to scripts/data/nuclides.json, for the Atom Forge's
chart of nuclides. scripts/build-nuclides.mjs turns it into src/data/nuclides.json with the fixes.

    scripts/data/.venv/Scripts/python.exe scripts/data/export_nuclides.py
"""
import json
import math
from pathlib import Path

from mendeleev.fetch import fetch_table

from export_mendeleev import UNIT_SECONDS

OUT = Path(__file__).with_name('nuclides.json')


def num(v):
    if v is None:
        return None
    try:
        f = float(v)
    except (TypeError, ValueError):
        return None
    return None if math.isnan(f) else f


def main():
    iso = fetch_table('isotopes')
    modes = fetch_table('isotopedecaymodes')
    by_isotope = {}
    for m in modes.itertuples():
        by_isotope.setdefault(m.isotope_id, []).append({
            'mode': m.mode,
            'intensity': num(m.intensity),
            'relation': (m.relation or '').strip() or None,
        })
    rows = []
    for i in iso.sort_values(['atomic_number', 'mass_number']).itertuples():
        hl = num(i.half_life)
        unit = i.half_life_unit if isinstance(i.half_life_unit, str) else None
        ms = by_isotope.get(i.id, [])
        # the strongest mode first (unknown intensities after the measured ones)
        ms.sort(key=lambda m: -(m['intensity'] if m['intensity'] is not None else -1))
        rows.append({
            'z': int(i.atomic_number),
            'A': int(i.mass_number),
            'abundance': num(i.abundance),
            'halfLife': hl,
            'halfLifeUnit': unit,
            'halfLifeSeconds': hl * UNIT_SECONDS[unit] if hl is not None and unit in UNIT_SECONDS else None,
            'modes': ms,
        })
    text = json.dumps(rows, ensure_ascii=False)
    tmp = OUT.with_name(OUT.name + '.tmp')
    tmp.write_text(text, encoding='utf-8')
    tmp.replace(OUT)
    print(f'{len(rows)} nuclides -> {OUT} ({len(text) // 1024} KB)')


if __name__ == '__main__':
    main()
