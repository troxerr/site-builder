#!/usr/bin/env node
// Adds a demo site to the portfolio in one command.
//   node tools/new-demo.mjs <slug> <folder-with-the-site> --name "Business Name" --type "Roofing · Bartlett" \
//        --what "What the demo shows." --category building|services|pets|health|property|food|showcase [--chip "Live demo"] [--chip "5 pages"]
// It copies the site into demos/<slug>/, adds the "Demo site" bar and noindex to every page, drops any canonical,
// adds link-preview tags to the front page, makes the card thumbnails (assets/work) and the 1200×630 preview (assets/og),
// records the demo in src/data/demos.json and rebuilds. Review the result with `npm run serve` and `npm test`.
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, relative } from "node:path";
import { tmpdir } from "node:os";
import { parseArgs } from "node:util";
import { createSite, ROOT } from "./serve.mjs";
import { launch } from "./lib/browser.mjs";

const { values: o, positionals: [slug, source] } = parseArgs({
  allowPositionals: true,
  options: { name: { type: "string" }, type: { type: "string" }, what: { type: "string" }, category: { type: "string" }, chip: { type: "string", multiple: true } },
});
const CATEGORIES = ["building", "services", "pets", "health", "property", "food", "showcase"];
const fail = (m) => { console.error(m); process.exit(1); };
if (!slug || !source || !o.name || !o.type || !o.what || !CATEGORIES.includes(o.category)) fail(`Usage: node tools/new-demo.mjs <slug> <folder> --name ... --type ... --what ... --category ${CATEGORIES.join("|")}`);
if (!/^[a-z0-9-]+$/.test(slug)) fail("slug must be lowercase letters, digits and dashes");
const dest = join(ROOT, "demos", slug);
if (existsSync(dest)) fail(`demos/${slug} already exists`);
if (!existsSync(join(source, "index.html"))) fail(`${source}/index.html not found`);

const SITE = "https://bartlettwebsitedesign.online";
const BAR = `<aside class="bwd-demo-bar" aria-label="About this demo" style="position:relative;z-index:9999;display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:4px 14px;padding:8px 14px;background:#0b1b3a;color:#cfd9ec;font:500 13px/1.4 system-ui,-apple-system,'Segoe UI',sans-serif;text-align:center"><span><b style="color:#fff;font-weight:600">Demo site</b> built by <a href="/" style="color:#fff;text-decoration:underline">Bartlett Website Design</a>. Not the business's official website.</span><a href="/demos/" style="color:#9cc2ff;font-weight:600;text-decoration:none">&larr; All demos</a></aside>`;
const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

cpSync(source, dest, { recursive: true });
const htmlFiles = (dir) => readdirSync(dir).flatMap((f) => { const p = join(dir, f); return statSync(p).isDirectory() ? htmlFiles(p) : p.endsWith(".html") ? [p] : []; });
for (const file of htmlFiles(dest)) {
  let html = readFileSync(file, "utf8");
  if (!html.includes("bwd-demo-bar")) html = html.replace(/<body\b[^>]*>/i, (m) => `${m}\n${BAR}`);
  if (!/name="robots"/i.test(html)) html = html.replace(/<head\b[^>]*>/i, (m) => `${m}\n<meta name="robots" content="noindex, follow">`);
  html = html.replace(/<link[^>]+rel="canonical"[^>]*>\s*/gi, "").replace(/<meta[^>]+property="og:url"[^>]*>\s*/gi, "");
  if (relative(dest, file) === "index.html" && !html.includes('property="og:image"')) {
    const img = `${SITE}/assets/og/demo-${slug}.jpg`, t = `Sample website: ${o.name} · Bartlett Website Design`;
    const tags = ["og:type|website", `og:url|${SITE}/demos/${slug}/`, `og:title|${t}`, `og:description|${o.what}`, `og:image|${img}`]
      .map((x) => { const [k, v] = x.split("|"); return `<meta property="${k}" content="${esc(v)}">`; })
      .concat(['<meta name="twitter:card" content="summary_large_image">', `<meta name="twitter:title" content="${esc(t)}">`, `<meta name="twitter:description" content="${esc(o.what)}">`, `<meta name="twitter:image" content="${img}">`]).join("\n");
    html = html.replace(/<\/title>/i, `</title>\n${tags}`);
  }
  writeFileSync(file, html);
}

// Thumbnails and preview image
const tmp = mkdtempSync(join(tmpdir(), "demo-"));
const site = await createSite(), browser = await launch();
const shot = async (w, h, name) => {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } }), page = await ctx.newPage();
  await page.goto(`${site.url}/demos/${slug}/`, { waitUntil: "networkidle" });
  await page.screenshot({ path: join(tmp, name) }); await ctx.close();
};
await shot(1120, 700, "thumb.png"); await shot(1200, 630, "og.png");
await browser.close(); await site.close();
mkdirSync(join(ROOT, "assets/work"), { recursive: true }); mkdirSync(join(ROOT, "assets/og"), { recursive: true });
execFileSync("python3", ["-I", "-c", `
import sys
from PIL import Image
t, out = sys.argv[1], sys.argv[2:]
im = Image.open(t + "/thumb.png").convert("RGB")
im.save(out[0], "WEBP", quality=80)
im.resize((560, 350), Image.LANCZOS).save(out[1], "WEBP", quality=78)
Image.open(t + "/og.png").convert("RGB").save(out[2], "JPEG", quality=85)
`, tmp, join(ROOT, `assets/work/demo-${slug}.webp`), join(ROOT, `assets/work/demo-${slug}-sm.webp`), join(ROOT, `assets/og/demo-${slug}.jpg`)]);

// Catalogue record, then rebuild (the demos page and sitemap come from it)
const file = join(ROOT, "src/data/demos.json"), list = JSON.parse(readFileSync(file, "utf8"));
list.unshift({ id: slug, href: `${slug}/`, thumb: `demo-${slug}`, alt: `${o.name} demo homepage`, name: esc(o.name).replace(/&amp;amp;/g, "&amp;"), type: o.type, what: o.what, chips: o.chip?.length ? o.chip : ["Live demo"], category: o.category });
writeFileSync(file, JSON.stringify(list, null, 2) + "\n");
execFileSync("node", [join(ROOT, "tools/build.mjs")], { stdio: "inherit" });
console.log(`\nAdded demos/${slug}/. Next: add "/demos/${slug}/" to tests/url-contract.json, run npm test, then commit.`);
