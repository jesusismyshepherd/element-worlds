"""Periodic Videos, seen by Claude: the element's video, its captions and contact sheets of its frames,
so the experiments in it can be rebuilt as things to do in the game (docs/knowledge/periodic-videos.md).

    py -3.11 tools/pv/pv.py list               the playlist (one video per element) -> cache/playlist.json
    py -3.11 tools/pv/pv.py fetch Na           the video (480p at most) and its English captions
    py -3.11 tools/pv/pv.py sheets Na [--every 2]   frames every N seconds -> sheet_1.jpg, ... with the time
                                                on each frame, and transcript.txt (captions with times)
    py -3.11 tools/pv/pv.py cuts Na             every cut (scene change), at its exact time, however short
                                                the shot -> cuts_1.jpg, ... and cuts.txt
    py -3.11 tools/pv/pv.py zoom Na 3:44 3:56 [--fps 6]   a moment frame by frame -> zoom_3m44.jpg

A fixed grid alone misses short shots (the bang that lasts a second) and puts a station's start up to a
grid step late: use the cuts for where each part starts (to the frame), the captions for where its words
start, the grid for change within a shot, and zoom for what an exhibit must copy exactly.

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


def clock(t, tenths=False):
    return f'{int(t // 60)}:{t % 60:04.1f}' if tenths else f'{int(t // 60)}:{int(t % 60):02d}'


def seconds(s):
    m, _, sec = s.partition(':')
    return int(m) * 60 + float(sec) if sec else float(m)


def contact(d, name, frames, cols=5, rows=6):
    """frames: [(path, label)] -> name_1.jpg, ... (30 to a sheet, the label on each)."""
    from PIL import Image, ImageDraw, ImageFont
    font = ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf', 18)
    outs = []
    for s in range(0, len(frames), cols * rows):
        chunk = frames[s:s + cols * rows]
        w, h = Image.open(chunk[0][0]).size
        sheet = Image.new('RGB', (cols * w, ((len(chunk) - 1) // cols + 1) * h), 'black')
        for i, (f, label) in enumerate(chunk):
            im = Image.open(f)
            ImageDraw.Draw(im).text((6, 4), label, fill='yellow', font=font, stroke_width=2, stroke_fill='black')
            sheet.paste(im, ((i % cols) * w, (i // cols) * h))
        out = d / f'{name}_{s // (cols * rows) + 1}.jpg'
        sheet.save(out, quality=85)
        outs.append(out)
        print(out)
    return outs


def fresh(folder):
    folder.mkdir(exist_ok=True)
    for f in folder.glob('*.jpg'):
        f.unlink()
    return folder


def cmd_sheets(symbol, every=2):
    d = CACHE / symbol
    frames = fresh(d / 'frames')
    subprocess.run(['ffmpeg', '-v', 'error', '-i', str(d / 'video.mp4'), '-vf', f'fps=1/{every},scale=384:-2',
                    '-q:v', '3', str(frames / 'f_%04d.jpg')], check=True)
    files = sorted(frames.glob('f_*.jpg'))
    contact(d, 'sheet', [(f, clock(i * every)) for i, f in enumerate(files)])
    (d / 'transcript.txt').write_text(transcript(d), encoding='utf8')
    print(d / 'transcript.txt')


def cmd_cuts(symbol, threshold=0.25):
    """Every shot change, with the frame just after it, at its exact time (showinfo's pts_time)."""
    d = CACHE / symbol
    frames = fresh(d / 'cuts')
    out = subprocess.run(['ffmpeg', '-hide_banner', '-i', str(d / 'video.mp4'), '-vf',
                          f"select='eq(n,0)+gt(scene,{threshold})',showinfo,scale=384:-2", '-vsync', 'vfr', '-q:v', '3',
                          str(frames / 'c_%04d.jpg')], capture_output=True, text=True, encoding='utf8', errors='replace')
    times = [float(m) for m in re.findall(r'pts_time:([\d.]+)', out.stderr)]
    files = sorted(frames.glob('c_*.jpg'))
    lines = [f'{clock(t, True)}  shot {i + 1}' + (f' ({clock(times[i + 1] - t, True)[2:]} s)' if i + 1 < len(times) else '')
             for i, t in enumerate(times)]
    (d / 'cuts.txt').write_text('\n'.join(lines), encoding='utf8')
    contact(d, 'cuts', [(f, clock(t, True)) for f, t in zip(files, times)])
    print(len(times), 'shots ->', d / 'cuts.txt')


def cmd_zoom(symbol, start, end, fps=6):
    d = CACHE / symbol
    a, b = seconds(start), seconds(end)
    frames = fresh(d / 'zoom')
    subprocess.run(['ffmpeg', '-v', 'error', '-ss', str(a), '-to', str(b), '-i', str(d / 'video.mp4'), '-vf',
                    f'fps={fps},scale=384:-2', '-q:v', '3', str(frames / 'z_%04d.jpg')], check=True)
    files = sorted(frames.glob('z_*.jpg'))
    contact(d, f'zoom_{int(a // 60)}m{int(a % 60):02d}', [(f, clock(a + i / fps, True)) for i, f in enumerate(files)])


if __name__ == '__main__':
    a = sys.argv[1:]
    if not a:
        sys.exit(__doc__)
    if a[0] == 'list':
        cmd_list()
    elif a[0] == 'fetch':
        cmd_fetch(a[1])
    elif a[0] == 'sheets':
        cmd_sheets(a[1], int(a[a.index('--every') + 1]) if '--every' in a else 2)
    elif a[0] == 'cuts':
        cmd_cuts(a[1])
    elif a[0] == 'zoom':
        cmd_zoom(a[1], a[2], a[3], int(a[a.index('--fps') + 1]) if '--fps' in a else 6)
    else:
        sys.exit(__doc__)
