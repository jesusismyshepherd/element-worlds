# Hall pictures (the picture boards of docs/knowledge/hall-boards.md)

One folder per element: a shared style module (`C/lib.py`, `O/kit.py`: the navy background tinted with
the board's colour, shaded atom balls in CPK colours, glows, sparkles, the calm bottom strip for the
caption) and one script per picture, which writes `public/boards/<Symbol>/<id>.svg` (1200 x 800, no
words). Drawn by two agents on 2026-10-29; the scripts give the same files again.

    cd tools/boards/C && py -3.11 twins.py        one picture
    cd tools/boards/C && py -3.11 render.py       PNGs and a contact sheet in %TEMP%\boards_C
    cd tools/boards/O && py -3.11 render.py --sheet

A new element's pictures: copy one style module, keep its look, write a script per board, and look at
each PNG and at the contact sheet before the hall (then `tools/halls_probe.py <Symbol>` and a look in
the game).
