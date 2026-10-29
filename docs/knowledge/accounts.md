# Accounts (2026-10-29)

The user: "create user profiles ... deprecate the ?who= tag and allow all of the signed in users to have
their behaviour taken into account ... a toggle in the settings to switch the tracking off and make it on
by default", and move what a browser already holds (badges, visited, points) into the account the first
time, "not to lose what Artur has already gathered on the phone (he used one device so far)".

## What a player sees

- The top bar's 👤 button (on a phone, the first row of the ☰ menu) opens the account sheet:
  - signed out: "Sign in" or "New account" (a name and a password), a line saying the Pokémon site's
    login works too, and the switch "Record what I play" for this device;
  - signed in: who, "Your discoveries are saved to your account", what came over from this device
    ("12 discoveries from this device are now in your account"), the switch (kept with the account, on
    every device), the family dashboard for an admin, "Sign out".
- The room's name starts as the account's name.

## The accounts

- The family Supabase project's own accounts, the pokemon-site's: a username (3 to 20 letters, digits or
  `_`, not a reserved word: `usernameProblem` in `src/net/account.js`, the pokemon-site's rules) and a
  password (6 or more). Behind it the address `<username>@pokemon-app.internal` (no real e-mail; the
  project does not confirm addresses), and the profile (`profiles`) made by the database's trigger, so an
  account made on Element Worlds works on the Pokémon site and the other way round.
- Element Worlds' side of an account: `ew_profiles` (the recording switch, the progress), reached only
  through `ew_me`, `ew_set_tracking`, `ew_save_progress` (`supabase/ew_002_accounts.sql`).
- The session is kept by the Supabase client (localStorage `sb-kawvqpvntdgehigwvfao-auth-token`); the
  client is loaded at the start only on a device that was signed in before (a visitor who never signs in
  does not download it). Calls through `rpc` carry the access token (`setToken` in `src/net/config.js`).

## The progress

- What a player gathers: the discoveries (`ew-found`, the passport and the badges come from them), the
  quiz's records (`ew-quiz-best`), the names written in the neon workshop (`ew-neon-name:<Symbol>`):
  `snapshot()`, `adopt()`, `clearProgress()` in `src/engine/progress.js`.
- The first account that signs in on a device takes what the device gathered before (`ew-owner` on the
  device says whose the progress is): Artur's phone's discoveries go into his account at his first
  sign-in, by signing up or signing in with an existing account.
- `ew_save_progress` merges on the server: discoveries joined, the best quiz record kept, the device's
  neon names over the account's. Signed in, the device saves 2 s after each discovery, every 15 s
  otherwise, and when the page is hidden; another device signing in gets everything back.
- Signing out saves, then empties the device's progress (the account keeps it): the next player on a
  shared computer starts with their own. Someone else's leftovers on a device (if a sign-out never
  happened) are dropped, not merged.
- When the progress is replaced (a sign-in brings the account's, a sign-out empties the device),
  `progress.js` tells `onRestore` listeners: the engine calls the world on show's `refresh()` (its read
  marks and its counter again; every world has one) and the passport reads again. Before this (2026-10-29)
  a second phone showed the account's score only after a reload. `account_probe.py` checks it in Carbon's
  hall.

## Recording

- Signed in: the events go under the account (`ew_events.account`), unless its switch is off, then
  nothing is sent and the server drops anything that comes. The browser's Do Not Track does not apply
  to an account: its own switch does.
- Signed out: anonymous as before (one id per visit, nothing in the browser), off when the device's
  switch is off (`ew-track` = `off`) or the browser asks not to be tracked.
- The `?who=` tags are gone: a `?who=` in an address is removed, the devices table and its functions
  dropped (no device had been marked).

## The dashboard

`/stats` (docs/knowledge/usage-data.md): "People" lists the accounts that played (recording on or off,
the device of their last visit, first and last seen, events, discoveries), with "Forget the history"
(their events; the account and its progress stay). A signed-in admin (`profiles.is_admin`) comes in
without the password.

## Checking

- `EW_DASH_PASS=... py -3.11 tools/account_probe.py [--base ...]`: a throwaway account (`probe_xxxx`)
  made from a device with progress, the move, a new discovery saved, recording under the account, the
  switch, sign-out emptying the device, another device getting it all back, a wrong password and a
  taken name refused, the signed-out switch, an old `?who=` link; then the account is deleted
  (`ew_admin` `forget_probe`, only for `probe_` names). 14 checks.
- `tools/stats_probe.py` and `tools/usage_probe.py` (anonymous recording) want EW_DASH_PASS too.
- `src/net/account.test.js`: the name rules.
