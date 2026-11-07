// Every internal link, image, stylesheet and script reference on every page points at a file that exists
// and every #anchor exists on the page it targets.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { allHtmlPaths } from "../tools/lib/pages.mjs";
import { read, internalRefs, resolveFile, idsIn } from "./helpers.mjs";

// Known gaps, to be cleared in the demo cleanup: these demos reference job and owner photos that were never supplied.
// Each <img> hides itself on error (onerror="this.remove()"), but the browser still makes a 404 request.
// The test fails if anything NEW breaks, and also if an entry here is fixed but not removed.
const PHOTOS = ["work-1", "work-2", "work-3", "owner"].map((n) => `assets/${n}.jpg`);
const KNOWN_BROKEN = Object.fromEntries(["big-m-roofing", "dorsey-contracting", "morris-general-construction", "prestige-baths"]
  .map((d) => [`/demos/${d}/`, PHOTOS.map((p) => `/demos/${d}/${p} (no such file)`)]));

for (const page of allHtmlPaths()) {
  test(`links on ${page}`, () => {
    const html = read(page);
    const broken = [];
    for (const ref of internalRefs(html, page)) {
      const file = resolveFile(ref);
      if (!file) { broken.push(`${ref} (no such file)`); continue; }
      const hash = ref.split("#")[1];
      if (hash && file.endsWith(".html") && !idsIn(readFileSync(file, "utf8")).has(hash) && !["top", "main"].includes(hash))
        broken.push(`${ref} (no #${hash} on the target page)`);
    }
    const known = KNOWN_BROKEN[page] ?? [];
    assert.deepEqual(broken.filter((b) => !known.includes(b)), [], "new broken references");
    assert.deepEqual(known.filter((k) => !broken.includes(k)), [], "fixed already: remove from KNOWN_BROKEN");
  });
}
