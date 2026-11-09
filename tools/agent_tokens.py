"""What each agent and each session used, from Claude Code's session transcripts: tokens of each kind, the
model and effort of every request, wall time, and the list-price cost in US dollars (the studio's "What it
cost" and its built cards; docs/knowledge/update-dashboard.md, "What it cost").

    py -3.11 tools/agent_tokens.py                 every agent of every session of this project, as JSON
    py -3.11 tools/agent_tokens.py --since 2026-10-30
    py -3.11 tools/agent_tokens.py --sessions      the main sessions instead of the agents

A subagent's transcript is <session>/subagents/agent-<id>.jsonl beside its .meta.json (its description); a
main session's is <session>.jsonl. Each assistant message carries its usage, `model`, `effort` and
`usage.speed`; a message streamed in several parts repeats the same usage, so messages are counted once by
id. Total tokens = fresh input + cache writes + cache reads + output. Cost uses PRICES (list prices per
million tokens, from the claude-api skill on 2026-10-31): cache writes cost 1.25x input for the 5-minute
cache and 2x for the 1-hour one, fast mode doubles everything. The user's plan is billed differently;
these dollars are a measure for comparing models and effort levels, not the bill.
"""
import argparse
import json
import sys
from datetime import datetime
from pathlib import Path

IDLE_MIN = 10
PROJECTS = Path.home() / '.claude' / 'projects' / 'd--Family-Artur-element-worlds'

# $ per million tokens: input, output, cache read. Cache writes: 1.25x input (5 min), 2x input (1 h).
PRICES = {
    'claude-fable-5-1': (10.0, 50.0, 0.25),
    'claude-opus-5-5': (4.0, 20.0, 0.20),
    'claude-sonnet-5-5': (2.0, 10.0, 0.20),
    'claude-haiku-5-5': (0.10, 0.50, 0.01),
}
HAIKU_LONG = (0.50, 2.50, 0.05)  # Haiku 5.5 above 100K prompt tokens
NAMES = {'claude-fable-5-1': 'Fable 5.1', 'claude-opus-5-5': 'Opus 5.5', 'claude-sonnet-5-5': 'Sonnet 5.5',
         'claude-haiku-5-5': 'Haiku 5.5'}


def cost(r):
    """List-price dollars of one request record (see requests_of)."""
    p = PRICES.get(r['model'])
    if p is None:
        return None
    if r['model'] == 'claude-haiku-5-5' and r['input'] + r['cw5'] + r['cw1'] + r['cr'] > 100_000:
        p = HAIKU_LONG
    pin, pout, pread = p
    usd = (r['input'] * pin + r['cw5'] * pin * 1.25 + r['cw1'] * pin * 2 + r['cr'] * pread + r['output'] * pout) / 1e6
    return usd * (2 if r['speed'] == 'fast' else 1)


def requests_of(path):
    """One record per API request in a transcript, in order: ts, model, effort, speed, the token kinds, usd.
    Also returns the transcript's lines that hold tool calls (for finding when a task was finished)."""
    seen = {}
    for line in path.open(encoding='utf8', errors='replace'):
        try:
            o = json.loads(line)
        except ValueError:
            continue
        m = o.get('message') or {}
        u = m.get('usage')
        if o.get('type') != 'assistant' or m.get('role') != 'assistant' or not u or m.get('model') == '<synthetic>':
            continue
        cc = u.get('cache_creation') or {}
        cw = u.get('cache_creation_input_tokens', 0) or 0
        cw1 = cc.get('ephemeral_1h_input_tokens', 0) or 0
        r = {'id': m.get('id') or o.get('uuid'), 'ts': o.get('timestamp'), 'model': m.get('model'),
             'effort': o.get('effort') or '', 'speed': u.get('speed') or 'standard',
             'input': u.get('input_tokens', 0) or 0, 'cw5': cw - cw1, 'cw1': cw1,
             'cr': u.get('cache_read_input_tokens', 0) or 0, 'output': u.get('output_tokens', 0) or 0}
        r['usd'] = cost(r)
        seen[r['id']] = r
    return sorted(seen.values(), key=lambda r: r['ts'] or '')


def working_minutes(ts):
    """Minutes of work in sorted ISO timestamps: the gaps between requests, leaving out pauses over
    IDLE_MIN (waiting for the user, a night). Agents running side by side count once."""
    secs, prev = 0, None
    for s in ts:
        t = datetime.fromisoformat(s.replace('Z', '+00:00'))
        if prev and (t - prev).total_seconds() <= IDLE_MIN * 60:
            secs += (t - prev).total_seconds()
        prev = t
    return round(secs / 60)


def summarize(recs):
    """Totals of a list of request records: tokens by kind, requests, wall minutes, usd, and the share of
    cost by model and effort ("configs")."""
    t = {'input': 0, 'cache_write': 0, 'cache_read': 0, 'output': 0, 'requests': len(recs), 'usd': 0.0}
    cfg = {}
    for r in recs:
        t['input'] += r['input']
        t['cache_write'] += r['cw5'] + r['cw1']
        t['cache_read'] += r['cr']
        t['output'] += r['output']
        t['usd'] += r['usd'] or 0
        k = (r['model'], r['effort'])
        cfg[k] = cfg.get(k, 0) + (r['usd'] or 0)
    t['total'] = t['input'] + t['cache_write'] + t['cache_read'] + t['output']
    ts = sorted(r['ts'] for r in recs if r['ts'])
    t['start'], t['end'] = (ts[0], ts[-1]) if ts else (None, None)
    t['minutes'] = working_minutes(ts)
    t['configs'] = [{'model': m, 'effort': e, 'usd': round(v, 4)} for (m, e), v in sorted(cfg.items(), key=lambda kv: -kv[1])]
    t['usd'] = round(t['usd'], 4)
    return t


def usage_of(path):
    """(first timestamp, totals) of one transcript."""
    s = summarize(requests_of(path))
    return s['start'], s


def agents():
    for sub in sorted(PROJECTS.glob('*/subagents/agent-*.jsonl')):
        meta = sub.with_suffix('.meta.json')
        desc = ''
        if meta.exists():
            try:
                desc = json.loads(meta.read_text(encoding='utf8')).get('description', '')
            except ValueError:
                pass
        yield sub.stem.removeprefix('agent-'), sub.parent.parent.name, desc, sub
    # builders delegated to a checkout of their own (T3's delegate_task, isolation 'worktree', 2026-11-09): each
    # is a whole session in that checkout's project folder, named by its session id, and its own subagents
    for proj in sorted(PROJECTS.parent.glob('C--Users-admin--t3-worktrees-element-worlds-*')):
        for f in sorted(proj.glob('*.jsonl')):
            yield f.stem, f.stem, f'delegated session ({proj.name.rsplit("-", 2)[-1]})', f
            for sub in sorted((proj / f.stem / 'subagents').glob('agent-*.jsonl')):
                yield sub.stem.removeprefix('agent-'), f.stem, 'its subagent', sub


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--since', default='')
    ap.add_argument('--sessions', action='store_true')
    a = ap.parse_args()
    out = []
    if a.sessions:
        for f in sorted(PROJECTS.glob('*.jsonl')):
            first, tot = usage_of(f)
            if a.since and (first or '') < a.since:
                continue
            out.append({'session': f.stem, 'started': first, **tot})
    else:
        for aid, session, desc, sub in agents():
            first, tot = usage_of(sub)
            if a.since and (first or '') < a.since:
                continue
            out.append({'agent': aid, 'session': session, 'started': first, 'description': desc, **tot})
    json.dump(out, sys.stdout, indent=1)


if __name__ == '__main__':
    main()
