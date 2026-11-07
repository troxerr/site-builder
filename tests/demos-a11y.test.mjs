// Demos are separate designs, so they get a ratchet instead of a zero rule: each page's accessibility violations
// are recorded in tests/demos-a11y.baseline.json and may only go down. `npm run baseline` records a new low.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { allHtmlPaths } from "../tools/lib/pages.mjs";
import { startEnv } from "./helpers.mjs";

const axePath = createRequire(import.meta.url).resolve("axe-core");
const BASELINE = new URL("./demos-a11y.baseline.json", import.meta.url);
const baseline = existsSync(BASELINE) ? JSON.parse(readFileSync(BASELINE)) : {};
const update = !!process.env.UPDATE_BASELINE;
const results = {};
let env;
before(async () => { env = await startEnv(); });
after(async () => {
  await env.close();
  if (update) { writeFileSync(BASELINE, JSON.stringify(results, null, 2) + "\n"); console.log("Baseline written to tests/demos-a11y.baseline.json"); }
});

const pages = allHtmlPaths().filter((p) => p.startsWith("/demos/") && p !== "/demos/");
for (const page of pages) {
  test(`axe on ${page}`, async () => {
    const p = await env.newPage({ width: 375 });
    await p.goto(env.site.url + page, { waitUntil: "networkidle" });
    await p.addScriptTag({ path: axePath });
    const found = await p.evaluate(async () => {
      const out = {};
      for (const v of (await axe.run(document, { resultTypes: ["violations"] })).violations) out[`${v.id} (${v.impact})`] = v.nodes.length;
      return out;
    });
    results[page] = found;
    await p.context().close();
    if (update) return;
    const allowed = baseline[page];
    assert.ok(allowed, `no baseline for ${page}: run npm run baseline`);
    const worse = Object.entries(found).filter(([rule, n]) => n > (allowed[rule] ?? 0)).map(([rule, n]) => `${rule}: ${allowed[rule] ?? 0} -> ${n}`);
    assert.deepEqual(worse, [], "accessibility got worse");
  });
}
