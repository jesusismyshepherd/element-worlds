"""The app icons for a phone's home screen (public/icon-*.png, named in public/manifest.webmanifest and
index.html), drawn from public/favicon.svg on the site's dark blue, with room round it for the round
masks phones cut icons with.

    python tools/make_icons.py
"""
import os

from playwright.sync_api import sync_playwright

ROOT = os.path.join(os.path.dirname(__file__), '..')
PUBLIC = os.path.join(ROOT, 'public')
SIZES = {'icon-192.png': 192, 'icon-512.png': 512, 'apple-touch-icon.png': 180}


def main():
    svg = open(os.path.join(PUBLIC, 'favicon.svg'), encoding='utf-8').read()
    svg = svg.replace('<svg ', '<svg width="100%" height="100%" ', 1)
    with sync_playwright() as p:
        b = p.chromium.launch(channel='msedge', headless=True)
        for name, size in SIZES.items():
            page = b.new_page(viewport={'width': size, 'height': size})
            # the mark fills 80 % (a round mask keeps the middle 80 %)
            page.set_content(
                f'<html><body style="margin:0;background:#0b0f24;display:flex;align-items:center;justify-content:center;'
                f'width:{size}px;height:{size}px">'
                f'<div style="width:{size * 0.8}px;height:{size * 0.8}px">{svg}</div>'
                '</body></html>'
            )
            page.screenshot(path=os.path.join(PUBLIC, name))
            page.close()
            print('wrote', name)
        b.close()


if __name__ == '__main__':
    main()
