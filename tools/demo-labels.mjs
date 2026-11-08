#!/usr/bin/env node
// Fixes axe "label-content-name-mismatch" in the demos: an accessible name (aria-label) must contain the text people see,
// so voice-control users can say what they read. For each failing link or button:
//   - a label like "Back to top" / "<Name> home" on a link whose visible text already names it is removed
//   - any other label gets the visible text put in front of it
//   node tools/demo-labels.mjs [demo-slug ...]      (default: every demo)  Re-run until it reports nothing.
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createSite, ROOT } from "./serve.mjs";
import { launch } from "./lib/browser.mjs";

const axeSrc = readFileSync(join(ROOT, "node_modules/axe-core/axe.min.js"), "utf8");
const WIDTHS = [375, 1280];
const slugs = process.argv.slice(2).length ? process.argv.slice(2) : readdirSync(join(ROOT, "demos")).filter((f) => statSync(join(ROOT, "demos", f)).isDirectory());
const pagesOf = (slug, sub = "") => readdirSync(join(ROOT, "demos", slug, sub)).flatMap((f) => {
  const rel = sub ? `${sub}/${f}` : f, abs = join(ROOT, "demos", slug, rel);
  if (statSync(abs).isDirectory()) return f === "assets" ? [] : pagesOf(slug, rel);
  return f.endsWith(".html") ? [`/demos/${slug}/${rel.endsWith("index.html") ? rel.slice(0, -"index.html".length) : rel}`] : [];
});
const fileOf = (path) => join(ROOT, path.endsWith("/") ? path + "index.html" : path);
const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

const site = await createSite(), browser = await launch();
let changed = 0, failed = 0;
for (const slug of slugs) for (const path of pagesOf(slug)) {
  const hits = [];
  for (const width of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, bypassCSP: true, reducedMotion: "reduce" }), page = await ctx.newPage();
  await page.goto(site.url + path, { waitUntil: "networkidle" });
  await page.evaluate(axeSrc);
  hits.push(...await page.evaluate(async () => {
    const res = await axe.run({ runOnly: ["label-content-name-mismatch"], elementRef: true });
    return res.violations.flatMap((v) => v.nodes.map((n) => ({
      tag: n.element.cloneNode(false).outerHTML.replace(/<\/[a-z]+>$/, ""),
      label: n.element.getAttribute("aria-label"), text: (n.element.innerText || "").replace(/\s+/g, " ").trim(),
    })));
  }));
  await ctx.close();
  }
  if (!hits.length) continue;
  const file = fileOf(path); let html = readFileSync(file, "utf8");
  for (const { tag, label, text } of hits) {
    if (!label || !text) { console.log(`SKIP  ${path}: needs a manual look: ${tag.slice(0, 100)}`); failed++; continue; }
    const drop = /^(back to top|.*\bhome)$/i.test(label.trim());
    const next = drop ? null : `${text}, ${label}`;
    const old = ` aria-label="${esc(label)}"`;
    const at = html.indexOf(tag.replace(/ aria-label="[^"]*"/, "").slice(0, -1)); // tag text without its label, minus the closing ">"
    // find the real opening tag in the source: same attributes in source order, so search by label and tag name
    const re = new RegExp(`<[a-z]+\\b[^>]*aria-label="${esc(label).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*>`, "g");
    const matches = [...html.matchAll(re)].filter((m) => m[0].startsWith("<" + tag.match(/^<([a-z]+)/)[1]));
    if (!matches.length) { console.log(`SKIP  ${path}: tag not found in source for label "${label}"`); failed++; continue; }
    for (const m of matches) {
      const repl = next ? m[0].replace(old, ` aria-label="${esc(next)}"`) : m[0].replace(old, "");
      html = html.replace(m[0], repl); changed++;
    }
    void at;
  }
  writeFileSync(file, html);
  console.log(`${path}: ${hits.length} fixed`);
}
await browser.close(); await site.close();
console.log(`${changed} labels changed, ${failed} need a manual look.`);
