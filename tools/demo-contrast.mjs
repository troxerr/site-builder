#!/usr/bin/env node
// Raises low-contrast text in the demos to WCAG AA without redesigning them.
// For each demo page it runs axe (color-contrast), and for every failing element adds a rule to a small
// <style id="bwd-contrast"> block that nudges only that element's text colour toward black or white until it passes.
//   node tools/demo-contrast.mjs [demo-slug ...]      (default: every demo)
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createSite, ROOT } from "./serve.mjs";
import { launch } from "./lib/browser.mjs";

const axeSrc = readFileSync(join(ROOT, "node_modules/axe-core/axe.min.js"), "utf8");
const slugs = process.argv.slice(2).length ? process.argv.slice(2) : readdirSync(join(ROOT, "demos")).filter((f) => statSync(join(ROOT, "demos", f)).isDirectory());
const pagesOf = (slug, sub = "") => readdirSync(join(ROOT, "demos", slug, sub)).flatMap((f) => {
  const rel = sub ? `${sub}/${f}` : f, abs = join(ROOT, "demos", slug, rel);
  if (statSync(abs).isDirectory()) return f === "assets" ? [] : pagesOf(slug, rel);
  return f.endsWith(".html") ? [`/demos/${slug}/${rel.endsWith("index.html") ? rel.slice(0, -"index.html".length) : rel}`] : [];
});

const lum = ([r, g, b]) => { const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const parse = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const hex = (c) => "#" + c.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
function fixed(fg, bg, need) {
  const target = lum(bg) > 0.4 ? [0, 0, 0] : [255, 255, 255];
  for (let t = 0.05; t <= 1.0001; t += 0.05) {
    const c = fg.map((v, i) => v + (target[i] - v) * t);
    if (ratio(c, bg) >= need + 0.15) return hex(c);
  }
  return hex(target);
}

const site = await createSite(), browser = await launch();
const LINE = /^(.*)\{(color|background-color):(#[0-9a-f]{6})!important(?:;opacity:1!important)?\}$/;
let total = 0;
for (const slug of slugs) {
  for (const path of pagesOf(slug)) {
    const rules = new Map(); // "selector|property" -> colour
    for (const width of [375, 1280]) {
      const ctx = await browser.newContext({ viewport: { width, height: 900 }, bypassCSP: true, reducedMotion: "reduce" }), page = await ctx.newPage();
      await page.goto(site.url + path, { waitUntil: "networkidle" });
      // reveal-on-scroll sections only count once they have been scrolled into view
      await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } scrollTo(0, 0); await new Promise((r) => setTimeout(r, 700)); });
      await page.evaluate(axeSrc);
      const nodes = await page.evaluate(async () => {
        const cssPath = (el) => { const parts = []; for (; el && el.nodeType === 1 && el !== document.documentElement; el = el.parentElement) { const i = [...el.parentElement.children].indexOf(el) + 1; parts.unshift(`${el.tagName.toLowerCase()}:nth-child(${i})`); } return "html>" + parts.join(">"); };
        const rgb = (hex) => `rgb(${[1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(", ")})`;
        const res = await axe.run({ runOnly: ["color-contrast"], elementRef: true });
        return res.violations.flatMap((v) => v.nodes.map((n) => {
          const d = n.any[0]?.data; if (!d?.fgColor || !d?.bgColor || d.bgColor.length !== 7) return null;
          let bgEl = n.element; while (bgEl && getComputedStyle(bgEl).backgroundColor !== rgb(d.bgColor)) bgEl = bgEl.parentElement;
          return { sel: cssPath(n.element), bgSel: bgEl ? cssPath(bgEl) : null, fg: d.fgColor, bg: d.bgColor, need: parseFloat(d.expectedContrastRatio) || 4.5 };
        }).filter(Boolean));
      });
      for (const n of nodes) {
        const fg = parse(n.fg), bg = parse(n.bg), nf = fixed(fg, bg, n.need);
        if (ratio(parse(nf), bg) >= n.need) { rules.set(`${n.sel}|color`, nf); continue; }
        // text is already as light/dark as it gets: darken (or lighten) the background that sits behind it instead
        if (!n.bgSel) continue;
        const fgc = parse(nf), dir = lum(fgc) > 0.5 ? [0, 0, 0] : [255, 255, 255];
        for (let t = 0.04; t <= 1; t += 0.04) { const c = bg.map((v, i) => v + (dir[i] - v) * t); if (ratio(fgc, c) >= n.need + 0.1) { rules.set(`${n.bgSel}|background-color`, hex(c)); break; } }
        rules.set(`${n.sel}|color`, nf);
      }
      await ctx.close();
    }
    if (!rules.size) continue;
    const file = join(ROOT, path.endsWith("/") ? path + "index.html" : path);
    let html = readFileSync(file, "utf8");
    const old = html.match(/<style id="bwd-contrast">\n([\s\S]*?)\n<\/style>/);
    const merged = new Map();
    for (const line of old ? old[1].split("\n") : []) { const m = line.match(LINE); if (m) merged.set(`${m[1]}|${m[2]}`, m[3]); }
    for (const [k, v] of rules) merged.set(k, v);
    html = html.replace(/<style id="bwd-contrast">[\s\S]*?<\/style>\n?/, "");
    const css = [...merged].map(([k, c]) => { const [sel, prop] = k.split("|"); return `${sel}{${prop}:${c}!important${prop === "color" ? ";opacity:1!important" : ""}}`; }).join("\n");
    html = html.replace(/<\/head>/i, `<style id="bwd-contrast">\n${css}\n</style>\n</head>`);
    writeFileSync(file, html); total += rules.size;
    console.log(`${path}: ${rules.size} rules`);
  }
}
await browser.close(); await site.close();
console.log(`${total} rules written. Re-run until it writes nothing, then update the baseline (npm run baseline).`);
