// Shared helpers for the test suite.
import { readFileSync, existsSync, statSync } from "node:fs";
import { dirname, join, posix } from "node:path";
import { createSite, ROOT } from "../tools/serve.mjs";
import { fileFor, SITE_URL } from "../tools/lib/pages.mjs";
import { launch, stubExternal } from "../tools/lib/browser.mjs";

export { ROOT, SITE_URL, fileFor, launch, stubExternal };

export const read = (urlPath) => readFileSync(fileFor(urlPath), "utf8");

/** Starts the local site and a browser; call close() when done. */
export async function startEnv() {
  const site = await createSite();
  const browser = await launch();
  return {
    site, browser,
    /** A fresh page with external requests stubbed. */
    async newPage({ width = 1280, height = 900, route } = {}) {
      const context = await browser.newContext({ viewport: { width, height }, reducedMotion: "reduce" });
      await stubExternal(context, site.url);
      if (route) await route(context);
      return context.newPage();
    },
    async close() { await browser.close(); await site.close(); },
  };
}

// ---- tiny HTML helpers (our pages are generated, well-formed HTML) ----
export const text = (html) => html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, "").replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&rsquo;|&#39;/g, "'").replace(/&ldquo;|&rdquo;/g, '"').replace(/&[a-z]+;|&#\d+;/g, " ").replace(/\s+/g, " ").trim();
export const meta = (html, attr, name) => html.match(new RegExp(`<meta[^>]+${attr}="${name}"[^>]*content="([^"]*)"`, "i"))?.[1] ?? html.match(new RegExp(`<meta[^>]+content="([^"]*)"[^>]*${attr}="${name}"`, "i"))?.[1];
export const title = (html) => html.match(/<title>([\s\S]*?)<\/title>/)?.[1].trim();
export const canonical = (html) => html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/)?.[1];
export const jsonLd = (html) => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
export const count = (html, re) => (html.match(re) || []).length;

/** Every URL a page references that points into this site, as { url, from } with url resolved to a site path. */
export function internalRefs(html, pagePath) {
  // Links inside comments and in script code (React bundles, template strings) aren't links on the page
  html = html.replace(/<!--[\s\S]*?-->/g, "").replace(/<script(?![^>]*ld\+json)[^>]*>[\s\S]*?<\/script>/g, "");
  const refs = new Set();
  const add = (raw) => {
    if (!raw) return;
    raw = raw.trim().replace(/&amp;/g, "&");
    if (/^(mailto:|tel:|sms:|javascript:|data:|#$|blob:)/.test(raw)) return;
    if (raw.startsWith(SITE_URL)) raw = raw.slice(SITE_URL.length) || "/";
    else if (/^(https?:)?\/\//.test(raw)) return;
    if (raw.startsWith("/cdn-cgi/")) return;
    let path;
    if (raw.startsWith("#")) path = pagePath + raw;
    else if (raw.startsWith("/")) path = raw;
    else path = posix.join(pagePath.endsWith("/") ? pagePath : posix.dirname(pagePath) + "/", raw);
    refs.add(path);
  };
  for (const m of html.matchAll(/\b(?:href|src|poster|action|data-src)="([^"]*)"/g)) add(m[1]);
  for (const m of html.matchAll(/\bsrcset="([^"]*)"/g)) for (const part of m[1].split(",")) add(part.trim().split(/\s+/)[0]);
  for (const m of html.matchAll(/<meta[^>]+(?:property|name)="(?:og|twitter):(?:image|url)"[^>]*content="([^"]*)"/g)) add(m[1]);
  for (const m of html.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)) add(m[1]);
  return [...refs];
}

/** Resolves a site path (no hash/query) to the file that would serve it, or null. */
export function resolveFile(sitePath) {
  const clean = sitePath.split("#")[0].split("?")[0];
  const candidates = clean.endsWith("/") ? [clean + "index.html"] : [clean, clean + "/index.html"];
  for (const c of candidates) {
    const f = join(ROOT, c);
    if (existsSync(f) && statSync(f).isFile()) return f;
  }
  return null;
}
export const idsIn = (html) => new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
export { dirname };

/** Width and height of a PNG or JPEG file. */
export function imageSize(file) {
  const b = readFileSync(file);
  if (b.readUInt32BE(0) === 0x89504e47) return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i < b.length) {
      if (b[i] !== 0xff) { i++; continue; }
      const marker = b[i + 1];
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) return { height: b.readUInt16BE(i + 5), width: b.readUInt16BE(i + 7) };
      i += 2 + b.readUInt16BE(i + 2);
    }
  }
  throw new Error(`unsupported image: ${file}`);
}
export const decode = (s) => (s ?? "").replace(/&amp;/g, "&").replace(/&#39;|&rsquo;/g, "'").replace(/&quot;/g, '"');
