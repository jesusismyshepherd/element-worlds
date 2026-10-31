<!-- The brief for a hall's boards agent (step 1 of an element's hall; docs/knowledge/hall-boards.md,
"Adding an element's boards"). Fill {NAME} {SYM} {PORT} {EXTRA} (what the element's other worlds already
show, so the pictures do not repeat them) and {SCRATCHPAD} (the session's scratchpad folder), then give it
to an agent with isolation "worktree". -->

You are giving {NAME}'s hall in Element Worlds its picture boards: the first step of turning one of the plain halls into a hall like carbon's, oxygen's, sodium's and silicon's. Element Worlds is a 3D periodic table in three.js for a 10-year-old (Artur) and his father; every element's hall is entered from the plaza (`/e/{SYM}`). Your current directory is a git worktree: a copy of `D:\Family\Artur\element-worlds` at main's latest commit. Work only there.

## The plan you are part of
The user loved carbon's and oxygen's halls ("the others can now follow"), and set a rule (2026-10-30): no picture on a wall without its room: every picture can be stepped into. So each element is done in two steps on its own branch: you write the stories, draw the seven pictures and the showpiece, and design a room for each picture; then other agents build the seven rooms on top of your branch from your designs, and everything goes live together. You do not build the rooms; you design them well enough that a builder can.

## Read first
1. `CLAUDE.md`: the rules (four languages en, pt-PT, pl, de, always; two depths, `kid` Explorer and `sci` Scientist; no em dashes anywhere; science must be right, numbers from `src/data/elements.json`, facts checked, "predicted" where a value is a prediction; look at what you make; never truncate a file before its new content exists).
2. `docs/knowledge/hall-boards.md` (all of it: what a hall with boards has, where things are, adding an element's boards, the traps, the specimen case and showpieces, "The other 116 halls"), `tools/boards/README.md`, `docs/knowledge/translating.md`.
3. The models: sodium's (`src/content/boards/Na.js`, `tools/boards/Na/`, `public/boards/Na/`) and silicon's boards, drawn with the shared kit `tools/boards/lib/`; the showpieces (`showpieces.js`, find it with grep); the hall (`src/worlds/atrium/atrium.js`).
4. `docs/knowledge/picture-rooms.md` (how a picture becomes a room: the scene contract, the stages already built, which you should reuse where they fit, and the Built list of 26 rooms, so your designs do not repeat them) and `docs/knowledge/adding-a-wing.md` "Look and feel" (the user's rule for every station: each step chosen by tapping the thing it is about, sliders for what varies smoothly, the prompt naming the next tap).
5. {NAME}'s own words: `src/content/{SYM}.js` if it exists (else its entry in `src/content/`), its data in `src/data/elements.json`, `src/data/appearance.js` (the specimen case).
{EXTRA}

## Your job
1. **Seven stories**: each a context that makes a child want to walk up (the element in you, in nature, in space, in history, in things you use), a hook question as the title (under about 37 characters where the language allows), two short paragraphs at each depth, all four languages. Check every fact; flag what you are unsure of.
2. **Seven pictures**: one script per board in `tools/boards/{SYM}/`, drawn with `tools/boards/lib/style.py`, rendered with `py -3.11 tools/boards/lib/render.py {SYM}` to `public/boards/{SYM}/<id>.svg` (1200 x 800, no words, the bottom 22% calm). Look at every one, and at the contact sheet. Mind the bloom trap (big near-white areas glow on the wall).
3. **The showpiece** in the specimen case, if {NAME} is well known enough (see how sodium's and silicon's were made).
4. **The room designs**: for each picture, a room a builder can make: the place (a stage to reuse or a new one), two or three stations, each with its taps (what you tap, what happens), its sliders, and the facts to check; what it must not repeat (other rooms, the wings). Make the seven rooms different places. Write them to `{SCRATCHPAD}\{SYM}_rooms.md`, one section per board id, starting with the board's title and the picture's file.
5. `npm test` passes (`boards.test.js`); `py -3.11 tools/halls_probe.py {SYM}` passes; look at the hall at `/e/{SYM}` (computer and `--phone`, two languages): each board, a story panel, the showpiece. Setup: `npm install` in your worktree (never junction or link to the main repository's node_modules); your own dev server in the background, `npx vite --port {PORT} --strictPort`; `MSYS_NO_PATHCONV=1 python tools/shot.py /e/{SYM} --port {PORT} ...` (read the top of `tools/shot.py`; steps split at every `;`); wrap every browser probe in the machine's lock: `python "D:/Family/Artur/pokemon images/blender/arena/tools/heavy.py" b{SYM} -- <the command>`. Note: a board with a room says "Step in"; yours have no rooms yet, so they say "Explore" until the rooms land.
6. Docs: `docs/knowledge/hall-boards.md` "The other 116 halls": a "Done" line for {NAME} like sodium's (the seven pictures, the showpiece). Nothing else outside your files.

## Files
`src/content/boards/{SYM}.js`, `tools/boards/{SYM}/`, `public/boards/{SYM}/`, the showpiece's code and its words, `docs/knowledge/hall-boards.md`. Do not touch `src/worlds/pictures/`. Commit on your branch with `git add` of your paths only, the message ending with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Do not push, do not touch main. Leave no wait loop or background shell behind; stop your dev server at the end (find the node.exe process whose command line has `vite` and `--port {PORT}` with `Get-CimInstance Win32_Process`; never match a bare port number).

## Report back
The branch and commit; the seven boards (id, title, what the picture shows); the showpiece; the facts with doubtful ones flagged; the room designs file's path and a one-line summary per room; your best screenshots' paths (git-ignored, they go with the worktree); anything a shared file should gain.
