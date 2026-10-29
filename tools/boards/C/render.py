"""Render board SVGs to PNG (and a contact sheet) with Playwright + Edge.

py -3.11 render.py twins you ...      -> %TEMP%/boards_C/<id>.png
py -3.11 render.py --sheet            -> %TEMP%/boards_C/contact_sheet.png
py -3.11 render.py --small twins      -> also a 400x267 copy to judge from afar
"""
import os
import sys
import pathlib
from playwright.sync_api import sync_playwright

SRC = pathlib.Path(__file__).resolve().parents[3] / "public" / "boards" / "C"
OUT = pathlib.Path(os.environ["TEMP"]) / "boards_C"
OUT.mkdir(exist_ok=True)
IDS = ["twins", "you", "leaf", "stars", "clock", "football", "sky"]
CAPTIONS = {
    "twins": "A diamond and a pencil: twins?",
    "you": "What are you made of?",
    "leaf": "Plants eat air!",
    "stars": "Made inside a giant star",
    "clock": "A clock inside every bone",
    "football": "A molecule shaped like a football",
    "sky": "The carbon in the sky",
}
COLORS = {"twins": "#7fd4ff", "you": "#ff9fb2", "leaf": "#8be37a", "stars": "#ffb347",
          "clock": "#e8c07a", "football": "#c3a6ff", "sky": "#ff8a5c"}


def main():
    args = sys.argv[1:]
    sheet = "--sheet" in args
    small = "--small" in args
    ids = [a for a in args if not a.startswith("--")]
    with sync_playwright() as p:
        b = p.chromium.launch(channel="msedge", headless=True)
        pg = b.new_page(viewport={"width": 1200, "height": 800})
        for i in ids:
            pg.goto((SRC / f"{i}.svg").as_uri())
            pg.wait_for_timeout(200)
            out = OUT / f"{i}.png"
            pg.screenshot(path=str(out))
            print(out)
            if small:
                pg2 = b.new_page(viewport={"width": 420, "height": 280})
                pg2.set_content(f'<body style="margin:0;background:#000"><img src="{(SRC / f"{i}.svg").as_uri()}" width="420" height="280"></body>')
                pg2.wait_for_timeout(300)
                pg2.screenshot(path=str(OUT / f"{i}_small.png"))
                pg2.close()
        if sheet:
            cells = []
            for i in IDS:
                c = COLORS[i]
                cells.append(
                    f'<div class="c" style="box-shadow:0 0 0 3px {c},0 0 24px {c}88">'
                    f'<img src="{(SRC / f"{i}.svg").as_uri()}">'
                    f'<div class="cap">{CAPTIONS[i]}</div></div>')
            html = ("<html><head><style>body{margin:0;background:#05070f;font-family:Segoe UI,sans-serif}"
                    ".g{display:grid;grid-template-columns:repeat(3,1fr);gap:28px;padding:28px}"
                    ".c{position:relative;border-radius:6px;overflow:hidden;aspect-ratio:3/2}"
                    ".c img{width:100%;height:100%;display:block}"
                    ".cap{position:absolute;left:0;right:0;bottom:0;padding:3% 4%;color:#fff;font-size:22px;"
                    "font-weight:600;background:linear-gradient(transparent,rgba(5,8,20,.7))}</style></head>"
                    f"<body><div class='g'>{''.join(cells)}</div></body></html>")
            page = b.new_page(viewport={"width": 1800, "height": 1000})
            hp = OUT / "contact_sheet.html"
            hp.write_text(html, encoding="utf-8")
            page.goto(hp.as_uri())
            page.wait_for_timeout(800)
            out = OUT / "contact_sheet.png"
            page.screenshot(path=str(out), full_page=True)
            print(out)
        b.close()


if __name__ == "__main__":
    main()
