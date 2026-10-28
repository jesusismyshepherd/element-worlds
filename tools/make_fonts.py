"""The 3D text's fonts (public/fonts, read by troika in src/engine/text.js): Fontsource ships each face
in subsets (latin, latin-ext, ...) and troika takes one file per face, so the latin and latin-ext
subsets are merged into one: every Portuguese, Polish (ą ć ę ł ń ś ź ż) and German (ä ö ü ß) letter.
The latin set alone lacked the Polish ones (2026-10-28, when Polish came).

    py -3.11 tools/make_fonts.py
"""
import os
import shutil
import sys
import time

from fontTools.merge import Merger
from fontTools.ttLib import TTFont

ROOT = os.path.join(os.path.dirname(__file__), '..')
FACES = {
    'outfit-700.woff': ('outfit', 700),
    'outfit-500.woff': ('outfit', 500),
    'nunito-700.woff': ('nunito', 700),
}
NEED = 'ãáàâçéêíóôõúüąćęłńóśźżĄĆĘŁŃÓŚŹŻäöüßÄÖÜ'


def main():
    sys.stdout.reconfigure(encoding='utf-8')
    for out, (family, weight) in FACES.items():
        files = os.path.join(ROOT, 'node_modules', '@fontsource', family, 'files')
        parts = [os.path.join(files, f'{family}-{subset}-{weight}-normal.woff') for subset in ('latin', 'latin-ext')]
        merged = Merger().merge(parts)
        merged.flavor = 'woff'
        path = os.path.join(ROOT, 'public', 'fonts', out)
        tmp = path + '.tmp'
        merged.save(tmp)
        cmap = TTFont(tmp).getBestCmap()
        missing = ''.join(c for c in NEED if ord(c) not in cmap)
        if missing:
            os.remove(tmp)
            sys.exit(f'{out}: still missing {missing}')
        # the dev server may hold the old file open (Windows then refuses a rename): try again, then
        # copy the finished file over it
        for _ in range(5):
            try:
                os.replace(tmp, path)
                break
            except PermissionError:
                time.sleep(0.5)
        else:
            shutil.copyfile(tmp, path)
            os.remove(tmp)
        print(f'{out}: {len(cmap)} characters, {os.path.getsize(path) // 1024} KB')


if __name__ == '__main__':
    main()
