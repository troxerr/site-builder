// Every demo page must have zero axe violations at phone and desktop width (same bar as the main site).
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { allHtmlPaths } from "../tools/lib/pages.mjs";
import { startEnv } from "./helpers.mjs";

const axePath = createRequire(import.meta.url).resolve("axe-core");
let env;
before(async () => { env = await startEnv(); });
after(async () => { await env.close(); });

const pages = allHtmlPaths().filter((p) => p.startsWith("/demos/") && p !== "/demos/");
for (const page of pages) {
  for (const width of [375, 1280]) {
    test(`axe on ${page} at ${width}px`, async () => {
      const p = await env.newPage({ width });
      await p.goto(env.site.url + page, { waitUntil: "networkidle" });
      await p.addScriptTag({ path: axePath });
      const found = await p.evaluate(async () => (await axe.run(document, { resultTypes: ["violations"] })).violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.length} × ${v.nodes[0].target.join(" ").slice(0, 80)}`));
      await p.context().close();
      assert.deepEqual(found, []);
    });
  }
}
