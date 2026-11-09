# Today's element and the streak (2026-11-09)

The user asked for ideas "to hook user into wanting to play again and thinking about it (as well as
about the educational content they are absorbing) in between the sessions". Claude proposed a daily loop
(an element of the day, a streak that forgives a missed day, the Atomlings met before coming back sleepy
until they are gone over again, tomorrow's element as a mystery to talk about); the user: "Artur already
is hooked on duolingo's streaks so might work fine. start working on where you seem fit". So: one element
a day, the same for the whole family, a lesson of about three minutes, a streak of days in a row.

## What a player sees

- **The plaza's dock**, first button: 🔥 and the streak, grey with a pulsing dot while today's lesson
  waits, lit once it is done ("Today's element" beside it on a computer).
- **The sheet** (down the left side; across the top of an upright phone; it takes the dock's place like the
  quiz, the card stays hidden while it is open): the streak and the week (Monday to Sunday: 🔥 a day done,
  ⭐ a perfect one, ❄️ a day a freeze kept, · a day missed), the freezes and their rule, "keep your streak"
  or "start one today", the guess made yesterday ("start to find out"), the Atomlings that miss you (the
  elements due to be gone over, 😴), Start.
- **The lesson**, six steps and the missed ones once more:
  1. Find the day's element in a small table (Explorer: the cells show symbols and the prompt gives the
     symbol; Scientist: blank cells in their families' colours, found by its place). A wrong cell shakes and
     says what it was; after two (three for the Scientist) the right one glows. Found: the plaza flies to its
     cube, its Atomling pops up, "<name> says hello!" with its greeting, and yesterday's guess is revealed.
  2. Three questions about it, of different kinds. Explorer: its state, its family, a yes or no (lighter
     than water? a metal? radioactive? known in antiquity?, the surprising "yes" preferred), its protons,
     its symbol (among look-alikes from its name's letters), one of its uses (among two of other families,
     every name hidden), which of two neighbours is heavier, melts higher or is denser. Scientist: its
     electron configuration, when it was discovered (by era), which neighbour has the higher
     electronegativity, the bigger atom or the higher melting point, a use, its family, a yes or no, its
     state. Each answer says why: the element's own words (`stateNote`, `nameOrigin`, `discovery`,
     `isotopes`) or the data (the density against water's, both values of a comparison, and the rule of
     thumb, across a row or down a column, only where this pair keeps it; "a surprise" for argon and
     potassium, cobalt and nickel).
  3. Two elements met before: "Who am I?" from two clues, find it in the table, its symbol, its family.
  A first answer that was wrong comes back once at the end ("once more"). The table flies to each answer;
  while a question is open it shows the whole table, since the cube up close would tell the symbol, the
  number or the family's glow.
- **The end**: the flame and the streak (it pops), a milestone (3, 7, 14, 21, 30, 50, 75, 100, ... days),
  "a new record" once, on the day a streak passes an older one's best, the score, ⭐ perfect, ❄️ a freeze
  earned, the Atomlings woken up, the week, **tomorrow's mystery element** (two clues, four to choose from,
  the same for everyone at a level, so the family can argue about it; the guess is revealed tomorrow),
  "Visit the hall", "Practise more" (five elements to go over, the day not counted again), Psalm 118:24.
- Reopened the same day: done for today, the mystery, the hall, practice.
- **The passport**: a streak tile (it opens `/?daily`, the plaza with the sheet open) and two badges, 🔥 7
  days in a row and ☄️ 30, by the best streak.

## How it works (`src/game/daily.js`, pure; `daily.test.js`)

- **Days** are the device's calendar ('YYYY-MM-DD'). **The element of a day** is `CYCLE[days since EPOCH
  % 151]` (EPOCH 2026-11-09, carbon): the first week the halls with picture boards (C, Na, O, Fe, H, Si,
  Kr), then the quiz's Explorer pool twice (the second time its list turned by half, so the same element
  comes back five weeks later or more) and every other element once, spread evenly: about every other day
  one a ten-year-old has heard of. The others are spread by kind (lanthanides, actinides, superheavies,
  the rest) so no kind comes in a cluster; the superheavies sit late in their share (their lessons have
  the least to tell). No element within 30 days of itself, across the cycle's end too.
- **The streak is worked out from the days done**, never kept as a counter (`streakOf`): days in a row; a
  past day missed while a freeze is in hand is kept (the freeze is spent); one freeze to start, one more
  at every seventh day of a streak, two at most; today stays open until midnight. So two devices only need
  their days joined. `weekOf` gives the row of seven.
- **Boxes** (Leitner): every element asked about moves up a box when all its first answers were right
  (back in 1, 2, 4, 8, 16 days), to the first when not (`answered`). The elements to go over: the due
  ones first (`dueOn`), then the halls met (discovery keys, `metFrom`) and past days' elements never asked
  about, then new ones from the level's pool (`reviewsFor`). Today's and tomorrow's elements are never
  among them.
- **Questions** are descriptors without words (`makeLesson`: `{ id, kind, z, options, answer, today |
  review }`), seeded by the day and the level; the HUD words them (`daily.q.*`, `daily.opt.*`, `daily.ex.*`
  in the locale files, the element names, the element's own words). Polish and German questions put the
  name first ("{{name}}: …") so it never needs a case or a gender. `lessonNeeds` says which elements' own
  words to load first (the uses' distractors come from a seeded pool of eight).
- **The mystery** (`mysteryFor`): tomorrow's element, seeded by tomorrow's date and the level; its clues
  are the quiz's (`cluesFor`: a fact and a use, the name hidden).

## Kept: `ew-daily` and the account

- `{ days: { day: { s, r, n, at } }, boxes: { symbol: { b, d, at } }, guess: { day: z } }` in localStorage
  `ew-daily` (`progress.js`: `dailyState`, `keepDaily`, in `snapshot()`, `adopt()`, `clearProgress()`).
  `keepDaily` tells `onDaily` listeners (`src/ui/useDaily.js`: the dock, the sheet, the passport) and the
  account, which saves two seconds later as after a discovery.
- The account: `supabase/ew_005_daily.sql` (applied 2026-11-09) gives `ew_save_progress` a `daily`: days
  joined (for a day in both, the account's first one stays), each element's box the newer by `at`, guesses
  joined (the device's for a day in both). A server without it would have dropped nothing on the device:
  `adopt` keeps the device's `daily` when the merged progress has none.

## The family (2026-11-09)

Claude's other half of the idea (a shared streak that keeps two people going, Duolingo's friend streaks):
signed in as a member of a family, the sheet shows a box, "Your family": each member with ✓ or ⏳ for today
and their own streak, the days in a row on which every member did it ("1 day together", 🔥🔥), "Already done
today: miki. Your turn!" while the others are done, and "Everyone in the family did today's element!".

- Who is family is the admin's choice: the family dashboard's People list has a "Family" button on every
  account that played (`ew_family_admin`, the dashboard's password or an admin account). It started with the
  user's account and Artur's (miki and glastrierarturmon); johannes, the third account that has played, is
  not in it unless the user puts him in.
- A member sees the other members' names and the days each did today's element, nothing else of their
  progress; anyone else gets nothing (`ew_family_days`, members only, signed in). Families are groups by
  name (`ew_family.family`): `home` is the family's own; a probe puts its accounts in a family of its own
  (`probe_...`), never in the real one (`ew_007_family_groups.sql`, after a first probe had put two
  throwaway accounts in the one family for a minute).
- `familyOf(members, today)` in `daily.js` works out each member's streak from their days (the last 370)
  and the days together; my own days come from the device too, as the account has them a moment later. The
  box asks again after a lesson, once the account has saved it (`DailyHud.jsx`, `Family`; `src/net/family.js`).
- `supabase/ew_006_family.sql` (the table, the two functions, the seed), `ew_007_family_groups.sql`.

## Recording (`usage-data.md`)

`dailyopen` `{ done, streak }` (the dock's button) and `daily` `{ op }`: `start` `{ s, practice }`, `q`
`{ k, z, ok, n }` (each first answer), `done` `{ s, r, n, streak, practice }`, `guess` `{ z }`. The family
dashboard lists "today's element (the streak)" among the things to use.

## Checking

- `npm test`: `daily.test.js` (dates, the cycle, streaks and freezes, the week, the boxes, the reviews,
  every day's lesson at both levels with every answer among its options and right by the data, practice,
  the contents a lesson needs, the mystery, what is kept, every word in the four languages without dashes).
- `py -3.11 tools/daily_probe.py [--port 5317] [--only computer|phone|side] [--lang pl] [--level scientist]`:
  plays a lesson through (one answer wrong on purpose, which must come back), checks the streak, what the
  device kept, the guess, the dock after a reload, practice instead of a second lesson, a player with six
  days and a freeze reaching seven (and earning a freeze), and the passport's tile; screenshots in
  `tools/shots/daily/`.
- `py -3.11 tools/hud_probe.py --scene daily` (the sheet and the lesson's first step on the six screens).
- `QA_INVITE=<token> py -3.11 tools/daily_probe.py --account`: a throwaway account made from an invite link,
  the lesson played, the day in the account (`ew_me`), a second device signing in with the streak, the day
  done and the guess; then delete the account with the SQL it prints (2026-11-09: all green).
- `QA_INVITE=<token> py -3.11 tools/daily_probe.py --family` (run it in the background): two throwaway
  accounts; it prints the SQL that puts them in a family of their own and waits for it (run it with the
  Supabase MCP), then one does the lesson, the other sees it done and "your turn", does it too and sees a
  day together; then delete both with the SQL it prints (2026-11-09: all green).

## Traps

- A sheet that opens has to refit the table beside it: `overview()` once it is open (useCover reports the
  sheet in a layout effect, so an effect after it already sees the cover). Without it the table ran off the
  right edge of a computer's screen.
- The day's cube up close tells its symbol, its number and (by its glow) its family: those questions keep
  the whole table in view and fly to the cube after the answer.
- "A new record" every day a streak is at its best means nothing: only the day it passes an older best.
- i18next looks for plural forms when a text gets `count`: a number in a text that is not plural is `n`.
- Playwright's `wait_for_function` does not await an async check: the promise it returns counts as true at
  once (the family probe went on before the accounts were in the family, twice). Poll `page.evaluate`,
  which does await, in a loop.

## Next (in the studio)

A reminder at an hour the family chooses, the element hunt at home, a radon clock that halves on the real clock, a question to take away
from each hall, mail from the Atomlings, riddles for each other, a duel over days: each an idea in
`docs/studio/backlog.json` to give a verdict.
