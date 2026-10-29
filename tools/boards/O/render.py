"""Render Oxygen board SVGs to PNG (and a contact sheet) for review.

py -3.11 render.py [ids...]   (no ids: all seven + contact sheet)
"""
import os
import sys
from playwright.sync_api import sync_playwright

SRC = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "..", "public", "boards", "O")
OUT = os.path.join(os.environ["TEMP"], "boards_O")
IDS = ["breath", "fire", "ozone", "first", "water", "aurora", "magnet"]
CAPTION = """<div style="position:absolute;left:0;right:0;bottom:0;height:22%;background:rgba(8,12,30,.78);
color:#fff;font:600 44px system-ui;display:flex;align-items:center;justify-content:center">Caption question?</div>"""


def main():
    ids = [a for a in sys.argv[1:] if not a.startswith("-")] or IDS
    sheet = "--sheet" in sys.argv or len(sys.argv) == 1
    cap = "--cap" in sys.argv
    os.makedirs(OUT, exist_ok=True)
    with sync_playwright() as p:
        b = p.chromium.launch(channel="msedge", headless=True)
        pg = b.new_page(viewport={"width": 1200, "height": 800})
        for i in ids:
            url = "file:///" + os.path.join(SRC, i + ".svg").replace("\\", "/")
            if cap:
                hp = os.path.join(OUT, "_cap.html")
                with open(hp, "w", encoding="utf-8") as fh:
                    fh.write(f'<html><body style="margin:0"><div style="position:relative;width:1200px;height:800px">'
                             f'<img src="{url}" style="width:1200px;height:800px;display:block">{CAPTION}</div></body></html>')
                pg.goto("file:///" + hp.replace("\\", "/"))
                pg.wait_for_timeout(300)
                pg.screenshot(path=os.path.join(OUT, i + "_cap.png"))
            else:
                pg.goto(url)
                pg.wait_for_timeout(200)
                pg.screenshot(path=os.path.join(OUT, i + ".png"))
            print("rendered", i)
        if sheet:
            cells = "".join(
                f'<div style="position:relative"><img src="file:///{os.path.join(SRC, i + ".svg").replace(chr(92), "/")}" '
                f'style="width:600px;height:400px;display:block;border-radius:10px;box-shadow:0 0 0 3px #333">'
                f'<div style="position:absolute;left:0;right:0;bottom:0;height:22%;background:rgba(8,12,30,.72);'
                f'border-radius:0 0 10px 10px"></div></div>'
                for i in IDS)
            html = (f'<html><body style="margin:0;background:#05070f;padding:20px">'
                    f'<div style="display:grid;grid-template-columns:repeat(3,600px);gap:20px">{cells}</div></body></html>')
            pg.set_viewport_size({"width": 1880, "height": 1300})
            hp = os.path.join(OUT, "contact_sheet.html")
            with open(hp, "w", encoding="utf-8") as fh:
                fh.write(html)
            pg.goto("file:///" + hp.replace("\\", "/"))
            pg.wait_for_timeout(800)
            pg.screenshot(path=os.path.join(OUT, "contact_sheet.png"), full_page=True)
            print("sheet", os.path.join(OUT, "contact_sheet.png"))
        b.close()


if __name__ == "__main__":
    main()
