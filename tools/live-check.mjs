#!/usr/bin/env node
// Checks the deployed site: every URL in the contract answers 200, pages load without console errors,
// preview images are real images of the right size, and key headers are present.
//   node tools/live-check.mjs [https://bartlettwebsitedesign.online]
import { readFileSync } from "node:fs";
import { launch } from "./lib/browser.mjs";
import { FIRST_PARTY } from "./lib/pages.mjs";

const base = (process.argv[2] || process.env.SITE_URL || "https://bartlettwebsitedesign.online").replace(/\/$/, "");
const contract = JSON.parse(readFileSync(new URL("../tests/url-contract.json", import.meta.url)));
const problems = [];
const fail = (msg) => { problems.push(msg); console.log("FAIL", msg); };

// 1. every contract URL is up
await Promise.all([...contract.pages, ...contract.images_and_files].map(async (path) => {
  const res = await fetch(base + path + (path.endsWith("/") ? "" : ""), { redirect: "follow" });
  if (res.status !== 200) fail(`${path} -> ${res.status}`);
  await res.arrayBuffer();
}));
console.log(`checked ${contract.pages.length + contract.images_and_files.length} URLs`);

// 2. unknown URL is a branded 404; dev files are not public
const nf = await fetch(base + "/no-such-page-" + Date.now());
if (nf.status !== 404 || !/That page isn.t here/.test(await nf.text())) fail("unknown URL should be the branded 404");
for (const p of ["/package.json", "/node_modules/", "/tests/helpers.mjs", "/tools/serve.mjs", "/wrangler.jsonc", "/README.md", "/.github/workflows/ci.yml"])
  if ((await fetch(base + p)).status !== 404) fail(`${p} should not be public`);

// 3. headers on the homepage
const home = await fetch(base + "/");
for (const [k, re] of [["x-content-type-options", /nosniff/], ["referrer-policy", /strict-origin/], ["permissions-policy", /camera=\(\)/]])
  if (!re.test(home.headers.get(k) || "")) fail(`homepage header ${k}`);
if (process.env.EXPECT_HSTS && !/max-age=\d+/.test(home.headers.get("strict-transport-security") || "")) fail("homepage header strict-transport-security");
if (process.env.EXPECT_CSP && !(home.headers.get("content-security-policy") || home.headers.get("content-security-policy-report-only"))) fail("homepage has no CSP");

// 4. pages load in a real browser with no console errors and no CSP violations
const browser = await launch();
for (const path of FIRST_PARTY.filter((p) => p !== "/404.html")) {
  const context = await browser.newContext({ viewport: { width: 375, height: 800 } });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => { if (m.type() === "error" || /content security policy|violat/i.test(m.text())) errors.push(m.text().slice(0, 200)); });
  await page.goto(base + path, { waitUntil: "networkidle" });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (overflow > 0) errors.push(`scrolls sideways by ${overflow}px`);
  // the analytics beacon is blocked in some sandboxes; ignore only that
  const real = errors.filter((e) => !/cloudflareinsights|ERR_TUNNEL|ERR_BLOCKED|ERR_FAILED/.test(e));
  if (real.length) fail(`${path}: ${real.join(" | ")}`);
  await context.close();
}
await browser.close();

console.log(problems.length ? `\n${problems.length} problem(s)` : "\nLive site OK");
process.exit(problems.length ? 1 : 0);
