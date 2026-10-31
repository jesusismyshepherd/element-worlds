"""Fill the studio's "built" cards with the tokens their agents used (the user, 2026-10-31: the cost of each
built feature in tokens).

    py -3.11 tools/studio_tokens.py          docs/studio/backlog.json updated in place (temp file, rename)

A built entry lists its agents' ids (`agents`: the ids the Agent tool returned, as in the worktree names
`agent-<id>`); this sums each one's transcript (tools/agent_tokens.py) into `tokens`: { total, output,
agents }. The main session's own tokens (planning, reviewing, merging) are not split by feature and are
not counted; entries without agents show "not recorded". An agent whose transcript is gone keeps the
totals already written.
"""
import json
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from agent_tokens import PROJECTS, usage_of  # noqa: E402

BACKLOG = Path(__file__).resolve().parents[1] / 'docs' / 'studio' / 'backlog.json'


def main():
    found = {}
    for sub in PROJECTS.glob('*/subagents/agent-*.jsonl'):
        found[sub.stem.removeprefix('agent-')] = usage_of(sub)[1]
    b = json.loads(BACKLOG.read_text(encoding='utf8'))
    changed = 0
    for e in b.get('built', []):
        ids = e.get('agents') or []
        if not ids:
            continue
        missing = [a for a in ids if a not in found]
        if missing:
            print('no transcript for', e['title'], missing)
            continue
        tot = {'total': sum(found[a]['total'] for a in ids), 'output': sum(found[a]['output'] for a in ids), 'agents': len(ids)}
        if e.get('tokens') != tot:
            e['tokens'] = tot
            changed += 1
        print(f"{e['title'][:60]:60} {tot['total'] / 1e6:7.1f} M  {tot['output'] / 1e6:5.2f} M written  {len(ids)} agents")
    text = json.dumps(b, indent=2, ensure_ascii=False) + '\n'
    json.loads(text)
    tmp = BACKLOG.with_name(BACKLOG.name + '.tmp')
    tmp.write_text(text, encoding='utf8')
    os.replace(tmp, BACKLOG)
    print(changed, 'entries updated')


if __name__ == '__main__':
    main()
