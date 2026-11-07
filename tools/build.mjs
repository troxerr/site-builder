#!/usr/bin/env node
// Builds the site. Run from the repo root: `npm run build`.
//   src/pages/*.mjs + src/data/*.json + src/partials/*  →  index.html, dental/, demos/, six city pages, thanks pages, 404.html
//   src/css  →  ONE stylesheet for every first-party page, content-hashed: assets/css/site.<hash>.css
//   src/js   →  small bundles, content-hashed: assets/js/<name>.<hash>.js
//   sitemap.xml is generated from the pages marked `indexable`; a page's <lastmod> moves only when its content changes.
// The generated files are committed (Cloudflare deploys the repo root as is); CI runs `npm run build:check` to be sure they're current.
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import * as esbuild from "esbuild";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const src = (...p) => join(ROOT, "src", ...p);
const ui = await import(pathToFileURL(src("lib/ui.mjs")));
const { head, structuredData, SITE_URL } = await import(pathToFileURL(src("lib/head.mjs")));
const { default: home } = await import(pathToFileURL(src("pages/home.mjs")));
const { default: dental } = await import(pathToFileURL(src("pages/dental.mjs")));
const { default: city, cityFaqs } = await import(pathToFileURL(src("pages/city.mjs")));
const { default: demosPage } = await import(pathToFileURL(src("pages/demos.mjs")));
const { notFound, thanks, thanksAgent } = await import(pathToFileURL(src("pages/simple.mjs")));
const { site, cities, areas, demos, faqEntries, faqDetails, founding, planOptions, attr, demoHomeCard } = ui;

const partial = (name) => readFileSync(src("partials", name), "utf8").trimEnd();
const sprite = partial("sprite.svg").replace("</svg>", `  ${partial("dental-sprite-extras.svg")}\n</svg>`);
const spriteFor = (p) => (p.sprite === "dental" ? sprite : partial("sprite.svg"));
const BEACON = `<!-- Cloudflare Web Analytics: cookieless page views -->\n<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "${site.beaconToken}"}'></script>`;

// ---------- the pages ----------
const FOUNDING_ATTR = (key) => `data-plan="${attr(founding.plan(key))}"`;
const money = ui.money;

/** What every page template can use. */
function context(p) {
  const scripts = [`<script defer src="{{JS:site}}"></script>`, p.js && `<script defer src="{{JS:${p.js}}}"></script>`, BEACON].filter(Boolean).join("\n");
  const top = `${spriteFor(p)}\n<a class="skip" href="#main">Skip to content</a>\n${partial(p.sprite === "dental" ? "dental-header.html" : "header.html")}`;
  const bar = p.bar === false ? "" : partial(p.sprite === "dental" ? "dental-mobile-bar.html" : "mobile-bar.html");
  const bottom = `${partial("footer.html")}\n\n${bar}`;
  const c = {
    head: head(p), top, bottom, scripts,
    founding: { hero: founding.hero(), banner: founding.banner() },
    foundingNote: (cls) => founding.cityNote(cls),
    card: { starter: founding.card("starter"), business: founding.card("business") },
    attr: { starter: FOUNDING_ATTR("starter"), business: FOUNDING_ATTR("business") },
    planOptions: planOptions(), faqItems: faqDetails(faqEntries(), { indent: "        " }),
    demoPool: demos.filter((d) => d.home).sort((a, b) => a.home.order - b.home.order).map(demoHomeCard).join("\n"), demoCount: demos.length,
  };
  c.shell = (body) => `${c.head}\n<body class="bg-slate-950 font-sans text-white antialiased selection:bg-blue-600 selection:text-white">\n${c.top}\n${body}\n${c.bottom}\n\n${c.scripts}\n</body>\n</html>\n`;
  return c;
}

const mkPage = (p) => ({ ...p, html: (p.render)(context(p)) });

const defs = [
  { path: "/", out: "index.html", js: "home", indexable: true, render: home,
    title: "Website Design & Missed-Call Text-Back in Bartlett & Memphis, TN | Bartlett Website Design",
    description: `Websites for Bartlett and Memphis small businesses and contractors, from ${money(site.pricing.starter)}, plus missed-call text-back from ${money(site.pricing.textback)}/month. Built by a local designer. See a free working draft before you pay.`,
    ogTitle: "Bartlett Website Design · Websites and missed-call text-back",
    ogDescription: "Fast websites and instant text-back for Bartlett and Memphis businesses. See a free working draft before you pay.",
    ld: structuredData.home() },
  { path: "/dental/", out: "dental/index.html", js: "dental", sprite: "dental", indexable: true, render: dental,
    title: "Missed-Call Booking Agent for Dental Offices | Bartlett Website Design",
    description: `For dental offices in Bartlett, Memphis and the Mid-South: missed calls get a text back within a minute and are booked into your schedule. ${money(site.pricing.agent.setup)} setup + ${money(site.pricing.agent.monthly)}/month, no long-term contract.`,
    ogTitle: "Missed calls, booked · for dental offices",
    ogDescription: "Missed calls get a text back within a minute and are booked into your schedule. Anything urgent goes straight to your team.",
    ogImage: "/assets/og-dental.png", ld: structuredData.dental() },
  { path: "/demos/", out: "demos/index.html", js: "demos", indexable: true, render: demosPage,
    title: "Website Demos for Memphis Businesses | Bartlett Website Design",
    description: "Click through live website demos built by Bartlett Website Design for Memphis-area vets, contractors, salons, auto shops, remodelers, roofers, groomers, property managers and dental offices." },
  ...Object.entries(cities).map(([slug, ct]) => ({
    path: `/${slug}/`, out: `${slug}/index.html`, indexable: true, title: ct.title, description: ct.desc,
    render: (c) => city(c, slug, ct), ld: structuredData.city(slug, ct, cityFaqs(ct)),
  })),
  { path: "/thanks/", out: "thanks/index.html", robots: "noindex", bar: false, render: thanks, title: "Thanks | Bartlett Website Design", description: "Your free draft request was sent." },
  { path: "/thanks/booking-agent/", out: "thanks/booking-agent/index.html", robots: "noindex", bar: false, render: thanksAgent, title: "Thanks | Bartlett Website Design", description: "Your booking agent request was sent." },
  { path: "/404.html", out: "404.html", robots: "noindex", render: notFound, title: "Page not found | Bartlett Website Design", description: "That page doesn't exist. See live website demos or get a free draft of your site." },
];

/** All pages as { path, out, html } with {{CSS}} and {{JS:name}} placeholders still in place. */
export function renderPages() {
  return defs.map(mkPage);
}

// ---------- assets ----------
const sha = (buf) => createHash("sha256").update(buf).digest("hex").slice(0, 10);
const TAILWIND = join(ROOT, "node_modules/.bin/tailwindcss");

function buildCss(pages) {
  const tmp = mkdtempSync(join(tmpdir(), "site-css-"));
  try {
    const files = pages.map((p, i) => { const f = join(tmp, `p${i}.html`); writeFileSync(f, p.html); return f; });
    const out = join(tmp, "out.css");
    execFileSync(TAILWIND, ["-c", src("css/tailwind.config.js"), "-i", src("css/input.css"), "-o", out, "--minify"],
      { stdio: ["ignore", "ignore", "pipe"], env: { ...process.env, SITE_CONTENT: [...files, join(src("js"), "*.js")].join(",") } });
    return readFileSync(out);
  } finally { rmSync(tmp, { recursive: true, force: true }); }
}

async function buildJs() {
  const contact = { phone: site.phone.display, tel: site.phone.tel, email: site.email };
  const res = await esbuild.build({
    entryPoints: Object.fromEntries(["site", "home", "dental", "demos"].map((n) => [n, src("js", `${n}.js`)])),
    bundle: true, minify: true, format: "iife", target: "es2019", write: false, outdir: "out", legalComments: "none",
    define: { __CONTACT__: JSON.stringify(contact) },
  });
  return Object.fromEntries(res.outputFiles.map((f) => [f.path.split("/").pop().replace(/\.js$/, ""), Buffer.from(f.contents)]));
}

// ---------- output ----------
const written = new Set();
function write(rel, data) {
  const file = join(ROOT, rel), buf = Buffer.isBuffer(data) ? data : Buffer.from(data);
  written.add(rel);
  if (existsSync(file) && readFileSync(file).equals(buf)) return;
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, buf);
}

function sweep(dir, pattern) {
  const abs = join(ROOT, dir);
  if (!existsSync(abs)) return;
  for (const f of readdirSync(abs)) if (pattern.test(f) && !written.has(`${dir}/${f}`)) rmSync(join(abs, f));
}

const lastmodFile = src("data/lastmod.json");
function sitemap(pages) {
  const prev = existsSync(lastmodFile) ? JSON.parse(readFileSync(lastmodFile, "utf8")) : {};
  const next = {}, today = process.env.SOURCE_DATE || new Date().toISOString().slice(0, 10);
  for (const p of pages.filter((x) => x.indexable)) {
    const fingerprint = sha(p.html); // before asset names are filled in, so a CSS rebuild alone doesn't touch every date
    next[p.path] = prev[p.path]?.hash === fingerprint ? prev[p.path] : { hash: fingerprint, date: today };
  }
  writeFileSync(lastmodFile, JSON.stringify(next, null, 2) + "\n");
  const urls = Object.entries(next).map(([path, v]) => `  <url>\n    <loc>${SITE_URL}${path}</loc>\n    <lastmod>${v.date}</lastmod>\n  </url>`);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
}

export async function build() {
  const pages = renderPages();
  const css = buildCss(pages), js = await buildJs();
  const cssPath = `/assets/css/site.${sha(css)}.css`;
  const jsPaths = Object.fromEntries(Object.entries(js).map(([n, buf]) => [n, `/assets/js/${n}.${sha(buf)}.js`]));
  write(cssPath.slice(1), css);
  for (const [n, buf] of Object.entries(js)) write(jsPaths[n].slice(1), buf);
  const sitemapXml = sitemap(pages);
  for (const p of pages) {
    write(p.out, p.html.replace("{{CSS}}", cssPath).replace(/\{\{JS:(\w+)\}\}/g, (_, n) => jsPaths[n]));
  }
  write("sitemap.xml", sitemapXml);
  sweep("assets/css", /^site\..*\.css$/);
  sweep("assets/js", /\.js$/);
  console.log(`Built ${pages.length} pages, ${cssPath} (${(css.length / 1024).toFixed(1)} KB), ${Object.keys(js).length} scripts`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await build();
