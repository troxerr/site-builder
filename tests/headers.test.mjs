// Response headers as the host will send them, computed from _headers with the same rules the host uses.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseHeadersFile, headersFor, ROOT } from "../tools/serve.mjs";
import { join } from "node:path";

const rules = parseHeadersFile(readFileSync(join(ROOT, "_headers"), "utf8"));
const at = (path) => headersFor(rules, path);

for (const path of ["/", "/dental/", "/demos/", "/bartlett/", "/demos/jim-fields-plumbing/", "/assets/og-image.png", "/thanks/"]) {
  test(`baseline security headers on ${path}`, () => {
    const h = at(path);
    assert.equal(h["x-content-type-options"], "nosniff");
    assert.equal(h["referrer-policy"], "strict-origin-when-cross-origin");
    assert.match(h["permissions-policy"], /camera=\(\)/);
  });
}

test("static assets are cached", () => {
  assert.match(at("/assets/work/demo-big-m-roofing.webp")["cache-control"], /max-age=\d{6,}/);
  assert.match(at("/demos/big-m-roofing/assets/site.css")["cache-control"], /max-age=\d{6,}/);
});

test("header file parser follows the host's rules (joining, splats, removal)", () => {
  const r = parseHeadersFile("/a/*\n  X-One: 1\n  X-Two: a\n/a/b\n  X-Two: b\n  ! X-One\n");
  assert.deepEqual(headersFor(r, "/a/x"), { "x-one": "1", "x-two": "a" });
  assert.deepEqual(headersFor(r, "/a/b"), { "x-two": "a, b" });
});
