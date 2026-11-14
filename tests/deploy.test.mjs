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

// Size ratchets for main pages (bytes of HTML; CSS and JS are separate cached files). Lower these as the pages get lighter.
const PAGE_BUDGET = { "/": 115_000, "/dental/": 48_000, "/demos/": 62_000, default: 40_000 };
for (const page of FIRST_PARTY) {
  test(`weight and hygiene: ${page}`, () => {
    const html = read(page);
    assert.ok(Buffer.byteLength(html) <= (PAGE_BUDGET[page] ?? PAGE_BUDGET.default), `${page} is ${Buffer.byteLength(html)} bytes`);
    const scripts = [...html.matchAll(/<script\b([^>]*)>/g)].map((m) => m[1]);
    for (const attrs of scripts) {
      const src = attrs.match(/src="([^"]+)"/)?.[1];
      if (src) assert.ok(!/^https?:/.test(src) || src.startsWith("https://static.cloudflareinsights.com/"), `external script ${src}`);
    }
    assert.equal(count(html, /<script(?![^>]*(?:src=|ld\+json))[^>]*>/g), 0, "inline script (move it to src/js)");
    assert.equal(count(html, /<style\b/g), 0, "inline <style> (CSS lives in assets/css)");
    assert.ok(!/\b(?:href|src|action|srcset)="http:\/\//.test(html), "insecure http:// link or resource");
    assert.ok(!/<link[^>]+href="https:\/\/(?!fonts\.(googleapis|gstatic)\.com)/.test(html.replace(/<link[^>]+rel="(?:canonical|alternate|preconnect)"[^>]*>/g, "")), "unexpected external stylesheet");
  });
}

test("every first-party page shares one stylesheet and loads only hashed scripts of its own", () => {
  const sheets = new Set(), scripts = [];
  for (const page of FIRST_PARTY) {
    const html = read(page);
    const css = [...html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)].map((m) => m[1]);
    assert.equal(css.length, 1, `${page} should link exactly one stylesheet`);
    css.forEach((c) => sheets.add(c));
    for (const m of html.matchAll(/<script[^>]+src="(\/assets\/js\/[^"]+)"/g)) scripts.push(m[1]);
  }
  assert.equal(sheets.size, 1, `pages link different stylesheets: ${[...sheets]}`);
  assert.match([...sheets][0], /^\/assets\/css\/site\.[0-9a-f]{10}\.css$/);
  assert.ok(scripts.every((s) => /^\/assets\/js\/[a-z-]+\.[0-9a-f]{10}\.js$/.test(s)), "scripts are content-hashed");
  const css = shipped.find((f) => f.rel === [...sheets][0].slice(1));
  assert.ok(css && css.size <= 55 * 1024, "stylesheet over 55 KB (includes the editorial design layer)");
  for (const f of shipped.filter((f) => f.rel.startsWith("assets/js/"))) assert.ok(f.size <= 8 * 1024, `${f.rel} over 8 KB`);
});

test("no stale generated files are left in assets/css or assets/js", () => {
  const used = new Set(FIRST_PARTY.flatMap((p) => [...read(p).matchAll(/(?:href|src)="(\/assets\/(?:css|js)\/[^"]+)"/g)].map((m) => m[1].slice(1))));
  const onDisk = shipped.filter((f) => /^assets\/(css|js)\//.test(f.rel)).map((f) => f.rel);
  assert.deepEqual(onDisk.filter((f) => !used.has(f)), []);
});

