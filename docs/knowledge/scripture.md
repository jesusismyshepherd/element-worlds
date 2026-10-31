# Bible passages through the worlds (2026-10-31)

The user asked: "interweave passages from the Bible throughout the world, relevant to where they are
placed; for Explorer use the NLT and for Scientist the CSB." Every place quotes one passage about what
stands there, with a line on why it stands there, at both depths and in the four languages.

## What is where

| place | passage | how it is shown |
|---|---|---|
| every hall (`/e/<Symbol>`) | the element's own (iron Proverbs 27:17, gold Revelation 21:18, iridium the rainbow of Genesis 9:13...), else its name's (a country: Psalm 117:1; a scientist: Psalm 111:2), else the superheavies' (Psalm 144:4), the radioactive elements' (Isaiah 40:8) or the family's | a standing stone, the specimen case's twin across the hall; E, or the prompt's button, opens it |
| the plaza | Psalm 19:1 | in starlight behind the table, leaning back to face the overview; a click opens it |
| carbon's gallery | Psalm 104:24 | on the far wall under "One element, many forms"; a tap on it, or E behind the dome |
| carbon's garden | Psalm 104:30 | a slate by the gate, turned to the path |
| oxygen's sky deck | Psalm 150:6 | a slate south-west of the box of air, by the arch |
| oxygen's fire chamber | Exodus 3:2 (the bush that burned and was not burned up) | a stone north of the campfire framed in embers |
| the neon sign workshop | Matthew 5:16 | a plaque on the south wall, east of the door |
| the Molecule Lab | Colossians 1:17 | in the sky over the bench |
| the Atom Forge | Hebrews 11:3 | in the sky beyond the rim |
| the Star Forge | Isaiah 40:26 | in the dark left of the star (computers only: on a phone it would hide behind the panels) |
| "Who am I?" | Psalm 147:4 | under the score when a round ends |
| `/atomlings` | Revelation 4:11 | under "How to read an Atomling" |

`hallPassage(el)` in `src/content/scripture/index.js` says which passage a hall quotes; the elements
named after countries and scientists are listed there. The halls' choices and the reasons: `why.js`.

## The translations

| language | Explorer (`kid`) | Scientist (`sci`) |
|---|---|---|
| English | NLT, New Living Translation (the user's choice) | CSB, Christian Standard Bible (the user's choice) |
| European Portuguese | BPT, a BÍBLIA para todos (Sociedade Bíblica de Portugal) | ARC, Almeida Revista e Corrigida, Portugal |
| Polish | SNP, the Ewangeliczny Instytut Biblijny's Bible (2018), modern and readable | BW, Biblia Warszawska |
| German | HFA, Hoffnung für alle | SLT, Schlachter 2000 |

Chosen to mirror the user's pair: an easy, careful translation for Explorer and a closer one for
Scientist, Protestant like the NLT and the CSB, and each in its own country's language (pt-PT, not
Brazilian: the Bible Gateway's ARC is Brazil's, the Bible App's 215 is Portugal's). The About box (ⓘ)
lists every publisher's notice (`VERSIONS` in `index.js`); each allows quotations of this size (NLT up to
500 verses, CSB up to 1000) with its notice and the initials after each quote, which every quote carries.

## How the words get here

`py -3.11 scripts/data/fetch_verses.py` reads `src/content/scripture/passages.json` (`{ id: { ref, heb? } }`,
the English reference as `BOOK.chapter.verse` in USFM, `PSA.139.17-18`) and writes `verses.json`, word for
word from the Bible App (bible.com), whose chapter pages carry all eight translations in one form. It
fetches only what is new (chapters cached in `scripts/data/.verses-cache/`, git-ignored); `--show
PSA.19.1 [heb]` prints one reference in all eight. The Bible Gateway shows at most five translations at a
time and lacks four of these.

Read every text the tool prints before keeping a passage. What it does by itself, and why:

- **Psalm numbering.** BPT, SNP, BW, HFA and SLT number a psalm's title as verse 1, so the same words are
  a verse later (Psalm 19:1 is Psalm 19,2 in German). `heb: 1` (or 2 for Psalm 51) moves those five; the
  reference shown is each translation's own. Psalms whose title is short (74, 104, 139, 144) need none.
- **Joined verses.** HFA sometimes joins two verses into one (Genesis 9:12-13): the tool takes the joined
  text and the reference grows to cover it.
- **Poems keep their lines** (each line on its own, as the translations print them; Polish and German
  capitalise every line, which reads wrong run together). Prose runs on.
- **Speech marks** opened before the passage or closed after it are dropped (Matthew 5 opens Jesus' words
  with “ and closes them verses later); German »…« and Portuguese «…» are the same marks reversed; ’ is
  also the apostrophe.
- **Half sentences** (a verse that starts in lower case, or stops at a comma, semicolon or colon) show an
  ellipsis there, as quotations do.
- Notes, cross references, verse numbers and the commas between note marks are left out; the divine name
  in small capitals (LORD, SENHOR) is written in capitals; the Hebrew letters over Lamentations' verses
  (SNP) are left out; a chapter's first word in capitals (ARC's "OS céus") is written normally.

Choosing a passage: it must say the thing itself (sand for silicon, bones for calcium) in all eight, or
the link breaks in a language (Proverbs 3:8 was dropped for calcium: HFA and BPT say "body", not "bones").
Prefer verses that stand alone in all eight; Psalm 65:9 was dropped for nitrogen (half sentences and an
editor's brackets in four), Leviticus 26:4 kept with ellipses. A scripture text is never edited: it keeps
its translators' punctuation.

## The pieces (`src/worlds/common/verse.js`)

- `verseText(ctx, id, opts)`: the words and the reference as troika text, top at the group's origin,
  fitted into `maxHeight` (a longer translation is made smaller, `middle` centres it), and written again
  when the level changes (the store's `level`; a new language builds the world again anyway).
  `interactable(spot, focus)` gives the world's prompt ("Read: Psalm 19:1") and the station view;
  `hits(raycaster)` and `open()` serve a tap.
- `verseStone(ctx, id, { look: 'night' | 'day', frame })`: a plinth and a tablet leaning back, for halls and
  wings. `versePlaque`: the same tablet on a wall. `skyVerse(ctx, id, { at, fits })`: faint words that turn
  to the camera, for the orbiting worlds; hidden where `fits()` says the screen has no room (by default a
  phone on its side), and then not tappable.
- The panel (`versePanel`): the passage as a quote (Panel.jsx's `verse` block, serif italic, poem lines
  kept), the reference and translation, and the `why` line. The orbiting worlds show panels since this
  (Hud.jsx renders `store.panel` when the world does not walk).
- `src/ui/VerseLine.jsx`: a passage inside a HUD card or a page (the quiz, the Atomlings).

## The verse in the Bible App (2026-10-31)

Every passage's panel ends with "📖 Read it in the Bible App": bible.com opened on that passage's verses,
in the translation the level quotes (`appUrl` in `index.js`: `https://www.bible.com/bible/<yv>/<BOOK.c.v>`,
the translation's own numbering), the Bible App itself on a phone that has it. The whole chapter is a tap
away there, with the app's pictures and plans for the verse. The user chose this over the chapter fetched
into the game (built first, the same day, then taken out): "going there, where you can read full chapter
and see their related media, is even better". A side effect: no chapter is copied into the game, and the
publishers allow quotations, not chapters.

bible.com shows a captcha to scripts from a machine that has fetched a lot from it (this one, after the
passages were fetched): a probe cannot open the links, a visitor's browser can.

## Adding a passage to a new place

1. A line in `passages.json`, then `py -3.11 scripts/data/fetch_verses.py`; read the eight texts.
2. Its `why` in `why.js`, four languages, both depths.
3. In the world: `verseStone` / `versePlaque` (walking worlds: add `verse.interactable()` to the
   interactables, `clickable(verse.group, () => verse.open())` where the world has taps, a solid for a
   stone, `verse.dispose()`), or `skyVerse` (orbiting: `face()` in the update, `hits(ray)` in the tap).
4. Its id in `PLACES` in `scripture.test.js`; `npm test`; look at it (`tools/shot.py`), on a phone too.

## Checks

- `src/content/scripture/scripture.test.js` (in `npm test`): every passage fetched as listed, all four
  languages at both depths from the right translation and chapter; nothing outside the 3D fonts; every
  place and all 118 halls with a passage; every `why` at both depths without dashes; references cited per
  language (Psalm 19:1, Psalm 19,2, Przysłów 27,17).
- The same test checks every panel's link to the Bible App (each passage, language and level).
- `tools/halls_probe.py` opens every hall's stone with the rest; `tools/hud_probe.py` for the orbiting
  worlds' layouts.

## Next

Not yet: the picture rooms (one passage each where a picture's subject has one), the Periodic Videos
rooms, the passport (passages read, as discoveries?). The studio's backlog has them.
