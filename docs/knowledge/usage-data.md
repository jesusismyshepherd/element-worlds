# Usage data and the family dashboard

Why (the user, 2026-10-29): to "see what is liked, revisited, spent time on, or speculate what is not
due to either underdevelopment, obscurity, confusion or dislike". The game records what is visited and
done (`src/net/telemetry.js`) into the family's database, and the parent reads it on a private page,
`/stats` (`src/pages/Stats.jsx`), behind a password or an admin account. Since the accounts came
(2026-10-29 evening, docs/knowledge/accounts.md) a signed-in player is recorded under their account; the
`?who=` tags of the first version are gone.

## What is recorded

The family's Supabase project (pokemon-site's, `kawvqpvntdgehigwvfao`), table `ew_events` (and
`ew_profiles`, the accounts' side); every name there starts with `ew_`. Schema, functions and the reasons
for them: `supabase/ew_001_usage.sql`, then `ew_002_accounts.sql`. The site only writes, through `ew_log`
(signed in, with the account's session: the server takes the account from it); the tables cannot be read
with the public key (row-level security, no policies). Nothing is recorded on the
dev server, on a home network address or under a test browser (the probes), unless the address has
`?track=1` (a probe that checks the recording itself).

Events are batched: sent every 15 s, at 60 waiting events, and when the page is hidden or closed
(`keepalive`). Each has a time, a kind, the page's address (`path`: `/`, `/e/C`, `/e/C/allotropes`,
`/lab`, `/forge`) and a little data:

| kind | data | from |
|---|---|---|
| `start` | `kind` (phone, tablet, computer), `browser`, `w`, `h`, `app` (home-screen app) | telemetry.js, once per page load |
| `enter`, `leave` | `w` the world ('plaza', 'lab', 'forge', 'atrium:C', 'wing:C:allotropes'); a leave also `ms` (open) and `act` (active: on show and touched in the last minute) | telemetry.js, the store's world |
| `hide`, `show` | | the page put away and back |
| `sel` | `z` | an element picked on the plaza |
| `fact` | `s`, `i`, `n` | the plaza card's "Tell me something" facts (`ElementCard.jsx`) |
| `panel`, `pclose` | `id` (the exhibit: 'facts', 'board:twins', 'look', 'big-atom', a station id, or the panel's title); a close also `ms` | telemetry.js, the store's panel |
| `talk` | `w` (the element) | asking an Atomling (`engine.talk`) |
| `tile` | `from`, `to` | a hall's floor table (`atrium.js`) |
| `quizopen`, `quiz` | `z`, `pick`, `ok`, `clues`, `of`, `n` | "Who am I?" (`PlazaHud.jsx`, `QuizHud.jsx`) |
| `drawer`, `find` | `id`; `z` | the plaza's drawers and search |
| `forge`, `mission` | `op` (add, remove, fire), `k`, `z`, `n`, `e`, `beam`; `id` ('forge:C12') | the Atom Forge (`forge.js`) |
| `level`, `view`, `lang` | `v` | Explorer or Scientist, the view, the language |
| `err` | `m` (message), `s` (file:line or 'promise') | uncaught errors |
| `room` | `op` (join, leave) | the rooms (multiplayer, `src/net/room.js`) |
| `lab` | `op` (add, join, part, remove, clear, demo, made), `el`, `show`, `together` | the Molecule Lab (`lab.js`) |
| `duel` | `op` (start, pick), `ok`, `n` | the quiz duel (`src/net/duel.js`) |
| `account` | `op` (in, out, new, moved), `found` | the account (`src/net/account.js`) |

New kinds may come (lab actions, rooms): the dashboard shows a kind it does not know under "Other
events" and in the timeline as it came, and never fails on one.

## Privacy

- A signed-in player: their events go under their account and are kept as its history, unless the
  account's switch "Record what I play" (👤, on by default) is off: then nothing is sent, and the server
  drops anything that comes.
- Everyone else is anonymous: one random id per page load (a "visit"), nothing kept in the browser, and
  nothing recorded at all when the device's own switch is off (`ew-track`) or the browser asks not to be
  tracked (Global Privacy Control, Do Not Track).
- No names and no addresses are recorded.
- Events older than 180 days are deleted (`ew_log`, now and then).

## People (accounts)

- A family member signs in once on each device (👤; the Pokémon site's login works): their visits are
  kept under their account from then on, on every device, and their progress follows them.
- `?who=` in an address does nothing now (it is removed from the address).

## The dashboard (`/stats`)

English only (an admin page, not part of the game), styled like the site, for a phone and a computer.

- The gate: one password field, or none for a signed-in admin account (`profiles.is_admin`; sign in with
  👤 on the game first). The password is checked by `ew_admin('check')`; a wrong one comes back after
  1.5 s. A password that worked is kept in that browser's `localStorage` (`ew-dash-pass`) until Log out;
  if it is changed in the database, the next call is refused and the page logs out by itself.
- People: every account that played (name, recording on or off, the device of its last visit, first and
  last seen, events, discoveries), with "Forget the history" (its events; the account stays). It is not
  filtered.
- Filters, scoping everything below them: the period (today, 7, 30 or 180 days, today included; times in
  the viewer's time zone) and who (everyone, one account, anonymous visitors).
- Summary: visits, active time, active per visit, places entered, panels read, quiz answers right.
- What it suggests: guesses from the numbers, each labelled (never colour alone): time spent, liked,
  revisited, not found? (main places never entered: a wing whose hall was entered but not it, so its arch
  may go unnoticed; one never reached; the lab or the forge; features never used), disliked? (a place
  left within 20 s in most of its entries), underdeveloped? (halls where nothing was opened, asked or
  followed, compared with the halls that have picture boards), confusing? (a panel mostly closed within
  3 s, a panel opened again within 30 s of closing, the quiz opened and never answered, answers wrong
  with every clue, the forge entered with nothing built, the level switched back within a minute),
  broken (errors). Rules and thresholds: `src/stats/readings.js` `signalsOf`.
- Visits and active time per day (per hour today, per week over 180 days), two column charts sharing
  their days (two measures, two charts, never two axes).
- Where the active time goes: every world entered, with how many visits it was entered in (revisits),
  entries, quick exits and talks (the table view).
- Left within 20 s (quick exits): a world left with under 20 s of active time; not the plaza (the way to
  everything) and not a hall left by its floor table (passing through).
- Never entered, never used: the lab, the forge and every wing in `src/worlds/registry.js` `WINGS` (the
  noble gases' shared workshop said once when none of its rooms was entered), and the features
  (`analyze.js` `FEATURES`).
- In the halls: per hall its time, visits, panels read and skimmed, the average reading, talks, floor
  table jumps and wings entered; halls with picture boards are marked.
- Panels, read or skimmed: read means open 3 s or longer, skimmed closed sooner; per exhibit across the
  halls (a wing's across the elements sharing it).
- On the plaza (picks, whether their halls were then entered, the card's facts, the search), the quiz
  (right and wrong, clues shown, rounds finished, elements missed), the Atom Forge (particles added and
  removed, beams, missions), drawers and settings, errors (message, where, when, which device), other
  events.
- One visit at a time: the visits of the chosen person (the Who filter), newest first, with date,
  device, how long and how much active; a visit's events in plain words ("10:42 entered Carbon's hall
  (3 min, 2 min active)", "opened the Fact file for 45 s", "asked Carbon's Atomling to tell something,
  3 times"). A visit can be forgotten there (`forget_visit`: a test or a mistake).

Every chart has a table view, a tooltip on hover and on focus (a tap on a phone), and a plain reading
under its title. The charts follow the data-viz skill's rules: one colour for a single series, the
palette's dark blue and orange checked against the page's navy surface, thin bars with a 4 px rounded
end, 2 px gaps, hairline grids.

### How the events are read (`src/stats/analyze.js`)

What the recording does that the analysis has to know (seen in a capture of the real events,
2026-10-29):

- A panel opened at an exhibit is recorded first under its title (or the previous exhibit's id) and a
  frame later under its own id: `panel 'Fact file'`, `pclose 'Fact file' ms 1`, `panel 'facts'`. A
  panel closed within `FLICKER_MS` (300 ms) is only that correction. Opens and closes are paired by id
  and time (a close says how long it was open), so the order of events in the same millisecond, which the
  database does not keep, does not matter.
- A world rebuilt where it stands (a change of language) is left and entered again within a second: a
  leave and an enter of the same world within `JOIN_MS` are one stay.
- A page closed or killed while put away (phones) sends no `leave`: the stay lasts until the last thing
  recorded there, without the time the page was hidden, and is marked estimated.
- (Until the accounts, a marked device sent what an earlier page load could not with its next one;
  the timeline still sets such events apart.)
- telemetry.js starts on every page, `/stats` too: events whose address is `/stats` are left out.
- `ew_admin('events')` returns the newest events of the period, at most 50000; the page says so when it
  reaches that, and a shorter period reads them all.

Files: `src/pages/Stats.jsx` (the page), `src/stats/api.js` (the calls, the kept password),
`analyze.js` (the numbers), `readings.js` (the readings and the guesses), `timeline.js` (a visit in
words), `names.js` (places, panels, missions in English), `format.js` (durations, times), `ui.jsx`
(cards, tables, charts), `fixture.js` (synthetic visits for the tests). Tests: `src/stats/*.test.js`
(`npm test`).

## Reading the data directly (a Claude session)

With the Supabase MCP, `execute_sql` on project `kawvqpvntdgehigwvfao` (read-only queries; the tables
cannot be reached with the public key):

```sql
-- what was done, by kind, in the last week
select kind, count(*) from public.ew_events where at > now() - interval '7 days' group by kind order by 2 desc;
-- the accounts that played, with their switch and how much they discovered
select p.username, ep.tracking, jsonb_array_length(ep.progress->'found') as discoveries, ep.migrated_at
from public.ew_profiles ep join public.profiles p on p.id = ep.id order by ep.updated_at desc;
-- one person's last visits, with their events in order
select e.visit, e.at, e.kind, e.path, e.data from public.ew_events e join public.profiles p on p.id = e.account
where p.username = 'artur' and e.at > now() - interval '2 days' order by e.at;
```

`ew_events`: `at` (when it happened, the device's clock kept within the last 14 days), `received`,
`account` (null for anonymous visits), `visit`, `kind`, `path`, `data`. `ew_profiles`: `id` (the
account), `tracking`, `progress` (`found`, `quiz`, `neon`), `migrated_at` (when a device's progress first
came over). Or through `ew_admin` with the password, as the probes do.

## The password

Only its bcrypt hash is kept, in `public.ew_admin_pass`; the password is never in the code, the repo or a
file. To change it, run in the SQL editor (or `execute_sql`) the line from the header of
`supabase/ew_001_usage.sql`:

```sql
update public.ew_admin_pass set pass = extensions.crypt('<new password>', extensions.gen_salt('bf', 8));
```

Every browser that kept the old one is logged out at its next call. The probes read it from the
environment variable `EW_DASH_PASS`.

## Probes

- `tools/usage_probe.py`: the anonymous recording from end to end (the events read back, nothing kept in
  the browser), then forgets the visit.
- `tools/account_probe.py`: accounts and their recording (docs/knowledge/accounts.md).
- `tools/stats_probe.py`: the dashboard from end to end with synthetic data: a throwaway account
  (`probe_dash_xxxx`), two visits logged as it covering every kind (and one unknown), the gate (a wrong
  password refused and not kept), every section with that data, a tooltip, a table view, the timeline in
  plain words, a visit forgotten, the account's history forgotten, log out, no console errors;
  screenshots on a computer and a phone in `tools/shots/stats/`; it always deletes the account and its
  visits at the end.

```
EW_DASH_PASS=... py -3.11 tools/stats_probe.py
```

Both are browser probes: run them through the pokemon project's heavy-job lock when other sessions are
busy (CLAUDE.md, Rules).
