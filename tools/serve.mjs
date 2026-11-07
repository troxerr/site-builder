#!/usr/bin/env node
// Local static server that behaves like the production host (Cloudflare Workers static assets):
//   - a folder URL serves its index.html, `/demos` redirects to `/demos/`
//   - unknown paths get 404.html with a 404 status
//   - response headers come from `_headers`, with the same rules (see parseHeadersFile)
//   - files listed in `.assetsignore` are not served, so a test can't pass on a file that wouldn't ship
//
// Usage: node tools/serve.mjs [port]      (default 8080)
//        import { createSite } from "./serve.mjs"  → { url, close } on a random port, for tests
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import { extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import ignore from "ignore";

export const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));

const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8", ".json": "application/json; charset=utf-8", ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".webp": "image/webp", ".gif": "image/gif", ".ico": "image/x-icon", ".woff2": "font/woff2", ".webmanifest": "application/manifest+json",
  ".mp4": "video/mp4",
};

/** Parses Cloudflare's `_headers` format: unindented lines are URL patterns, indented lines are headers.
 *  `*` is a splat, `! Name` removes a header set by an earlier rule. */
export function parseHeadersFile(text) {
  const rules = [];
  let current = null;
  for (const raw of text.split("\n")) {
    if (!raw.trim() || raw.trim().startsWith("#")) continue;
    if (!/^\s/.test(raw)) { current = { pattern: raw.trim(), set: [], unset: [] }; rules.push(current); continue; }
    const line = raw.trim();
    if (line.startsWith("!")) current.unset.push(line.slice(1).trim().toLowerCase());
    else { const i = line.indexOf(":"); current.set.push([line.slice(0, i).trim(), line.slice(i + 1).trim()]); }
  }
  return rules.map((r) => ({ ...r, re: new RegExp("^" + r.pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, "(.*)") + "$") }));
}

/** Headers for a path: every matching rule applies; the same header from several rules is joined with ", ". */
export function headersFor(rules, pathname) {
  const out = new Map();
  for (const r of rules) {
    if (!r.re.test(pathname)) continue;
    for (const name of r.unset) out.delete(name);
    for (const [name, value] of r.set) {
      const key = name.toLowerCase();
      out.set(key, out.has(key) ? `${out.get(key)}, ${value}` : value);
    }
  }
  return Object.fromEntries(out);
}

/** Files that would be uploaded: everything not matched by .assetsignore (gitignore syntax). */
export function deployFilter(root = ROOT) {
  const f = join(root, ".assetsignore");
  const ig = ignore().add(existsSync(f) ? readFileSync(f, "utf8") : "");
  return (relPath) => !ig.ignores(relPath);
}

export async function createSite({ port = 0, root = ROOT } = {}) {
  const headerRules = existsSync(join(root, "_headers")) ? parseHeadersFile(readFileSync(join(root, "_headers"), "utf8")) : [];
  const shipped = deployFilter(root);

  async function resolveFile(pathname) {
    let p = normalize(decodeURIComponent(pathname));
    if (p.includes("..")) return null;
    let file = join(root, p);
    if (!file.startsWith(root + sep) && file !== root) return null;
    try {
      const s = await stat(file);
      if (s.isDirectory()) {
        if (!pathname.endsWith("/")) return { redirect: pathname + "/" };
        file = join(file, "index.html");
        await stat(file);
      }
    } catch { return null; }
    const rel = file.slice(root.length + 1).split(sep).join("/");
    return shipped(rel) ? { file } : null;
  }

  const server = createServer(async (req, res) => {
    const url = new URL(req.url, "http://localhost");
    const hit = await resolveFile(url.pathname);
    if (hit?.redirect) { res.writeHead(301, { Location: hit.redirect + url.search }); return res.end(); }
    const status = hit ? 200 : 404;
    const file = hit ? hit.file : join(root, "404.html");
    const body = await readFile(file).catch(() => Buffer.from("Not found"));
    res.writeHead(status, { "Content-Type": TYPES[extname(file)] || "application/octet-stream", ...headersFor(headerRules, url.pathname) });
    res.end(req.method === "HEAD" ? undefined : body);
  });
  await new Promise((ok) => server.listen(port, "127.0.0.1", ok));
  const { port: actual } = server.address();
  return { url: `http://127.0.0.1:${actual}`, close: () => new Promise((ok) => server.close(ok)) };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const site = await createSite({ port: Number(process.argv[2] || process.env.PORT || 8080) });
  console.log(`Serving ${ROOT} at ${site.url}`);
}
