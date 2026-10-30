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
  of light where the caller stands. On the plaza, each one's Atomling stands on the cube they have selected (the user, 2026-10-29), with
  their ring and name; on a cube I picked too they stand beside mine, and a row too wide for the cube
  makes them all smaller (`plazaMarks` in `src/engine/others.js`; three lights for their cubes are made
  with the world, since adding a light later recompiles every material).
- The Molecule Lab is shared by everyone in it: one molecule, built together. Each player picks atoms
  for themselves (a ring in their colour), the lab card says who is building ("Building together: ...").
- The things in a wing are shared too (the user, 2026-10-30: "I release the balloons in the neon chamber,
  all the players in the room see it too and share its state"): someone lets the balloons go, fills a
  tube, lights a word, and everyone in the same world sees it happen; who comes in later finds it as it
  stands. Panels, the Atomling's words, videos and discoveries stay each one's own ("as in all popup
  boxes"). Below, "Shared world objects".

## The quiz duel: two seats, the others watch (and swap in)

- In a room, the plaza's dock has "⚔️ Duel" beside "Who am I?". Whoever starts it takes the first seat; the
  others see the duel's window (and a note with "Go" if they are elsewhere). The second seat: "Sit here".
- The two seated race on the same mystery element: a new clue every 7 s (each one reads them in their own
  language), the first right answer scores (more for fewer clues, as the solo quiz), a wrong one locks
  that player out of the question; both wrong, or 9 s after the last clue, the answer is shown (the plaza
  flies to it). Five elements a game, then the winner.
- Everyone else watches the same clues, answers and scores. Swapping seats: a watcher taps "Swap with
  Ana" and Ana answers "Let them play" or "Keep playing"; or "I want to play" puts them in line; a seated
  player can "Give my seat" to the first in line; "Play again" keeps the winner and gives the other seat
  to the first in line. Someone who leaves the room gives their seat to the first in line.
- The rules: `src/game/duel.js` (pure functions of the state; `duel.test.js`). The referee (who started
  it, then the next seated one if they leave) runs them four times a second and sends the state
  (`duel-state`, versioned); the others send what they do (`duel-act`); a newcomer asks (`duel-hello`).
  The referee's clue count sets the points. `src/net/duel.js`, `src/ui/DuelHud.jsx`.
- `tools/duel_probe.py`: three players (one a phone), 15 checks: start, seat, the race, lock-out, who got
  it, a swap asked and allowed, a whole game, the rematch with the winner staying, the referee leaving.

## Shared world objects (2026-10-30)

- `src/net/shared.js` (`shared`, `window.__ewShared`): the engine tells it each world it enters
  (`shared.enter(w, path)`, `leave`) and gives worlds `ctx.share(id)`. A world lists its things in `shared`
  (`{ id: { get, set(state, live) } }`); how a wing does it: `adding-a-wing.md`, "Shared with the room".
  Every wing shares its things: the neon workshop all seven (bench, radon, name, atom, history, spectrum,
  balloons), carbon's gallery 14 and garden 9, oxygen's air deck 7 and fire chamber 5, sodium's lab 4
  and silicon's 5 (each area's README lists them; the video, its parts and the panels stay personal).
- The halls share nothing: every exhibit there opens a panel, takes the player somewhere or talks, and
  their moving pieces (the turntables, the big atom) run on each player's own clock. A world without
  `shared` (or with an empty one) sends no messages; `shared_probe.py --world` stops at "shares things".
- Per world address (`/e/Ne/signs` and `/e/He/signs` are two worlds). Each thing's state has a version that
  counts up across the room and who wrote it; the higher (v, by) wins everywhere.
- Broadcasts: `w-set` (a change, played live), `w-hello` (I came in: tell me; with `parts` when sent by
  someone already there who met a newcomer late), `w-state` (the answer, or mine after nobody answered:
  shown at once, not played). Coming into a world while others are in the room waits up to 1.5 s for an
  answer; nobody answers, its own state stands and is told, so two who came in together (following, a
  call) agree on one. Alone in the room: no messages at all.
- Nothing is stored: a world's state lives while someone is in it; the last one out takes it along. Not
  in a room, nothing changes from before.
- Tests: `src/net/shared.test.js` (a fake room: live changes, newcomers, two at once, a change made while
  asking). Probe: `tools/shared_probe.py` (below).

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

`py -3.11 tools/plaza_room_probe.py [--base ...]`: three players on the table (one a phone): each sees
the others' Atomlings on the cubes they picked, side by side on a shared one, moving with a new pick,
gone when one leaves; and the dock (Trends in Explorer, the phone's drawers over a selected card). 17
checks, under a minute; screenshots in `tools/shots/plaza_room/`.

`py -3.11 tools/shared_probe.py [--base ...]`: three players (one a phone) in neon's workshop: the
balloons, a tube, a word, the spectroscope, the atom, the counter and the board, each played on the other's
screen without their panel or words; a latecomer finds it as it stands; helium's workshop keeps its own.
30 checks, under a minute. `--world <path>`: any world, every exhibit used in turn and the states
compared, then a latecomer; it lists the exhibits whose use changed nothing shared.

## Next

- A shared forge (everyone firing at one nucleus); other two-seat games can reuse the duel's seats,
  line and swap (`src/game/duel.js`).
