"""Render an element's board pictures to PNG, and a contact sheet with each board's English title on the
caption band, to look at before the hall (Playwright + Edge; run with py -3.11).

    py -3.11 tools/boards/lib/render.py Na                 every picture and the sheet
    py -3.11 tools/boards/lib/render.py Na nerves salt     these pictures only
    py -3.11 tools/boards/lib/render.py Na --small         also each at 420 x 280, as from across the hall

The boards (ids, colours, titles) come from src/content/boards/<Symbol>.js (node reads it); a doorway
board has no picture and is skipped. Output: %TEMP%/boards_<Symbol>/.
"""
import json
import os
import pathlib
import subprocess
import sys

from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parents[3]


def boards(symbol):
    js = (f"import('./src/content/boards/{symbol}.js').then(m => console.log(JSON.stringify("
          "m.default.filter(b => !b.doors).map(b => ({ id: b.id, color: b.color, title: b.title.en })))))")
    out = subprocess.run(["node", "-e", js], cwd=ROOT, capture_output=True, text=True, check=True).stdout
    return json.loads(out)


def main():
    args = sys.argv[1:]
    if not args:
        sys.exit(__doc__)
    symbol, rest = args[0], args[1:]
    small = "--small" in rest
    wanted = [a for a in rest if not a.startswith("--")]
    all_boards = boards(symbol)
    todo = [b for b in all_boards if not wanted or b["id"] in wanted]
    src = ROOT / "public" / "boards" / symbol
    out = pathlib.Path(os.environ.get("TEMP", "/tmp")) / f"boards_{symbol}"
    out.mkdir(exist_ok=True)
    with sync_playwright() as p:
        b = p.chromium.launch(channel="msedge", headless=True)
        pg = b.new_page(viewport={"width": 1200, "height": 800})
        for bd in todo:
            svg = src / f"{bd['id']}.svg"
            pg.goto(svg.as_uri())
            pg.wait_for_timeout(250)
            pg.screenshot(path=str(out / f"{bd['id']}.png"))
            print(out / f"{bd['id']}.png")
            if small:
                # a page set from a string cannot load file:// pictures: write it to a file next to them
                hp = out / "_small.html"
                hp.write_text(f'<body style="margin:0;background:#000"><img src="{svg.as_uri()}" width="420" height="280"></body>',
                              encoding="utf-8")
                sp = b.new_page(viewport={"width": 420, "height": 280})
                sp.goto(hp.as_uri())
                sp.wait_for_timeout(300)
                sp.screenshot(path=str(out / f"{bd['id']}_small.png"))
                sp.close()
        if not wanted:
            cells = "".join(
                f'<div class="c" style="box-shadow:0 0 0 4px {bd["color"]},0 0 26px {bd["color"]}88">'
                f'<img src="{(src / (bd["id"] + ".svg")).as_uri()}"><div class="cap">{bd["title"]}</div></div>'
                for bd in all_boards)
            html = ("<html><head><style>body{margin:0;background:#05070f;font-family:Segoe UI,sans-serif}"
                    ".g{display:grid;grid-template-columns:repeat(3,580px);gap:28px;padding:28px}"
                    ".c{position:relative;border-radius:6px;overflow:hidden;width:580px;height:387px}"
                    ".c img{width:100%;height:100%;display:block}"
                    ".cap{position:absolute;left:0;right:0;bottom:0;height:22%;display:flex;align-items:center;"
                    "justify-content:center;color:#fff;font-size:22px;font-weight:600;background:rgba(11,15,36,.8)}"
                    "</style></head>"
                    f"<body><div class='g'>{cells}</div></body></html>")
            hp = out / "contact_sheet.html"
            hp.write_text(html, encoding="utf-8")
            page = b.new_page(viewport={"width": 1860, "height": 900})
            page.goto(hp.as_uri())
            page.wait_for_timeout(900)
            page.screenshot(path=str(out / "contact_sheet.png"), full_page=True)
            print(out / "contact_sheet.png")
        b.close()


if __name__ == "__main__":
    main()
