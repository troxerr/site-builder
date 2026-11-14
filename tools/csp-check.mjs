#!/usr/bin/env node
// Loads every first-party page and every demo of a site in headless Chromium and reports any Content-Security-Policy
// violation (enforced or report-only) or console error. A fresh browser context per page keeps long runs stable.
//   node tools/csp-check.mjs [https://bartlettwebsitedesign.online]
import { launch } from "./lib/browser.mjs";
import { FIRST_PARTY, DEMOS } from "./lib/pages.mjs";

// Demos are self-contained sites (inline styles, Google Fonts) and must NOT get the first-party policy: check them too.
const PAGES = [...FIRST_PARTY, ...DEMOS.map((d) => `/demos/${d}/`)];
const base = (process.argv[2] || "https://bartlettwebsitedesign.online").replace(/\/$/, "");
const browser = await launch();
const problems = [];
for (const width of [375, 1280]) {
  for (const path of PAGES) {
    const ctx = await browser.newContext({ viewport: { width, height: 800 } });
    try {
      const page = await ctx.newPage();
      page.on("console", (m) => { if (/Content Security Policy|violat|Refused/i.test(m.text()) || m.type() === "error") problems.push(`${path} @${width}: ${m.text()}`); });
      page.on("pageerror", (e) => problems.push(`${path} @${width}: ${e.message}`));
      await page.addInitScript(() => document.addEventListener("securitypolicyviolation", (e) => console.error(`CSP ${e.violatedDirective} blocked ${e.blockedURI}`)));
      await page.goto(base + path, { waitUntil: "networkidle", timeout: 30000 });
      if (width === 375) await page.locator("#menu-toggle").click({ timeout: 1000 }).catch(() => {});
    } catch (e) { problems.push(`${path} @${width}: ${String(e.message).split("\n")[0]}`); }
    await ctx.close();
  }
}
await browser.close();
if (problems.length) { console.log([...new Set(problems)].join("\n")); process.exit(1); }
console.log(`No CSP violations or console errors on ${PAGES.length} pages (first-party and demos) × 2 widths at ${base}`);
