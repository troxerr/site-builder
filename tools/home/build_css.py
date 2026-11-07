"""Rebuilds the homepage's inline CSS after you change classes in index.html.
Run from the repo root: python3 -I tools/home/build_css.py   (needs Node; it fetches tailwindcss@3.4.17 with npx)"""
import os, re, subprocess, tempfile

page = open("index.html", encoding="utf8").read()
m = re.search(r"(<style>\n)(.*?)(\n</style>)", page, re.S)
with tempfile.TemporaryDirectory() as d:
    scan, out = os.path.join(d, "page.html"), os.path.join(d, "out.css")
    open(scan, "w", encoding="utf8").write(page[:m.start(2)] + page[m.end(2):])  # don't scan the old CSS
    here = os.path.dirname(os.path.abspath(__file__))
    subprocess.run(["npx", "--yes", "tailwindcss@3.4.17", "-c", os.path.join(here, "tailwind.config.js"),
                    "-i", os.path.join(here, "in.css"), "-o", out, "--minify"],
                   check=True, env={**os.environ, "HOME_HTML": scan})
    css = open(out, encoding="utf8").read().strip()
open("index.html", "w", encoding="utf8").write(page[:m.start(2)] + css + page[m.end(2):])
print("index.html CSS rebuilt:", len(css), "bytes")
