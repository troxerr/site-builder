// What actually ships: development files stay out, nothing exceeds the host's limits, and pages stay light.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { deployFilter, ROOT } from "../tools/serve.mjs";
import { FIRST_PARTY } from "../tools/lib/pages.mjs";
import { read, count } from "./helpers.mjs";

const shipped = [];
const keep = deployFilter();
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (name === ".git") continue;
    const full = join(dir, name), rel = relative(ROOT, full).split(sep).join("/");
    if (statSync(full).isDirectory()) { if (keep(rel + "/")) walk(full); }
    else if (keep(rel)) shipped.push({ rel, size: statSync(full).size });
  }
})(ROOT);

test("development files are not part of the deployed assets", () => {
  const leaked = shipped.filter((f) => /^(node_modules|tests|tools|src|\.github|\.snapshots|test-results)\//.test(f.rel) || /^(package(-lock)?\.json|README\.md|wrangler\.jsonc|\.[a-z]+rc|\.editorconfig|\.gitignore|\.htmlvalidate\.json)$/.test(f.rel));
  assert.deepEqual(leaked.map((f) => f.rel), []);
});

test("deployed asset count and sizes are inside the host's limits", () => {
  assert.ok(shipped.length < 15000, `${shipped.length} files (Workers allows 20,000)`);
  const tooBig = shipped.filter((f) => f.size > 20 * 1024 * 1024);
  assert.deepEqual(tooBig.map((f) => f.rel), [], "files over 20 MiB (limit is 25 MiB)");
});

test("no oversized images or media", () => {
  const big = shipped.filter((f) => /\.(png|jpe?g|webp|gif|mp4)$/i.test(f.rel) && f.size > 400 * 1024);
  assert.deepEqual(big.map((f) => `${f.rel} (${Math.round(f.size / 1024)} KB)`), []);
});

// Size ratchets for main pages (bytes of HTML including any inline CSS/JS). Lower these as the pages get lighter.
const PAGE_BUDGET = { "/": 200_000, "/dental/": 90_000, "/demos/": 85_000, default: 70_000 };
for (const page of FIRST_PARTY) {
  test(`weight and hygiene: ${page}`, () => {
    const html = read(page);
    assert.ok(Buffer.byteLength(html) <= (PAGE_BUDGET[page] ?? PAGE_BUDGET.default), `${page} is ${Buffer.byteLength(html)} bytes`);
    const scripts = [...html.matchAll(/<script\b([^>]*)>/g)].map((m) => m[1]);
    for (const attrs of scripts) {
      const src = attrs.match(/src="([^"]+)"/)?.[1];
      if (src) assert.ok(!/^https?:/.test(src) || src.startsWith("https://static.cloudflareinsights.com/"), `external script ${src}`);
    }
    assert.ok(count(html, /<script(?![^>]*(?:src=|ld\+json))[^>]*>/g) <= 2, "too many inline scripts");
    assert.ok(!/\b(?:href|src|action|srcset)="http:\/\//.test(html), "insecure http:// link or resource");
    assert.ok(!/<link[^>]+href="https:\/\/(?!fonts\.(googleapis|gstatic)\.com)/.test(html.replace(/<link[^>]+rel="(?:canonical|alternate|preconnect)"[^>]*>/g, "")), "unexpected external stylesheet");
  });
}
