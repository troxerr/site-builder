// SEO and page-quality rules for every page: titles, descriptions, canonical URLs, social preview tags,
// structured data, the sitemap, and the demo rules (never indexed, never claim to be the business).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { FIRST_PARTY, INDEXABLE, DEMOS, allHtmlPaths, SITE_URL } from "../tools/lib/pages.mjs";
import { read, title, meta, canonical, jsonLd, count, resolveFile, imageSize, decode, text } from "./helpers.mjs";
import { join } from "node:path";
import { ROOT } from "./helpers.mjs";

// Known gaps, fixed in the SEO pass (Phase 3). The test fails if one is fixed but left in the list.
const LONG_TITLE = new Set([]);
const LONG_DESCRIPTION = new Set([]);

// The Broadmoor "homes" page loads the Leaflet map library from unpkg.com. It gets bundled into the demo in the demo cleanup.
const KNOWN_CDN = new Set(["/demos/broadmoor-property-management/homes.html"]);

const MAX_TITLE = 65, MAX_DESCRIPTION = 160;

for (const page of FIRST_PARTY) {
  const indexable = INDEXABLE.includes(page);
  test(`page basics: ${page}`, () => {
    const html = read(page);
    assert.match(html, /^<!doctype html>\s*<html lang="en"/i, "doctype and lang");
    assert.ok(meta(html, "name", "viewport")?.includes("width=device-width"), "viewport");
    assert.equal(count(html, /<h1[\s>]/g), 1, "exactly one h1");
    const t = decode(title(html)), d = decode(meta(html, "name", "description"));
    assert.ok(t && d, "title and description exist");
    assert.equal(t.length > MAX_TITLE, LONG_TITLE.has(page), `title is ${t.length} chars (max ${MAX_TITLE}); ${LONG_TITLE.has(page) ? "listed as known but now fine" : "too long"}`);
    assert.equal(d.length > MAX_DESCRIPTION, LONG_DESCRIPTION.has(page), `description is ${d.length} chars (max ${MAX_DESCRIPTION}); ${LONG_DESCRIPTION.has(page) ? "listed as known but now fine" : "too long"}`);
    if (indexable) {
      assert.ok(d.length >= 80, "description at least 80 chars");
      assert.equal(canonical(html), SITE_URL + page, "canonical matches the page's own URL");
      assert.ok(!/noindex/.test(meta(html, "name", "robots") ?? ""), "indexable");
      assert.equal(meta(html, "property", "og:url") ?? SITE_URL + page, SITE_URL + page, "og:url matches");
      for (const k of ["og:title", "og:description", "og:image"]) assert.ok(meta(html, "property", k), k);
      assert.equal(meta(html, "name", "twitter:card"), "summary_large_image");
      const img = meta(html, "property", "og:image");
      assert.ok(img.startsWith(SITE_URL + "/"), "og:image is absolute");
      const f = resolveFile(img.slice(SITE_URL.length));
      assert.ok(f, "og:image file exists");
      assert.equal(imageSize(f).width, 1200, "og:image is 1200px wide");
    } else {
      assert.match(meta(html, "name", "robots") ?? "", /noindex/, "noindex");
      assert.equal(canonical(html), undefined, "no canonical on a noindex page");
    }
  });
  test(`structured data: ${page}`, () => {
    const html = read(page);
    for (const block of jsonLd(html)) {
      assert.equal(block["@context"], "https://schema.org");
      const walk = (v) => { if (typeof v === "string" && /^https?:\/\//.test(v) && v.includes("example.com")) assert.fail(`placeholder URL ${v}`); else if (v && typeof v === "object") Object.values(v).forEach(walk); };
      walk(block);
      if (block["@type"] === "FAQPage") {
        const asked = block.mainEntity.map((q) => decode(q.name));
        const shown = [...html.matchAll(/<details[^>]*><summary[^>]*>([\s\S]*?)<(?:span|svg)/g)].map((m) => decode(text(m[1])));
        assert.deepEqual(asked, shown, "FAQ structured data matches the questions on the page");
      }
    }
  });
  test(`images have alt and dimensions: ${page}`, () => {
    const html = read(page);
    const bad = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]).filter((i) => !/\balt=/.test(i) || !/\bwidth=/.test(i) || !/\bheight=/.test(i) && !/class="[^"]*\bh-/.test(i));
    assert.deepEqual(bad.map((b) => b.slice(0, 90)), []);
  });
}

test("every first-party title and description is unique", () => {
  const seen = new Map();
  for (const page of INDEXABLE) for (const [kind, v] of [["title", title(read(page))], ["description", meta(read(page), "name", "description")]]) {
    const key = `${kind}:${v}`; assert.ok(!seen.has(key), `${page} repeats the ${kind} of ${seen.get(key)}`); seen.set(key, page);
  }
});

test("sitemap lists exactly the indexable pages, with valid dates", () => {
  const xml = readFileSync(join(ROOT, "sitemap.xml"), "utf8");
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).sort();
  assert.deepEqual(urls, INDEXABLE.map((p) => SITE_URL + p).sort());
  for (const m of xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)) {
    assert.match(m[1], /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(new Date(m[1]) <= new Date(Date.now() + 864e5), `${m[1]} is in the future`);
  }
});

test("robots.txt allows crawling (so noindex is seen) and points at the sitemap", () => {
  const robots = readFileSync(join(ROOT, "robots.txt"), "utf8");
  assert.match(robots, new RegExp(`Sitemap: ${SITE_URL}/sitemap.xml`));
  assert.ok(!/^Disallow:\s*\/\s*$/m.test(robots));
});

// ---- demos ----
const demoPages = allHtmlPaths().filter((p) => p.startsWith("/demos/") && p !== "/demos/");
for (const page of demoPages) {
  const entry = DEMOS.some((d) => page === `/demos/${d}/`);
  test(`demo rules: ${page}`, () => {
    const html = read(page);
    assert.match(meta(html, "name", "robots") ?? "", /noindex/, "demos are never indexed");
    const canon = canonical(html);
    assert.ok(!canon || canon.startsWith(SITE_URL + "/"), `canonical points off-site: ${canon}`);
    const ogUrl = meta(html, "property", "og:url");
    assert.ok(!ogUrl || ogUrl.startsWith(SITE_URL + "/"), `og:url points off-site: ${ogUrl}`);
    assert.ok(/class="bwd-demo-bar"/.test(html), "has the 'Demo site' bar");
    const usesCdn = /<(?:script|link)[^>]+(?:src|href)="https?:\/\/(cdn\.tailwindcss\.com|unpkg\.com|cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com)/.test(html);
    assert.equal(usesCdn, KNOWN_CDN.has(page), usesCdn ? "loads a library from a CDN (bundle it into the demo)" : "listed in KNOWN_CDN but no longer uses a CDN: remove it from the list");
    assert.ok(!jsonLd(html).some((b) => JSON.stringify(b).includes('"url"') && !JSON.stringify(b).includes(SITE_URL)), "no structured data claiming to be the business");
    if (entry) {
      const img = meta(html, "property", "og:image");
      assert.ok(img?.startsWith(SITE_URL + "/"), "link-preview image is set");
      const f = resolveFile(img.slice(SITE_URL.length));
      assert.ok(f, "preview image exists");
      assert.equal(imageSize(f).width, 1200, "preview image is 1200px wide");
      assert.ok(meta(html, "property", "og:title")?.includes("Bartlett Website Design"), "og:title says it's a demo by you");
    }
  });
}
