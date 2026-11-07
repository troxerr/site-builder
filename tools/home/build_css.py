"""Rebuilds a hand-edited page's inline Tailwind CSS after you change its classes.
Run from the repo root: python3 -I tools/home/build_css.py [page]   (default index.html; also used for dental/index.html)
Needs Node; it fetches tailwindcss@3.4.17 with npx."""
import os, re, subprocess, sys, tempfile

# Use the Tailwind pinned in package-lock.json when installed (reproducible output); otherwise fetch it with npx
_local = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "node_modules", ".bin", "tailwindcss")
TAILWIND = [_local] if os.path.exists(_local) else ["npx", "--yes", "tailwindcss@3.4.17"]

PAGE = sys.argv[1] if len(sys.argv) > 1 else "index.html"
page = open(PAGE, encoding="utf8").read()
m = re.search(r"(<style>\n)(.*?)(\n</style>)", page, re.S)
with tempfile.TemporaryDirectory() as d:
    scan, out = os.path.join(d, "page.html"), os.path.join(d, "out.css")
    open(scan, "w", encoding="utf8").write(page[:m.start(2)] + page[m.end(2):])  # don't scan the old CSS
    here = os.path.dirname(os.path.abspath(__file__))
    subprocess.run([*TAILWIND, "-c", os.path.join(here, "tailwind.config.js"),
                    "-i", os.path.join(here, "in.css"), "-o", out, "--minify"],
                   check=True, env={**os.environ, "HOME_HTML": scan})
    css = open(out, encoding="utf8").read().strip()
open(PAGE, "w", encoding="utf8").write(page[:m.start(2)] + css + page[m.end(2):])
print(PAGE, "CSS rebuilt:", len(css), "bytes")
