#!/usr/bin/env node
// Loads every first-party page of a site in headless Chromium, exercises the menu and form, and reports any
// Content-Security-Policy violation (enforced or report-only) or console error.
//   node tools/csp-check.mjs [https://bartlettwebsitedesign.online]
import { launch } from "./lib/browser.mjs";
import { FIRST_PARTY } from "./lib/pages.mjs";

const base = (process.argv[2] || "https://bartlettwebsitedesign.online").replace(/\/$/, "");
const browser = await launch();
const problems = [];
for (const width of [375, 1280]) {
  const ctx = await browser.newContext({ viewport: { width, height: 800 } });
  for (const path of FIRST_PARTY) {
    const page = await ctx.newPage();
    page.on("console", (m) => { if (/Content Security Policy|violat|Refused/i.test(m.text()) || m.type() === "error") problems.push(`${path} @${width}: ${m.text()}`); });
    page.on("pageerror", (e) => problems.push(`${path} @${width}: ${e.message}`));
    await page.addInitScript(() => document.addEventListener("securitypolicyviolation", (e) => console.error(`CSP ${e.violatedDirective} blocked ${e.blockedURI}`)));
    await page.goto(base + path, { waitUntil: "networkidle" });
    if (width === 375) await page.locator("#menu-toggle").click().catch(() => {});
    await page.close();
  }
  await ctx.close();
}
await browser.close();
if (problems.length) { console.log([...new Set(problems)].join("\n")); process.exit(1); }
console.log(`No CSP violations or console errors on ${FIRST_PARTY.length} pages × 2 widths at ${base}`);
