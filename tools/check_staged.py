"""Does what is staged stand on its own? Exports git's index (the next commit, without anyone's unstaged or
untracked work) to a temporary folder, links node_modules into it, and runs the tests and a build there.
Use it before committing while other agents or sessions have unfinished work in the tree.

    python tools/check_staged.py
"""
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent


def main():
    tmp = Path(tempfile.mkdtemp(prefix='ew-staged-'))
    try:
        subprocess.run(['git', 'checkout-index', '-a', f'--prefix={tmp.as_posix()}/'], cwd=REPO, check=True)
        link = tmp / 'node_modules'
        if os.name == 'nt':
            subprocess.run(['cmd', '/c', 'mklink', '/J', str(link), str(REPO / 'node_modules')], check=True, capture_output=True)
        else:
            link.symlink_to(REPO / 'node_modules')
        npm = 'npm.cmd' if os.name == 'nt' else 'npm'
        npx = 'npx.cmd' if os.name == 'nt' else 'npx'
        test = subprocess.run([npm, 'test'], cwd=tmp, capture_output=True, text=True, encoding='utf-8', errors='replace')
        summary = [l for l in test.stdout.splitlines() if l.startswith(('ℹ pass', 'ℹ fail', '✖'))]
        print('\n'.join(summary[:12]) or test.stdout[-2000:])
        build = subprocess.run([npx, 'vite', 'build', '--outDir', str(tmp / 'dist')], cwd=tmp, capture_output=True, text=True, encoding='utf-8', errors='replace')
        print('build:', 'ok' if build.returncode == 0 else 'FAILED')
        if build.returncode:
            print(build.stdout[-3000:], build.stderr[-3000:])
        ok = test.returncode == 0 and build.returncode == 0
        print('staged state:', 'OK' if ok else 'BROKEN')
        sys.exit(0 if ok else 1)
    finally:
        # remove the junction first, so the cleanup never reaches into the real node_modules
        link = tmp / 'node_modules'
        if link.exists() or link.is_symlink():
            if os.name == 'nt':
                subprocess.run(['cmd', '/c', 'rmdir', str(link)], capture_output=True)
            else:
                link.unlink()
        shutil.rmtree(tmp, ignore_errors=True)


if __name__ == '__main__':
    main()
