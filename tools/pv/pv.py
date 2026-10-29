"""Periodic Videos, seen by Claude: the element's video, its captions and contact sheets of its frames,
so the experiments in it can be rebuilt as things to do in the game (docs/knowledge/periodic-videos.md).

    py -3.11 tools/pv/pv.py list               the playlist (one video per element) -> cache/playlist.json
    py -3.11 tools/pv/pv.py fetch Na           the video (480p at most) and its English captions
    py -3.11 tools/pv/pv.py sheets Na [--every 4]   frames every N seconds -> sheet_1.jpg, ... with the time
                                                on each frame, and transcript.txt (captions with times)

Everything goes to the cache OUTSIDE the repository (PV_CACHE, default D:/Family/Artur/pv-cache): the
videos are Periodic Videos' own (Brady Haran, University of Nottingham), looked at here only to design the
game's own versions of the experiments. Nothing from the cache is committed or published; players watch
the videos through YouTube's player.
"""
import json
import os
import re
import subprocess
import sys
from pathlib import Path

PLAYLIST = 'https://www.youtube.com/playlist?list=PL7A1F4CF36C085DE1'
CACHE = Path(os.environ.get('PV_CACHE', 'D:/Family/Artur/pv-cache'))
ROOT = Path(__file__).resolve().parents[2]


def elements():
    return json.loads((ROOT / 'src/data/elements.json').read_text(encoding='utf8'))


def playlist():
    p = CACHE / 'playlist.json'
    if not p.exists():
        sys.exit('run "pv.py list" first')
    return json.loads(p.read_text(encoding='utf8'))['entries']


def video_of(symbol):
    els = elements()
    els = els if isinstance(els, list) else els.get('elements', list(els.values()))
    el = next((e for e in els if e['symbol'] == symbol), None)
    if not el:
        sys.exit(f'no element {symbol}')
    name = el['name'] if isinstance(el['name'], str) else el['name'].get('en')
    # the playlist runs in the table's order; its titles start with the element's name
    entries = playlist()
    hit = next((x for x in entries if re.match(rf'\W*{re.escape(name)}\b', x['title'], re.I)), None)
    hit = hit or entries[el['z'] - 1]
    return el, hit


def cmd_list():
    CACHE.mkdir(parents=True, exist_ok=True)
    out = subprocess.run(['yt-dlp', '--flat-playlist', '-J', PLAYLIST], capture_output=True, text=True, encoding='utf8')
    if out.returncode:
        sys.exit(out.stderr[-500:])
    (CACHE / 'playlist.json').write_text(out.stdout, encoding='utf8')
    print(len(json.loads(out.stdout)['entries']), 'videos')


def cmd_fetch(symbol):
    el, v = video_of(symbol)
    d = CACHE / symbol
    d.mkdir(parents=True, exist_ok=True)
    url = f'https://www.youtube.com/watch?v={v["id"]}'
    print(symbol, v['title'], url)
    # captions: English only (a pattern such as "en.*" asks for every auto-translation and gets HTTP 429)
    subprocess.run(['yt-dlp', '-q', '--no-warnings', '--skip-download', '--write-subs', '--write-auto-subs',
                    '--sub-langs', 'en', '--sub-format', 'vtt', '-o', str(d / 'video.%(ext)s'), url])
    subprocess.run(['yt-dlp', '-q', '--no-warnings', '-f', 'bv*[height<=480]+ba/b[height<=480]',
                    '--merge-output-format', 'mp4', '-o', str(d / 'video.%(ext)s'), url])
    (d / 'video.json').write_text(json.dumps({'symbol': symbol, **v}, indent=2), encoding='utf8')


def transcript(d):
    vtt = next(iter(sorted(d.glob('video*.vtt'))), None)
    if not vtt:
        return ''
    lines, last = [], ''
    for block in vtt.read_text(encoding='utf8').split('\n\n'):
        m = re.search(r'(\d\d):(\d\d):(\d\d)\.\d+ -->', block)
        if not m:
            continue
        text = ' '.join(l for l in block.splitlines()[1:] if '-->' not in l)
        text = re.sub(r'<[^>]+>', '', text).strip()
        if text and text != last:
            t = int(m[1]) * 3600 + int(m[2]) * 60 + int(m[3])
            lines.append(f'{t // 60}:{t % 60:02d}  {text}')
            last = text
    return '\n'.join(lines)


def cmd_sheets(symbol, every=4):
    from PIL import Image, ImageDraw, ImageFont
    d = CACHE / symbol
    frames = d / 'frames'
    frames.mkdir(exist_ok=True)
    for f in frames.glob('*.jpg'):
        f.unlink()
    subprocess.run(['ffmpeg', '-v', 'error', '-i', str(d / 'video.mp4'), '-vf', f'fps=1/{every},scale=384:-2',
                    '-q:v', '3', str(frames / 'f_%04d.jpg')], check=True)
    files = sorted(frames.glob('f_*.jpg'))
    font = ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf', 18)
    cols, rows = 5, 6
    for s in range(0, len(files), cols * rows):
        chunk = files[s:s + cols * rows]
        w, h = Image.open(chunk[0]).size
        sheet = Image.new('RGB', (cols * w, ((len(chunk) - 1) // cols + 1) * h), 'black')
        for i, f in enumerate(chunk):
            im = Image.open(f)
            t = (s + i) * every
            ImageDraw.Draw(im).text((6, 4), f'{t // 60}:{t % 60:02d}', fill='yellow', font=font, stroke_width=2, stroke_fill='black')
            sheet.paste(im, ((i % cols) * w, (i // cols) * h))
        out = d / f'sheet_{s // (cols * rows) + 1}.jpg'
        sheet.save(out, quality=85)
        print(out)
    (d / 'transcript.txt').write_text(transcript(d), encoding='utf8')
    print(d / 'transcript.txt')


if __name__ == '__main__':
    a = sys.argv[1:]
    if not a:
        sys.exit(__doc__)
    if a[0] == 'list':
        cmd_list()
    elif a[0] == 'fetch':
        cmd_fetch(a[1])
    elif a[0] == 'sheets':
        cmd_sheets(a[1], int(a[a.index('--every') + 1]) if '--every' in a else 4)
    else:
        sys.exit(__doc__)
