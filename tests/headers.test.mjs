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
    assert.match(h["strict-transport-security"], /max-age=31536000/);
    assert.equal(h["cross-origin-opener-policy"], "same-origin");
  });
}

test("first-party pages get the strict CSP; demos (self-contained sites) do not", () => {
  for (const path of ["/", "/dental/", "/demos/", "/bartlett/", "/thanks/", "/thanks/booking-agent/", "/404.html"]) {
    const csp = at(path)["content-security-policy"];
    assert.ok(csp, `${path} has a CSP`);
    for (const d of ["default-src 'self'", "object-src 'none'", "base-uri 'self'", "frame-ancestors 'self'"]) assert.ok(csp.includes(d), `${path}: ${d}`);
    assert.ok(!/unsafe-eval/.test(csp) && !/style-src[^;]*unsafe-inline/.test(csp), "no unsafe-eval, no inline styles");
  }
  assert.equal(at("/demos/jim-fields-plumbing/")["content-security-policy"], undefined);
});

test("no header is accidentally doubled by overlapping rules", () => {
  for (const path of ["/assets/css/site.0123456789.css", "/assets/js/home.0123456789.js", "/assets/work/x.webp", "/assets/og-image.png", "/assets/logo-mark.svg", "/assets/fonts/inter-latin.woff2", "/demos/big-m-roofing/assets/a.png", "/"]) {
    const h = at(path);
    assert.ok((h["cache-control"] ?? "").split("max-age").length <= 2, `${path} cache-control doubled: ${h["cache-control"]}`);
    assert.ok(!/nosniff.*nosniff|same-origin.*same-origin|max-age=31536000.*max-age=31536000/.test(`${h["x-content-type-options"]} ${h["cross-origin-opener-policy"]} ${h["strict-transport-security"]}`), `${path} security header doubled`);
  }
});

test("hashed CSS and JS are immutable for a year; other assets for a week", () => {
  assert.match(at("/assets/css/site.0123456789.css")["cache-control"], /^public, max-age=31536000, immutable$/);
  assert.match(at("/assets/js/home.0123456789.js")["cache-control"], /^public, max-age=31536000, immutable$/);
  assert.match(at("/assets/work/x.webp")["cache-control"], /^public, max-age=604800$/);
});

test("static assets are cached", () => {
  assert.match(at("/assets/work/demo-big-m-roofing.webp")["cache-control"], /max-age=\d{6,}/);
  assert.match(at("/demos/big-m-roofing/assets/site.css")["cache-control"], /max-age=\d{6,}/);
});

test("header file parser follows the host's rules (joining, splats, removal)", () => {
  const r = parseHeadersFile("/a/*\n  X-One: 1\n  X-Two: a\n/a/b\n  X-Two: b\n  ! X-One\n");
  assert.deepEqual(headersFor(r, "/a/x"), { "x-one": "1", "x-two": "a" });
  assert.deepEqual(headersFor(r, "/a/b"), { "x-two": "a, b" });
});

test("demos are noindex by header as well as by meta tag; the demos index is not", () => {
  assert.match(at("/demos/jim-fields-plumbing/")["x-robots-tag"], /noindex/);
  assert.equal(at("/demos/")["x-robots-tag"], undefined);
});
