# Playing together (rooms), 2026-10-29

The user: co-exploration and co-op labs "something more than two family members can enjoy at a time",
games for more players, or for two with "the others ... spectators with possibility to easily swap seats".

## What a player sees

- The top bar's 👥 button ("Together") opens the room sheet: a name, "Start a room" (a 4-letter code,
  ABCD), or the code of someone else's room and "Join". A link with `?room=ABCD` opens the sheet asking
  only for a name (and joins at once when the name is known on that device). A reload of the same tab
  comes back into the room (sessionStorage).
- In a room: the code and "Share the link" (the phone's share sheet, else the clipboard), everyone in it
  with their colour and where they are (🔲 the table, 🏛 a hall, 🚪 a wing, 🧪 the lab, ⚛️ the forge),
  "Go there", "Follow" (go wherever they go, until I go somewhere myself), six emotes, "Call everyone
  here", "Leave the room". The button shows how many are in the room.
- Notes under the bar on the right: who joined or left, who came to or left my world, who calls everyone
  (with "Go": it takes me there and stands me beside the caller).
- In a hall or a wing, everyone in the same world walks there as that world's Atomling with a ring in
  their colour and their name over it; emotes float up over the one who sent them; a call puts a pillar
  of light where the caller stands. On the plaza, a name floats over the cube each one has selected.
- The Molecule Lab is shared by everyone in it: one molecule, built together. Each player picks atoms
  for themselves (a ring in their colour), the lab card says who is building ("Building together: ...").

## How it works

- `src/net/room.js` (the room), `src/engine/others.js` (the others in the 3D, loaded only once a room is
  joined, so a visit alone does not download it), `src/ui/RoomHud.jsx` (the sheet and the notes),
  `src/worlds/lab/lab.js` (the shared lab). Words: `room.*` in the four locale files.
- The family Supabase project's realtime channels (`ew-room-<CODE>`; URL and publishable key in
  `src/net/config.js`). Nothing is stored; a room lives as long as someone is in it. No chat, no
  matchmaking, no public list of rooms: only people the code was given to.
- Presence says who is in the room, and only that: it is tracked when joining, after a reconnect and at
  most every 30 s. Everything that changes (where I am, what I picked on the plaza, my pick in the lab) is
  a broadcast `here` with a time; each member is shown as presence says, overlaid with anything newer
  they said; my own entry is always my own current state. When someone joins, everyone tells them
  (`here`). Leaving sends `bye` first (everyone drops the leaver at once), then closes the channel.
- Other broadcasts: `pose` (where a walker stands, about 7 a second while moving, only when someone else
  is in the same world), `emote`, `call`, and the lab's `lab-op`, `lab-state`, `lab-hello`.
- The shared lab: atoms have ids (`<player>.<n>`) that stay put while the molecule changes; every change is
  an operation (add, join, part, remove, clear, demo) applied by the host, the one who has been in the
  lab longest; it sends the molecule (`lab-state`) with a version that counts up across the room, and
  everyone takes any newer one, whoever sent it. A newcomer asks (`lab-hello`) and everyone with a
  molecule answers (the newest wins); a new host first asks too. Alone, I am my own host.
- A watchdog looks at the channel every 5 s and when the page is shown again; a channel that is not
  joined twice in a row is opened again (a phone switching to a call can lose it).

## Traps met (and their fixes)

- **"Client presence rate limit exceeded"**: the realtime service closes the channel of a client that
  updates its presence often (it did on every move and pick). Presence for membership only; changes by
  broadcast (above). The realtime service's own messages are kept in `window.__ewRealtimeLog` (the
  client's logger in `config.js`); `room.trail` keeps the connection's last changes. Read both first.
- A property and a method with the same name: `get on()` (in a room?) and `on(event, fn)` (listen): the
  method wins and "in a room?" was always true. The yes/no is `room.active`.
- A host chosen by "earliest in the lab" moved when a late presence arrived; the room-wide version
  makes a change of host harmless.
- Untracking before closing the channel took seconds to reach the others; closing alone is at once.
- Vite's dev server found `@supabase/supabase-js` only when a room was first joined (a dynamic
  import), re-bundled and refused the old copy ("504 Outdated Optimize Dep"): it is in
  `optimizeDeps.include` (vite.config.js).
- Probes and the dev server: someone else saving a file reloads every page of the dev server, the
  probe's players with it. Probe a separate build: `npx vite build --outDir <scratch>`,
  `npx vite preview --outDir <scratch> --port 5317`, `--base http://localhost:5317`.

## Checking

`MSYS_NO_PATHCONV=1 py -3.11 tools/room_probe.py [--base ...]`: three players (one a phone) in one room:
start, link, code, colours, follow into a hall, each other's Atomlings and moves, a call answered from
another world, an emote, water built together atom for atom, the lab going on when its host leaves,
leaving. 24 checks, about 3 minutes; it prints each player's trail and realtime log when a check fails.

## Next

- Two-seat games with spectators and seat swapping (the user's request): the quiz as a duel.
- A shared forge (everyone firing at one nucleus).
