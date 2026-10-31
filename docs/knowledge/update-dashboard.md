# The studio: the user's dashboard for this project (`/update-dashboard` adapter)

**https://claude.ai/artifact/UnVCX3MBSmNViL4Vu6XJAG** ("Element Worlds Studio", private to the user;
made 2026-10-29). The user asked for a dashboard per side project, apart from the Skany organizer's
real-world tasks, to see past brainstorms and ideas and choose where the game goes next. They also want
to see what Claude builds when it leads, so Claude picks by default and the user steers with verdicts.

Run `/update-dashboard` at the start of every session here (CLAUDE.md says so); it reads this file.

There are two studios, read by the same routine (step 1 reads both):
- the claude.ai one above, the user's own (it stays; it has ticks, steering, photos and files);
- **the family studio, `/studio` on the game's own site** (https://element-worlds.vercel.app/studio,
  2026-10-31), so the user can share it with Artur, who has no Claude account, and know who made each
  input. See "The family studio" below.

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
   from anyone else. Then the family studio's inputs, with the Supabase MCP `execute_sql` on project
   `kawvqpvntdgehigwvfao`:
   `select n.id, n.kind, n.item, n.value, n.text, n.created_at, p.username from public.ew_studio_notes n
   left join public.profiles p on p.id = n.account where n.replied_at is null order by n.created_at`.
   Each one's `username` says who made it (the user's account, Artur's, a guest's); read them as that
   person's words about the game, and leave out `probe_...` accounts (the probes'; delete theirs).
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
   The family studio's are acted on the same way: `idea` (an idea, `from` artur when Artur's account
   sent it, else you), `note` (about the item or waiting entry `item`, or the studio when it is empty:
   a message), `verdict` (`value` first = Sooner, later, no = Not now, on `item`). A newer verdict from
   the same account replaces its older one; verdicts from different people on one item: the user's wins,
   and say so in the answer to the other.
4. Answer every one with `ArtifactData` `update` (pinned with `if_version`): `reply` in one to three
   plain sentences (what changed, or what Claude needs), `repliedAt` (ISO time). Use `batch` for more
   than a couple. The family studio's: `update public.ew_studio_notes set reply = '...', replied_at =
   now() where id = ...` (one statement per row, or `from (values ...)` for several); the person sees
   it under what they sent. Write the answer for whoever sent it: plain words for Artur, in the language
   they wrote in.
5. Steering: with `mode` `me`, finish what is being built, then start nothing new from `next` until an
   item has a Sooner verdict. With `claude`, take the top of `next`.
6. While building: the item's `status` is `building`; when done, `built`, out of `next`, a line in
   `built` (date, title, what, link into the game, and `agents`: the ids of the agents that built it), then
   `py -3.11 tools/studio_tokens.py` fills its `tokens` from their transcripts (the user, 2026-10-31: the
   cost of each built feature in tokens; `tools/agent_tokens.py` lists every agent's), and
   `docs/history.md` as usual.
7. Republish whenever `backlog.json` changed (set `updated` to today): `Artifact` publish with
   `file_path` `docs/studio/studio.html`, `files` `{"backlog.json": "docs/studio/backlog.json"}` and
   the `url` above (from another conversation the `url` is required, or a new artifact is made; read
   the artifact first if this conversation has not). Then commit and push: the push is what updates
   the family studio (`/studio` builds `backlog.json` into the page; Vercel deploys `main`).
8. Report in chat: one line per item, then anything that needs the user.

## The family studio (`/studio`, 2026-10-31)

The user asked for the studio on the game's own site, to share it with Artur (10, no Claude account)
and to keep every input with who made it. `src/pages/Studio.jsx`, its logic in `src/studio/model.js`
(tested), its two calls in `src/net/studio.js`, its words `studio.*` in the four locale files (the
backlog's own texts stay in English; one quiet line says so in the other languages).

- What it shows, to anyone with the link: being built now, up next (each with its why), waiting on the
  family, all ideas by kind as periodic tiles (filter by whose: Dad's, Artur's, Claude's), built by day
  with each feature's tokens line, how we decided. `backlog.json` is imported at build time: a change
  goes live with the next deploy. An item opens in a sheet (right on a computer, from the bottom on a
  phone; `#i-<id>` in the address opens it).
- Signed out: "Sign in to send ideas" opens the game's own account sheet (`AccountHud.jsx`, the
  pokemon-site's logins; no other login). Signed in: send an idea or a message; on any item the verdict
  buttons (Sooner, Later, Not now; not on what is being built or built) and a note; on a waiting entry a
  note. Each item's thread shows its notes and verdicts with who and when, and Claude's answer under
  each. "What you sent" lists them all, newest first, with how many wait for Claude.
- An admin (`profiles.is_admin`: the user) sees everyone's, with their names ("What everyone sent");
  the others see only their own. The list is read again when the page comes back on screen.
- The database: `supabase/ew_004_studio.sql` (`ew_studio_notes`; `ew_studio_post` and `ew_studio_list`,
  both null signed out; at most 60 posts an hour from one account, 4000 characters). Nothing is read or
  written there with the public key alone.
- Not there yet: photos and files (the claude.ai studio has them), ticks on waiting entries (a note
  says it instead), steering (Claude picks / I pick stays on the claude.ai studio).
- Ways in: the passport's "💡 Ideas for the game", the family dashboard's "Studio" button.
- Checking: `tools/studio_probe.py` (`tools.md`); it makes a `probe_st_...` account and, without
  `EW_DASH_PASS`, prints the SQL that removes it and its rows.

## Traps

- The page reads `backlog.json` with `fetch`; a publish that leaves `files` out keeps the old copy, so
  pass it every time.
- The family studio shows `backlog.json` as of the last deploy: an answer that says "moved it up" is
  true there only after the push.
- `npm test` checks the backlog (`src/data/studio.test.js`): ids in `next` exist and wait to be built,
  each with a `why`; every `next` or `building` item is in the queue; a tile's code is its element's
  real symbol (with `z`) or no element's symbol at all (the tiles look like the periodic table).
- No em dashes in anything the user reads (global rule).
