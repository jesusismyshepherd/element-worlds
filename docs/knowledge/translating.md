# Translating (Polish and German, 2026-10-28; any language after them)

The site speaks European Portuguese, English, Polish and German (`src/i18n/langs.js`). The user asked
for Polish and German on 2026-10-28. Every text exists at two depths: `kid` (Explorer: a curious
ten-year-old, plain words, warm) and `sci` (Scientist: an adult who likes the real terms, numbers with
units, names and dates).

## Where the words are

- The interface: `src/i18n/locales/<code>.json` (i18next keys; English is `en.json`).
- Everything else keeps its words in objects by language code, next to the code that shows them:
  `{ en: ..., 'pt-pt': ..., pl: ..., de: ... }`, or a words module with `const EN = {...}`, `const PT =
  {...}` and `WORDS = { en: EN, 'pt-pt': PT, pl: PL, de: DE }`. A text missing in a language falls back to
  English (`inLang`, `WORDS[lang] ?? EN`), so a half-done language still reads, but finish what you start.
- The elements' own stories: `src/content/<Symbol>.js`, each field `{ en: { kid, sci }, 'pt-pt': {...} }`;
  add `pl` and `de` after `'pt-pt'`, with the same depths and, for `uses` and `facts`, lists of the same
  length.

## The rules

- Translate from the English; read the Portuguese beside it for nuance. Keep every fact, number, unit,
  date, name and symbol exactly; never add or drop a claim.
- Numbers: a decimal comma in Polish and German (1,1°; 0,246 nm); a space between a number and its unit
  (13 nm, 20 °C) except ° for angles and %. Large numbers as written in the source (keep their meaning).
- Element names: `src/data/elements.json` `name.pl` / `name.de` (Polish as the Polish Chemical Society
  names them, German as the GDCh: Silicium, Caesium, Iod, Bismut). In Polish running text element names
  are lowercase and inflected (węgiel, węgla, węglem; tlen, tlenu); in German they are nouns, capitalised,
  with their article where the sentence needs one (der Kohlenstoff, das Helium, das Iod).
- Address the reader informally: Polish "ty" (Zobacz, Spróbuj), German "du" (Schau, Probier). Atomlings
  speak in the first person and are friendly.
- Quotation marks: Polish „…”, German „…“. No em dashes anywhere (—), and no en dash used as a pause:
  use a comma, a colon, a semicolon or parentheses. A hyphen inside a compound is fine.
- Words in functions (template literals with counts) need real plural forms: Polish has one / few / many
  (1 proton, 2 protony, 5 protonów; 12 to 14 are "many"; 22 to 24 "few"), German one / other. Use
  `new Intl.PluralRules('pl')` or write the three forms out; never "proton(y)".
- Text drawn in 3D or on canvases: the 3D fonts carry every Polish and German letter
  (`tools/make_fonts.py`); keep lines about as long as the English (signs have little room).
- Do not change the English or the Portuguese, the keys, or any code beyond what a language needs
  (a branch that picks "Portuguese or English" in code becomes a table by language).

## Decisions (2026-10-28, from the first pass)

- The Atomlings: Polish "Atomek" (plural "Atomki"), German "der Atomling" ("die Atomlinge").
- An Atomling introduces itself by its name, as a character: Polish "Cześć! Jestem Węgiel." (capitalised,
  nominative; elsewhere names are lowercase and inflected), German "Ich bin der Kohlenstoff."
- Prompts read "<verb>: <label>": informal imperatives (Polish Zobacz, Porozmawiaj; German Betrachte,
  Sprich mit), the label in the case its verb takes. "Talk to": Porozmawiaj / Sprich mit.
- Shared terms: hall sala / Halle, panel tablica / Tafel, the periodic table układ okresowy /
  Periodensystem, the Atom Forge Kuźnia Atomów / Atomschmiede.
- German nouns keep their capital: code that lowercases an element's name inside a sentence skips
  German (`nameCase` in the noble words, the stations, the quiz's answer line).
- Polish avoids gendered past forms of "you" (zrobiłeś / zrobiłaś): impersonal or present forms.
- Greetings open with "Cześć!" / "Hallo!" (or the comma form after the English "Hi, I'm X"); the content
  test checks every Polish and German greeting introduces the Atomling by its name.
- The way back from a wing: "Powrót do sali: Węgiel" / "Zurück zur Halle: Kohlenstoff"; the hall's exit:
  "Do układu okresowego" / "Zum Periodensystem". Other shared words: German Cousin (not Vetter),
  Exponat; Polish fluorowiec for a halogen.
- Discoverers and places (English in elements.json) are translated in `src/data/discovery.js`.
- Numbers: no separator in four digits (3550 °C) in any language (`useGrouping: 'min2'`), a real minus.

## The quiz in Polish and German

`src/game/quiz.js` hides the element's name also when inflected (Polish węgla, węglem, w węglu;
German Kohlenstoffs, Kohlenstoffatom) and keeps each language's symbols that are ordinary words
(Polish i, w, o, u, na, po, co, ta, ni, te, no; German In, Am, Es, Er); `quiz.test.js` has the cases.

## Checking

- `npm test` (the words modules' tests compare shapes across languages; the content test checks every
  language present: no em dashes, both depths where English has them, lists as lists).
- `node -e "import('./src/.../file.js').then(m => console.log(Object.keys(m)))"` loads a module alone.
- `node tools/check_locales.mjs <repo>`: the interface files against en.json (keys, order, placeholders,
  plural families: Polish one/few/many/other, German one/other).
- `tools/halls_probe.py` reads every hall in every language; a world writes its words when built, so a
  probe that changes language must wait for the rebuild (it read every hall in one language until
  2026-10-28). With agents editing files, probe a separate build (`npx vite build --outDir <scratch>`,
  `npx vite preview --outDir <scratch> --port 5317`, `--port 5317`).
- Look in the browser with `?lang=pl` or `?lang=de` (`tools/shot.py <path> --lang pl`), when no one else
  is editing the files the dev server serves (each save reloads the page under a probe).
