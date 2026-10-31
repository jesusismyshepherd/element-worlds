# Hall pictures (the picture boards of docs/knowledge/hall-boards.md)

One folder per element, one script per picture, which writes `public/boards/<Symbol>/<id>.svg` (1200 x 800,
no words). The scripts give the same files again.

## The shared kit (every element since sodium, 2026-10-30)

`lib/style.py` keeps the series' look, started from Carbon's `C/lib.py` and Oxygen's `O/kit.py`: the navy
background tinted with the board's colour (`background`), the calm bottom band and vignette (`finish`),
atoms as shaded balls in CPK colours (`ball`; sodium violet, chlorine green, potassium deeper violet,
silicon beige, boron pink, since silicon's boards),
ions with their sign on the ball (`ion`), small molecules (`co2`, `h2o`), glows, sparkles, arrows and a
round close-up window (`magnifier`). Its header shows how a picture script starts.

    py -3.11 tools/boards/Na/nerves.py                one picture
    py -3.11 tools/boards/lib/render.py Na            PNGs and a contact sheet in %TEMP%\boards_Na
    py -3.11 tools/boards/lib/render.py Na lamps --small    also 420 x 280, as from across the hall

`render.py` reads the boards (ids, colours, English titles) from `src/content/boards/<Symbol>.js` and draws
each title on the caption band of the sheet, so you see what the band covers. It renders the SVGs that
exist and does not run the scripts: after changing a picture's script, run the script first (hydrogen's
airship lens, 2026-10-31, looked unchanged until it was).

## Carbon and Oxygen (2026-10-29)

Drawn by two agents with their own modules (`C/lib.py`, `O/kit.py`), left as they are:

    cd tools/boards/C && py -3.11 twins.py        one picture
    cd tools/boards/C && py -3.11 render.py       PNGs and a contact sheet in %TEMP%\boards_C
    cd tools/boards/O && py -3.11 render.py --sheet

A new element's pictures: a folder `tools/boards/<Symbol>/`, a script per board on `lib/style.py`, and a
look at each PNG and at the contact sheet before the hall (then `tools/halls_probe.py <Symbol>` and a look
in the game). The traps met are in `docs/knowledge/hall-boards.md`.
