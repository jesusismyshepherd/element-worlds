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

## Checking

- `npm test` (the words modules' tests compare shapes across languages; the content test checks every
  language present: no em dashes, both depths where English has them, lists as lists).
- `node -e "import('./src/.../file.js').then(m => console.log(Object.keys(m)))"` loads a module alone.
- Look in the browser with `?lang=pl` or `?lang=de` (`tools/shot.py <path> --lang pl`), when no one else
  is editing the files the dev server serves (each save reloads the page under a probe).
