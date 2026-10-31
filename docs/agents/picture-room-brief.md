<!-- The brief for one picture room's builder (step 2 of an element's hall). Fill {NAME} {SYM} {ID}
{BOARDS} (the boards agent's branch) {PORT} {LABEL} {STEPS} {SCRATCHPAD}; write it to a file and give the
agent a short prompt that points to it. -->

You are building one "picture room" in Element Worlds, a 3D periodic table in three.js for a 10-year-old (Artur) and his father. Your current directory is a git worktree: a copy of `D:\Family\Artur\element-worlds` at main's latest commit. Work only there.

## First
{NAME}'s hall has just been given seven picture boards on the branch `{BOARDS}` (not on main yet: a picture goes live only with its room, the user's rule). Bring them in before anything else: `git merge --no-edit {BOARDS}`. Then the board `{ID}` exists in `src/content/boards/{SYM}.js` and its picture in `public/boards/{SYM}/{ID}.svg`.

## What picture rooms are
A picture whose scene file exists is a door: "Step in" dives into the picture and you stand in a small room made from it, with two or three things to do. Twenty-six rooms are built (silicon's, sodium's, carbon's and oxygen's) and are your models.

Read first:
1. `CLAUDE.md`: the rules. Four languages (en, pt-PT, pl, de), two depths (`kid` Explorer, `sci` Scientist), no em dashes anywhere, science must be right, look at what you make, never truncate a file before its new content exists.
2. `docs/knowledge/picture-rooms.md`: the scene contract, `clickable` (`src/worlds/common/taps.js`), every stage so far (reuse one where it fits), the Built list, and every trap met.
3. `docs/knowledge/adding-a-wing.md` ("Look and feel": the user's rule for every station, and "Shared with the room"); `docs/knowledge/walking.md` (a station's `focus`: `size`, and `width` for one wider than tall); `docs/knowledge/translating.md`.
4. The models: `src/worlds/pictures/room.js`, `kit.js`, and the scenes in `scenes/*/`. `C/twins.js`, `O/water.js`, `O/magnet.js` and `Na/davy.js` show the station pattern best: an exhibit with `manual: true` so E opens its panel; each step done by tapping its thing (`clickable`); the prompt naming the next tap; a `parts` helper per tap for probes; `shared` state for rooms.
5. The design for your room: the section `{ID}` of `{SCRATCHPAD}\{SYM}_rooms.md`, written by the agent who drew the picture. Follow it; refine it where something plays or reads better, and check every fact it lists. The board's story is told on the easel inside the room; your room adds the things to do.

## The user's rule for every station
The visitor chooses each step by clicking or tapping the thing the step is about. Anything that varies smoothly is a slider in the station's panel. Pressing E again and again through fixed stages felt passive. The prompt names the next tap. E opens the panel, whose buttons do the same steps.

## Your room: {NAME}'s `{ID}` picture
Words: every text in English, European Portuguese (not Brazilian), Polish and German, each at both depths: `kid` for a curious 10-year-old (plain, warm, short), `sci` for an adult who likes the real terms (numbers with units, names, dates). The same shape in every language (`src/worlds/pictures/pictures.test.js` checks it). The 3D fonts have no subscript or superscript digits and no emoji: write "H2" on 3D signs; real formulas only in the HUD panels. Check every fact; where sources disagree, say only what they share; flag what you are unsure of. Real people: no invented words in their mouths.

## Rules for this job
**Files.** Create only `src/worlds/pictures/scenes/{SYM}/{ID}.js`, `src/worlds/pictures/scenes/{SYM}/{ID}.words.js`, and a new stage file if your design needs one (`src/worlds/pictures/stages/<name>.js`, so later rooms can reuse it). Don't change existing stages or any other file; if a shared file should change, say so in your report with the exact change.
**Setup.** `npm install` in your worktree (never junction or link to the main repository's node_modules). Your own dev server in the background: `npx vite --port {PORT} --strictPort`; pass `--port {PORT}` to every probe. Leave no wait loop or background shell behind when you finish.
**Looking.** `MSYS_NO_PATHCONV=1 python tools/shot.py /e/{SYM}/{ID} --port {PORT} --lang en --steps "..."` (read the top of `tools/shot.py`; steps are split at every `;`, so a `js:` step can hold no semicolon; a `js:` step that assigns a function needs `void (...)`). Useful: `__ew.teleport(x, z, yaw, pitch)`, `__ew.setMode('first')`, `__ew.player.use()` (the station view), `__ew.showPanel(__ew.world.panels.<id>)`, your `parts` helpers; real taps `__ew.world.onTap(__ew.rayAt({ x, y }))`. Wrap every browser probe in the machine's lock: `python "D:/Family/Artur/pokemon images/blender/arena/tools/heavy.py" {LABEL} -- <the command>`. Read every PNG and judge it at a player's size; iterate until it looks good and reads clearly.
**Check:** arrival in third person; each station in first person and through the station view; the Scientist level; `--phone`, including each station view; Portuguese, and Polish or German; stepping in from the hall at `/e/{SYM}` (find `board:{ID}` in `__ew.world.interactables`, teleport in front of it, `__ew.player.use()`), and walking back out through the frame; the middle of the screen stays free.
**Tests and sharing.** `npm test` passes. `MSYS_NO_PATHCONV=1 py -3.11 tools/shared_probe.py --world /e/{SYM}/{ID} --base http://localhost:{PORT} --steps <file>` until it says "all ok"; write the steps as JSON `{"/e/{SYM}/{ID}": ["() => ...", ...]}` to `{SCRATCHPAD}\{STEPS}` (see `tools/shared_steps/pictures.json`).
**When done.** Stop your dev server (find the node.exe process whose command line has `vite` and `--port {PORT}` with `Get-CimInstance Win32_Process`; never match a bare port number). Commit your files on your branch: `git add` those paths only, the message ending with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Do not push, do not touch main.

## Report back
The branch, commit and files; what each station does and looks like; the facts used, doubtful ones flagged; your best screenshots' paths (arrival, each station, phone, hall); the test and probe results; the stage you made, if any; the traps you met; shared-file changes you would make.
