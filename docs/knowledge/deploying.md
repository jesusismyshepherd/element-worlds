# Deploying and new versions

- Vercel deploys `main` on every push: https://element-worlds.vercel.app. `tools/shot.py --base
  https://element-worlds.vercel.app` looks at the live site.
- Functions in `api/` (`api/chapter.js`) run on Vercel; `vercel.json` sends every other address to the
  page. Their secrets are Vercel environment variables (`YVP_APP_KEY`, `scripture.md`).
- Every build has a number of its own, in the code (`__BUILD__`) and in `/version.json` (a plugin in
  `vite.config.js`; `vercel.json` keeps that file from being cached). `watchUpdates` in
  `src/engine/release.js`: an open page asks for it when it comes back on screen and offers "Reload" when
  the number changed. The phone's ☰ menu always has Reload: the installed app (manifest `fullscreen`)
  has no reload button and no pull to refresh (the user, 2026-10-29). The dev server has no
  `version.json` (it answers with the page), so the check is off there. `tools/update_probe.py` checks it
  with two builds.
- A page the new deployment left behind fails to load a world's code ("Failed to fetch dynamically
  imported module", or the server answers a script with the HTML page): `reloadOnce` in `release.js`
  reloads it once; a second failure within a minute is shown as an error (no reload loop).
- A reload puts the player back where they were (`walking.md`, "A reload keeps your place").
- Before committing while other sessions have work in the tree: `python -X utf8 tools/check_staged.py`
  (CLAUDE.md, "Working traps"), so what goes live builds on its own.
