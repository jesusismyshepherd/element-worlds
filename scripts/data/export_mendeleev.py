"""Export the numeric and structured fields of the mendeleev package (MIT) for all 118 elements to
mendeleev.json, the second raw source of src/data/elements.json (scripts/build-elements.mjs).
Its descriptive texts (description, uses, sources, name_origin) come from other publishers and are
left out on purpose.

    scripts/data/.venv/Scripts/python.exe scripts/data/export_mendeleev.py

(The venv: python -m venv scripts/data/.venv, then pip install mendeleev; it is git-ignored.)
"""
import json
import math
from pathlib import Path

from mendeleev import element

OUT = Path(__file__).with_name('mendeleev.json')

UNIT_SECONDS = {
    'ysec': 1e-24, 'zsec': 1e-21, 'asec': 1e-18, 'fsec': 1e-15, 'psec': 1e-12, 'nsec': 1e-9,
    'usec': 1e-6, 'msec': 1e-3, 'sec': 1, 'minute': 60, 'hour': 3600, 'day': 86400,
    'year': 3.15576e7, 'kyear': 3.15576e10, 'Myear': 3.15576e13, 'Gyear': 3.15576e16,
    'Tyear': 3.15576e19, 'Pyear': 3.15576e22, 'Eyear': 3.15576e25, 'Zyear': 3.15576e28,
    'Yyear': 3.15576e31,
}


def num(v):
    if v is None:
        return None
    try:
        f = float(v)
    except (TypeError, ValueError):
        return None
    return None if math.isnan(f) else f


def isotopes(el):
    """Natural isotopes (with their abundance, %), all of them, and the longest-lived radioactive ones
    (half-life in seconds and in the published unit): the scientist's isotope table."""
    out = []
    for i in el.isotopes:
        hl = num(i.half_life)
        unit = i.half_life_unit
        secs = hl * UNIT_SECONDS[unit] if hl is not None and unit in UNIT_SECONDS else None
        out.append({
            'A': i.mass_number,
            'abundance': num(i.abundance),
            'halfLife': hl,
            'halfLifeUnit': unit,
            'halfLifeSeconds': secs,
            'radioactive': bool(i.is_radioactive) if i.is_radioactive is not None else secs is not None,
        })
    natural = [i for i in out if i['abundance']]
    natural.sort(key=lambda i: -i['abundance'])
    others = [i for i in out if not i['abundance'] and i['halfLifeSeconds']]
    others.sort(key=lambda i: -i['halfLifeSeconds'])
    # every natural isotope (tin has ten), then the longest-lived radioactive ones
    return natural + others[:max(2, 8 - len(natural))]


def main():
    rows = []
    for z in range(1, 119):
        el = element(z)
        ie = el.ionenergies or {}
        rows.append({
            'z': z,
            'symbol': el.symbol,
            'group': el.group_id,
            'period': el.period,
            'block': el.block,
            'series': el.series,
            'atomicWeight': num(el.atomic_weight),
            'atomicRadius': num(el.atomic_radius),
            'atomicRadiusRahm': num(el.atomic_radius_rahm),
            'covalentRadius': num(el.covalent_radius_pyykko),
            'covalentRadiusDouble': num(el.covalent_radius_pyykko_double),
            'covalentRadiusTriple': num(el.covalent_radius_pyykko_triple),
            'vdwRadius': num(el.vdw_radius),
            'metallicRadius': num(el.metallic_radius),
            'abundanceCrust': num(el.abundance_crust),
            'abundanceSea': num(el.abundance_sea),
            'discoverers': el.discoverers,
            'discoveryLocation': el.discovery_location,
            'discoveryYear': el.discovery_year,
            'radioactive': bool(el.is_radioactive),
            'monoisotopic': bool(el.is_monoisotopic) if el.is_monoisotopic is not None else None,
            'shells': list(el.ec.electrons_per_shell().values()),
            'latticeStructure': el.lattice_structure,
            'latticeConstant': num(el.lattice_constant),
            'specificHeat': num(el.specific_heat_capacity),
            'thermalConductivity': num(el.thermal_conductivity),
            # degrees 1 to 4 (some superheavies list only higher degrees: those stay unknown)
            'ionisationEnergies': [num(ie.get(k)) for k in (1, 2, 3, 4)],
            'enPauling': num(el.en_pauling),
            'pricePerKg': num(el.price_per_kg),
            'goldschmidtClass': el.goldschmidt_class,
            'isotopes': isotopes(el),
        })
    OUT.write_text(json.dumps(rows, ensure_ascii=False, indent=1), encoding='utf-8')
    print(f'{len(rows)} elements -> {OUT}')


if __name__ == '__main__':
    main()
