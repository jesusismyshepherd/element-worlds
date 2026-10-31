"""How many tokens each agent used, from Claude Code's session transcripts (the studio's "built" cards show
the totals; docs/knowledge/update-dashboard.md).

    py -3.11 tools/agent_tokens.py                 every agent of every session of this project, as JSON
    py -3.11 tools/agent_tokens.py --since 2026-10-30

A subagent's transcript is <session>/subagents/agent-<id>.jsonl beside its .meta.json (its description).
Each assistant message carries its usage; a message streamed in several parts repeats the same usage, so
messages are counted once by id. Total = fresh input + cache writes + cache reads + output. The main
session's own tokens (planning, reviewing, merging) are not split by feature and are left out.
"""
import argparse
import json
import sys
from pathlib import Path

PROJECTS = Path.home() / '.claude' / 'projects' / 'd--Family-Artur-element-worlds'


def usage_of(path):
    seen = {}
    first = None
    for line in path.open(encoding='utf8', errors='replace'):
        try:
            o = json.loads(line)
        except ValueError:
            continue
        first = first or o.get('timestamp')
        m = o.get('message') or {}
        u = m.get('usage')
        if m.get('role') != 'assistant' or not u:
            continue
        seen[m.get('id') or o.get('uuid')] = u
    tot = {'input': 0, 'cache_write': 0, 'cache_read': 0, 'output': 0}
    for u in seen.values():
        tot['input'] += u.get('input_tokens', 0) or 0
        tot['cache_write'] += u.get('cache_creation_input_tokens', 0) or 0
        tot['cache_read'] += u.get('cache_read_input_tokens', 0) or 0
        tot['output'] += u.get('output_tokens', 0) or 0
    tot['total'] = sum(tot.values())
    return first, tot


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--since', default='')
    a = ap.parse_args()
    out = []
    for sub in sorted(PROJECTS.glob('*/subagents/agent-*.jsonl')):
        meta = sub.with_suffix('.meta.json')
        desc = ''
        if meta.exists():
            try:
                desc = json.loads(meta.read_text(encoding='utf8')).get('description', '')
            except ValueError:
                pass
        first, tot = usage_of(sub)
        if a.since and (first or '') < a.since:
            continue
        out.append({'agent': sub.stem.removeprefix('agent-'), 'session': sub.parent.parent.name, 'started': first,
                    'description': desc, **tot})
    json.dump(out, sys.stdout, indent=1)


if __name__ == '__main__':
    main()
