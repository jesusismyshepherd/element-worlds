# Tools: probes and helpers

What each script in `tools/` is for. Probes run with `py -3.11` (Playwright is installed there) against
the dev server (`npm run dev`, port 5310) unless they say otherwise; most take `--base
https://element-worlds.vercel.app` for the live site. In Git Bash prefix them with `MSYS_NO_PATHCONV=1`
(an argument starting with `/` turns into a Windows path). When other agents are editing files, probe a
separate build instead (CLAUDE.md, "Working traps"). Heavy runs go through the pokemon project's lock
(CLAUDE.md, "Rules").

## Looking at it

- `shot.py <path>`: screenshots of any address, with steps, and the console's errors. Run it before
  calling 3D work done.
- `journey.py`: a whole visit through every wing and back.
- `lineup.py`: the Atomlings page. `atomsheet.py`: contact sheets of Atomlings (each alone from several
  angles, or the page's rows) for judging them (`atomlings.md`).
- `phone.py`: the site on the user's real phone over Wi-Fi (a Galaxy S21, Android 15, Chrome; adb,
  installed 2026-10-28 with winget; Chrome's DevTools socket): screenshots, taps, drags and frame times
  on the phone's own chip. Pairing steps in its header; later sessions turn Wireless debugging on and run
  `phone.py connect`. In light mode the phone holds 60 frames a second in the hall and the graphene
  gallery (the other worlds not measured yet).

## Checking a whole area

- `halls_probe.py`: all 118 halls, every panel, all four languages (each hall rebuilt in it) and both
  depths: words gone wrong, errors. Under 2 minutes.
- `hud_probe.py`: the HUD keeps the middle free on six screens, ten scenes (screenshots in
  `tools/shots/hud/`). After any HUD change or any new window a world opens (`hud-layout.md`).
- `card_probe.py`: the plaza card's facts on every element, four languages, a computer and a phone: the
  arrows, a click on the text and T go through them, the arrows stay put.
- `nav_probe.py`: walking and looking (`walking.md`, "Checking it").
- `fullscreen_probe.py`: full screen on a computer and a touch screen (`hud-layout.md`).
- `sound_probe.py`: the sound opens with the first tap, click or key and the music bed plays. A finger's
  pointerdown alone does not give leave to play on a real phone; headless Edge is lenient there.
- `breath_probe.py`: the air wing's breathing, on and held with E, every gas streaming in and out, two
  breaths filmed as a contact sheet.
- `spot_probe.py`: a reload puts the walker back where they stood, and the table's view, pick and trend
  (`walking.md`, "A reload keeps your place").
- `update_probe.py`: a new version while the page stays open offers Reload; needs two builds
  (`deploying.md`).
- `forge_probe.py`: the Atom Forge (`atom-forge.md`).
- `room_probe.py`, `duel_probe.py`, `plaza_room_probe.py`: rooms, the quiz duel, three players on the
  table (`multiplayer.md`).
- `usage_probe.py`, `stats_probe.py` (both want `EW_DASH_PASS`), `account_probe.py`: usage recording, the
  family dashboard, accounts (`usage-data.md`, `accounts.md`).

## Making things

- `make_icons.py`: the home-screen icons. `make_fonts.py`: the 3D fonts' letters (`translating.md`).
- `tools/boards/<Symbol>/`: the drawings for a hall's picture boards (`hall-boards.md`).
- `check_staged.py`: exports the index, tests and builds it, so a commit made while other sessions have
  work in the tree stands alone (CLAUDE.md, "Working traps").

`npm test` (node --test) checks the data, the atom, Lewis places, discovery years, molecules,
collisions, the Atomling grammar, every wing's words and the content.
