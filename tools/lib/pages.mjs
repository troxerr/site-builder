// Which pages exist and which are indexable. Everything else (tests, snapshots, live checks) builds on this.
import { readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { ROOT } from "../serve.mjs";

export const SITE_URL = "https://bartlettwebsitedesign.online";

export const CITIES = ["bartlett", "memphis", "germantown", "cordova", "arlington", "lakeland"];

/** Pages built and maintained as part of the main site (not the demos). */
export const FIRST_PARTY = [
  "/", "/dental/", "/bail-bonds/", "/demos/",
  ...CITIES.map((c) => `/${c}/`),
  "/thanks/", "/thanks/text-back/", "/thanks/booking-agent/", "/404.html",
];

/** First-party pages that Google should index (the rest are noindex). */
export const INDEXABLE = FIRST_PARTY.filter((p) => !p.startsWith("/thanks/") && p !== "/404.html");

/** Every demo's folder name. */
export const DEMOS = readdirSync(join(ROOT, "demos"))
  .filter((d) => statSync(join(ROOT, "demos", d)).isDirectory())
  .sort();

/** File path (absolute) for a site URL path like "/demos/x/". */
export function fileFor(urlPath) {
  const p = urlPath.endsWith("/") ? urlPath + "index.html" : urlPath;
  return join(ROOT, p);
}

/** All HTML files in the repo that ship, as site URL paths. */
export function allHtmlPaths() {
  const out = [];
  const skip = new Set(["node_modules", ".git", "tests", "tools", "src", ".github", ".snapshots", "test-results"]);
  (function walk(dir) {
    for (const name of readdirSync(dir)) {
      if (skip.has(name)) continue;
      const full = join(dir, name);
      if (statSync(full).isDirectory()) walk(full);
      else if (name.endsWith(".html")) {
        const rel = relative(ROOT, full).split(sep).join("/");
        out.push("/" + (rel.endsWith("/index.html") || rel === "index.html" ? rel.replace(/index\.html$/, "") : rel));
      }
    }
  })(ROOT);
  return out.sort();
}

export const exists = (urlPath) => existsSync(fileFor(urlPath));

