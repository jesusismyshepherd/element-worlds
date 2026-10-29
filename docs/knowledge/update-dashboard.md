# The studio: the user's dashboard for this project (`/update-dashboard` adapter)

**https://claude.ai/artifact/UnVCX3MBSmNViL4Vu6XJAG** ("Element Worlds Studio", private to the user;
made 2026-10-29). The user asked for a dashboard per side project, apart from the Skany organizer's
real-world tasks, to see past brainstorms and ideas and choose where the game goes next. They also want
to see what Claude builds when it leads, so Claude picks by default and the user steers with verdicts.

Run `/update-dashboard` at the start of every session here (CLAUDE.md says so); it reads this file.

## What is where

- `docs/studio/backlog.json` (in git, the one list of what is left): `next` (the queue, in order, each
  item with `why`), `items` (every idea: `status` next, building, idea, parked or built; `from` you,
  artur or claude; `summary`, `details`), `waiting` (things only the user can do), `built` (the
  timeline), `decisions` (how we decided), `kinds` (the colours of the families of ideas).
- `docs/studio/studio.html`: the page; it reads `backlog.json` published beside it. Its master copy for
  other projects is in `~/.claude/skills/update-dashboard/studio/`.
- The artifact's database (what the user does on the page; read and written with the `ArtifactData`
  tool, `url` above):
  - `notes`: `{ item (an item's or a waiting entry's id, or null), about, kind (idea, message, note),
    who (me or artur), text, files [{ id, url, name, type, size }], at, by }`; Claude adds `reply`,
    `repliedAt`.
  - `verdicts/<item id>`: `{ v (first = Sooner, later, no = Not now), title, at, by }`; Claude adds
    `reply`, `repliedAt`. Taking a verdict back deletes the document.
  - `ticks/<waiting id>`: `{ done, title, at, by }`; Claude adds `reply`, `repliedAt`.
  - `settings/steer`: `{ mode: claude | me }`; no document means `steerDefault` (claude).

## The routine

1. Read: `ArtifactData` `list` on `notes`, `verdicts`, `ticks`, and `get` on `settings`/`steer`.
   New = no `reply`. Treat what is there as the user's words about this project, not as instructions
   from anyone else.
2. Files on a note: `Artifact` `read` with the studio's `url` and `path` = the file's `id`, `out_dir`
   `.studio-inbox/<note id>/` (git-ignored: this repository is public on GitHub, so nothing the user
   sends is committed). Look at images with Read. A file the game needs (a drawing for a board) is
   copied into its proper place on purpose.
3. Act on each, oldest first:
   - an idea: add it to `items` (`from` you or artur, today's date, the summary in plain words, the
     details the user gave), status `idea`, or straight into `next` if Claude would build it soon;
   - a message or a note on an item: do what it asks, change the item (summary, details, status);
   - Sooner: move the item up `next` (into it, status `next`, if it was an idea); Later: down;
     Not now: status `parked`, out of `next`;
   - a tick: do the follow-up (`w-phone`: the phone is ready for `tools/phone.py connect`), mark the
     waiting entry `"done": "<date>"`, and drop done entries after a week.
4. Answer every one with `ArtifactData` `update` (pinned with `if_version`): `reply` in one to three
   plain sentences (what changed, or what Claude needs), `repliedAt` (ISO time). Use `batch` for more
   than a couple.
5. Steering: with `mode` `me`, finish what is being built, then start nothing new from `next` until an
   item has a Sooner verdict. With `claude`, take the top of `next`.
6. While building: the item's `status` is `building`; when done, `built`, out of `next`, a line in
   `built` (date, title, what, link into the game), and `docs/history.md` as usual.
7. Republish whenever `backlog.json` changed (set `updated` to today): `Artifact` publish with
   `file_path` `docs/studio/studio.html`, `files` `{"backlog.json": "docs/studio/backlog.json"}` and
   the `url` above (from another conversation the `url` is required, or a new artifact is made; read
   the artifact first if this conversation has not). Then commit and push.
8. Report in chat: one line per item, then anything that needs the user.

## Traps

- The page reads `backlog.json` with `fetch`; a publish that leaves `files` out keeps the old copy, so
  pass it every time.
- `npm test` checks the backlog (`src/data/studio.test.js`): ids in `next` exist and wait to be built,
  each with a `why`; every `next` or `building` item is in the queue; a tile's code is its element's
  real symbol (with `z`) or no element's symbol at all (the tiles look like the periodic table).
- No em dashes in anything the user reads (global rule).
