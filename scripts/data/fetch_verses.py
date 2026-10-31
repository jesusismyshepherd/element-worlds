"""The Bible passages placed through the worlds (src/content/scripture/), word for word from the Bible
App (bible.com), in the eight translations the site quotes: Explorer and Scientist in each language.

    py -3.11 scripts/data/fetch_verses.py            (fetches what is missing, writes verses.json)
    py -3.11 scripts/data/fetch_verses.py --all      (fetches every passage again)
    py -3.11 scripts/data/fetch_verses.py --show PSA.19.1   (prints one reference in all eight)

Reads src/content/scripture/passages.json ({ id: { ref, heb? } }) and writes verses.json beside it
({ id: { <lang>: { kid: { text, ref, v }, sci: {...} } } }). Chapter pages are cached in
scripts/data/.verses-cache/ (git-ignored: whole chapters are not ours to publish; the site quotes
single verses, within each publisher's permission). docs/knowledge/scripture.md says how to add one.

Psalm numbering: Bibles that number a psalm's title as verse 1 (the Hebrew way: BPT09, SNP, BW1975,
HFA, SCH2000) put the same words one verse later. A passage from such a psalm says `heb: 1`; the
script prints every text so the match can be read before it is kept.
"""
import json
import os
import re
import sys
import time
import urllib.request
from html.parser import HTMLParser

ROOT = os.path.join(os.path.dirname(__file__), '..', '..')
DIR = os.path.join(ROOT, 'src', 'content', 'scripture')
CACHE = os.path.join(os.path.dirname(__file__), '.verses-cache')

# the Bible App's numbers for each translation
VERSIONS = {'NLT': 116, 'CSB': 1713, 'BPT09': 432, 'ARC': 215, 'SNP': 2095, 'BW1975': 3490, 'HFA': 73, 'SCH2000': 157}
# Explorer (kid) and Scientist (sci) in each of the site's languages
PAIRS = {'en': ('NLT', 'CSB'), 'pt-pt': ('BPT09', 'ARC'), 'pl': ('SNP', 'BW1975'), 'de': ('HFA', 'SCH2000')}
HEBREW_PSALMS = {'BPT09', 'SNP', 'BW1975', 'HFA', 'SCH2000'}


class Chapter(HTMLParser):
    """The verses of one chapter page: the text inside each verse's content spans, without verse
    numbers, notes (and the commas between their marks) or headings; the divine name in small capitals
    (LORD, SENHOR) in capitals; a space where a line of poetry ends. Verses a translation joins into one
    (HFA's "GEN.9.12+GEN.9.13") are kept under the joined key."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = []  # (tag, classes, verse) for each open element
        self.verses = {}
        self.line = False  # a new line (a block) began since the last words

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        classes = (a.get('class') or '').split()
        verse = a.get('data-usfm') if any(c.endswith('_verse') for c in classes) else None
        if tag in ('br', 'img', 'meta', 'link', 'input', 'hr'):
            self.line = self.line or ' '
            return
        if tag == 'div':
            # a line of poetry (q, q1, q2, qc...) starts on a line of its own; a paragraph runs on
            self.line = '\n' if any(re.search(r'_q[a-z]?\d?$', c) for c in classes) else ' '
        self.stack.append((tag, classes, verse))

    def handle_endtag(self, tag):
        # pop to the matching tag (the pages are well formed; this keeps a stray end tag harmless)
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i][0] == tag:
                del self.stack[i:]
                return

    def handle_data(self, data):
        verse = None
        content = upper = False
        for _, classes, v in self.stack:
            if any(c.endswith(('_note', '_label', '_heading')) or c == 'sup' for c in classes):
                return
            if v:
                verse = v
            if any(c.endswith('_content') for c in classes):
                content = True
            if any(c.endswith('_nd') for c in classes):
                upper = True
        if verse and content:
            parts = self.verses.setdefault(verse, [])
            if not data.strip():
                # the spaces round a note are spans of their own
                if parts:
                    parts.append(' ')
                return
            if self.line and parts:
                parts.append(self.line)
            self.line = False
            parts.append(data.upper() if upper else data)

    def result(self):
        return {k: lines(''.join(v)) for k, v in self.verses.items()}


def lines(t):
    """Spaces as one space, poetry's line ends kept (one per line), the Hebrew letters over an acrostic's
    verses (SNP's Lamentations) left out."""
    t = re.sub(r'[֐-׿]', '', t.replace(' ', ' '))
    t = re.sub(r'[ \t]+', ' ', t)
    t = re.sub(r' *\n[\s]*', '\n', t)
    return t.strip()


def chapter(version, book, ch, refresh=False):
    os.makedirs(CACHE, exist_ok=True)
    path = os.path.join(CACHE, f'{version}.{book}.{ch}.html')
    if refresh or not os.path.exists(path):
        url = f'https://www.bible.com/bible/{VERSIONS[version]}/{book}.{ch}'
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (element-worlds; a few verses)'})
        html = urllib.request.urlopen(req, timeout=40).read().decode('utf-8')
        tmp = path + '.tmp'
        with open(tmp, 'w', encoding='utf-8') as f:
            f.write(html)
        os.replace(tmp, path)
        time.sleep(1.2)  # gently
    with open(path, encoding='utf-8') as f:
        p = Chapter()
        p.feed(f.read())
    return p.result()


def parse_ref(ref):
    """'PSA.139.17-18' -> ('PSA', 139, [17, 18])"""
    book, ch, vs = ref.split('.')
    a, _, b = vs.partition('-')
    return book, int(ch), list(range(int(a), int(b or a) + 1))


def tidy(text, first):
    # a chapter's first word set in capitals (ARC: "OS céus") is a printing habit, not the text
    if first:
        text = re.sub(r'^([A-ZÁÉÍÓÚÂÊÔÃÕÇ])([A-ZÁÉÍÓÚÂÊÔÃÕÇ]+)\b(?=\s+[a-záéíóúâêôãõç])',
                      lambda m: m.group(1) + m.group(2).lower(), text)
    return text


# speech marks: an opening one whose speech goes on past the passage, or a closing one whose speech
# began before it, is dropped (Jesus' words in Matthew 5 open with “ and close verses later). German
# »…« and Portuguese «…» use the same marks the other way round; ’ is also the apostrophe.
OPEN = {'“': '”', '‘': '’', '«': '»', '»': '«', '„': '“”'}
MARKS = set(OPEN) | {'”', '’'}


def balance(text):
    stack, drop = [], set()
    for i, c in enumerate(text):
        if c not in MARKS:
            continue
        if stack and c in OPEN[text[stack[-1]]]:
            stack.pop()
        elif c in OPEN:
            stack.append(i)
        elif c != '’':
            drop.add(i)
    drop |= set(stack)
    return lines(''.join(c for i, c in enumerate(text) if i not in drop))


def whole(text):
    """A passage that is part of a longer sentence shows it: an ellipsis before words that start in
    lower case, and in place of a comma, semicolon or colon it stops at."""
    if text[:1].islower():
        text = '…' + text
    if text[-1:] in ',;:':
        text = text[:-1].rstrip() + '…'
    return text


def fetch(spec, version, refresh=False):
    book, ch, vs = parse_ref(spec['ref'])
    if book == 'PSA' and version in HEBREW_PSALMS:
        vs = [v + spec.get('heb', 0) for v in vs]
    verses = chapter(version, book, ch, refresh)
    parts = []
    first, last = vs[0], vs[-1]
    for v in vs:
        key = f'{book}.{ch}.{v}'
        t = verses.get(key)
        if t is None:
            # joined with its neighbours in this translation: the joined text, and the reference grows
            joined = next((k for k in verses if key in k.split('+')), None)
            if not joined:
                raise SystemExit(f'{version} {key}: no text (numbered differently?)')
            nums = [int(k.split('.')[2]) for k in joined.split('+')]
            first, last = min(first, nums[0]), max(last, nums[-1])
            t = verses[joined]
            if parts and parts[-1] == t:
                continue
        parts.append(tidy(t, v == 1))
    v = f'{first}' if first == last else f'{first}-{last}'
    # verses of a poem follow each other line by line, a prose passage's run on
    poem = any('\n' in t for t in parts)
    text = whole(balance(('\n' if poem else ' ').join(parts)))
    return {'text': text, 'ref': f'{book}.{ch}.{v}', 'v': version}


def main():
    sys.stdout.reconfigure(encoding='utf-8')
    args = sys.argv[1:]
    if args[:1] == ['--show']:
        for lang, pair in PAIRS.items():
            for version in pair:
                print(f'{lang} {version}: {fetch({"ref": args[1], "heb": int(args[2]) if len(args) > 2 else 0}, version)["text"]}')
        return
    refresh = '--all' in args
    with open(os.path.join(DIR, 'passages.json'), encoding='utf-8') as f:
        passages = json.load(f)
    out_path = os.path.join(DIR, 'verses.json')
    old = {}
    if os.path.exists(out_path):
        with open(out_path, encoding='utf-8') as f:
            old = json.load(f)
    out = {}
    for pid, spec in passages.items():
        keep = old.get(pid)
        if keep and not refresh and all(keep.get(lang, {}).get(d, {}).get('ref', '').split('.')[:2] == spec['ref'].split('.')[:2]
                                        for lang in PAIRS for d in ('kid', 'sci')) and keep.get('_ref') == spec['ref'] and keep.get('_heb', 0) == spec.get('heb', 0):
            out[pid] = keep
            continue
        entry = {'_ref': spec['ref'], '_heb': spec.get('heb', 0)}
        for lang, (kid, sci) in PAIRS.items():
            entry[lang] = {'kid': fetch(spec, kid, refresh), 'sci': fetch(spec, sci, refresh)}
        out[pid] = entry
        print(f'== {pid} ({spec["ref"]})')
        for lang in PAIRS:
            for d in ('kid', 'sci'):
                e = entry[lang][d]
                print(f'  {lang} {d} {e["v"]} {e["ref"]}: {e["text"]}')
    text = json.dumps(out, ensure_ascii=False, indent=1) + '\n'
    tmp = out_path + '.tmp'
    with open(tmp, 'w', encoding='utf-8') as f:
        f.write(text)
    os.replace(tmp, out_path)
    print(f'{len(out)} passages -> {os.path.relpath(out_path, ROOT)}')


if __name__ == '__main__':
    main()
