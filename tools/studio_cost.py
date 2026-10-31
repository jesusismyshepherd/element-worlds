"""Fill the studio's "built" cards with what each cost (the user, 2026-10-31: see how cost-effective each
model and effort level is, per task; docs/knowledge/update-dashboard.md, "What it cost").

    py -3.11 tools/studio_cost.py            docs/studio/backlog.json updated in place (temp file, rename)
    py -3.11 tools/studio_cost.py --dry      print only

For each built entry, `tokens` gets:
- its agents (`agents`: the ids the Agent tool returned): each one's model and effort, tokens by kind,
  requests, working minutes and list-price dollars (tools/agent_tokens.py);
- its share of the main session: everything the session that finished it did since it last finished a
  task (planning, briefing, reviewing, merging, the studio routine). A task is finished at the moment its
  card was written into backlog.json's `built` (found in the session's tool calls); cards written in one
  edit share that stretch equally. Session time after the last card is left over (`overhead` in
  backlog.json's `cost`).
- totals: `total`, `output`, `agents` (the family studio reads these), `usd`, `requests`, `minutes`
  (working time: pauses over 10 minutes left out, agents side by side counted once), `configs` (dollars by model and effort).
Entries built before the transcripts kept (before 2026-10-29) stay "not recorded". `size`, `revisions`
are written by hand; the rating comes from the studio's database.
"""
import argparse
import json
import os
import re
import sys
from datetime import datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from agent_tokens import PROJECTS, agents, requests_of, summarize  # noqa: E402

BACKLOG = Path(__file__).resolve().parents[1] / 'docs' / 'studio' / 'backlog.json'


def finishes(path, titles):
    """{title: timestamp} of the moments this main session wrote a built card: a tool call about the backlog
    (an Edit of it, or a script that changes it) with the title followed closely by its "what". Backslashes
    are dropped first, so JSON and JavaScript strings (`Iron\\'s`) read alike."""
    pats = {t: re.compile(re.escape(t) + r'["\'`].{0,10}what', re.S) for t in titles}
    found = {}
    for line in path.open(encoding='utf8', errors='replace'):
        if 'backlog' not in line or '"tool_use"' not in line:
            continue
        try:
            o = json.loads(line)
        except ValueError:
            continue
        for c in (o.get('message') or {}).get('content') or []:
            if not isinstance(c, dict) or c.get('type') != 'tool_use':
                continue
            inp = c.get('input') or {}
            new = '\n'.join(str(inp.get(k, '')) for k in ('new_string', 'content', 'command')).replace('\\', '')
            old = str(inp.get('old_string', '')).replace('\\', '')
            if 'backlog' not in (str(inp.get('file_path', '')) + new):
                continue
            hits = [t for t, p in pats.items() if t not in found and p.search(new) and not p.search(old)]
            if 0 < len(hits) <= 4:  # more at once is the studio's first writing (2026-10-29), not a finish
                for t in hits:
                    found[t] = o.get('timestamp')
    return found


def slim(s):
    return {k: s[k] for k in ('usd', 'requests', 'input', 'cache_write', 'cache_read', 'output', 'configs')}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--dry', action='store_true')
    a = ap.parse_args()
    b = json.loads(BACKLOG.read_text(encoding='utf8'))
    built = b.get('built', [])
    titles = [e['title'] for e in built]

    # the main sessions: which cards each finished, and its requests split into the stretches before them
    main_share, overhead, done_at = {}, [], {}
    for f in sorted(PROJECTS.glob('*.jsonl')):
        recs = requests_of(f)
        fin = finishes(f, titles)
        moments = sorted(set(fin.values()))
        prev = ''
        for m in moments:
            stretch = [r for r in recs if prev < (r['ts'] or '') <= m]
            cards = [t for t, ts in fin.items() if ts == m]
            for t in cards:
                share = [dict(r, usd=(r['usd'] or 0) / len(cards), **{k: r[k] / len(cards) for k in ('input', 'cw5', 'cw1', 'cr', 'output')}) for r in stretch]
                main_share[t] = (f.stem, share)
                done_at[t] = m
            prev = m
        overhead += [r for r in recs if (r['ts'] or '') > prev]

    found = {aid: (desc, requests_of(sub)) for aid, _s, desc, sub in agents()}
    changed = 0
    for e in built:
        if e['date'] < '2026-10-29':  # no transcripts from before
            continue
        ids = e.get('agents') or []
        missing = [x for x in ids if x not in found]
        if missing:
            print('no transcript for', e['title'], missing, '(totals kept)')
            continue
        per_agent, all_recs = [], []
        for x in ids:
            desc, recs = found[x]
            s = summarize(recs)
            per_agent.append({'id': x, 'what': desc, 'minutes': s['minutes'], **slim(s)})
            all_recs += recs
        main = main_share.get(e['title'])
        if main:
            all_recs += main[1]
        if not all_recs:
            continue
        s = summarize(all_recs)
        tok = {'total': round(s['total']), 'output': round(s['output']), 'agents': len(ids), 'usd': round(s['usd'], 2),
               'requests': s['requests'], 'minutes': s['minutes'],
               'input': round(s['input']), 'cache_write': round(s['cache_write']), 'cache_read': round(s['cache_read']),
               'configs': s['configs'], 'per_agent': per_agent}
        if main:
            ms = summarize(main[1])
            tok['main'] = {'session': main[0][:8], **{k: (round(v) if isinstance(v, float) and k != 'usd' else v) for k, v in slim(ms).items()}}
            tok['main']['usd'] = round(ms['usd'], 2)
        if e.get('tokens') != tok:
            e['tokens'] = tok
            changed += 1
        print(f"{e['title'][:52]:52} ${tok['usd']:7.2f}  {tok['requests']:4} req  {tok['minutes']:5} min  agents {len(ids)}  main {'$%.2f' % tok['main']['usd'] if main else '-'}")

    ov = summarize(overhead)
    trial = (b.get('cost') or {}).get('trial')  # written by hand: the next comparison of models
    b['cost'] = {'updated': datetime.now().strftime('%Y-%m-%d'), 'since': '2026-10-29',
                 'overhead': {'usd': round(ov['usd'], 2), 'requests': ov['requests']},
                 'prices': 'list prices per million tokens on 2026-10-31 (claude-api skill): Opus 5.5 $4 in / $20 out, Sonnet 5.5 $2 / $10, Haiku 5.5 $0.10 / $0.50, Fable 5.1 $10 / $50; cache reads $0.20 (Fable $0.25, Haiku $0.01), cache writes 1.25x input (5 min) or 2x (1 h)'}
    if trial:
        b['cost']['trial'] = trial
    print(f"left over in the sessions (after their last card): ${ov['usd']:.2f}, {ov['requests']} requests")
    if a.dry:
        return
    text = json.dumps(b, indent=2, ensure_ascii=False) + '\n'
    json.loads(text)
    tmp = BACKLOG.with_name(BACKLOG.name + '.tmp')
    tmp.write_text(text, encoding='utf8')
    os.replace(tmp, BACKLOG)
    print(changed, 'entries updated')


if __name__ == '__main__':
    main()
