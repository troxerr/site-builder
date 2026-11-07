// Each main page, at phone and desktop width: no axe accessibility violations, no console errors,
// no horizontal scrolling, no leftover placeholder text.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { FIRST_PARTY } from "../tools/lib/pages.mjs";
import { startEnv } from "./helpers.mjs";
import { watchErrors } from "../tools/lib/browser.mjs";

const axePath = createRequire(import.meta.url).resolve("axe-core");
let env;
before(async () => { env = await startEnv(); });
after(async () => { await env.close(); });

for (const page of FIRST_PARTY) {
  for (const width of [375, 1280]) {
    test(`${page} at ${width}px`, async () => {
      const p = await env.newPage({ width });
      const errors = watchErrors(p);
      await p.goto(env.site.url + page, { waitUntil: "networkidle" });
      await p.addScriptTag({ path: axePath });
      const violations = await p.evaluate(async () => (await axe.run(document, { resultTypes: ["violations"] })).violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.slice(0, 2).map((n) => n.target.join(" ")).join(" | ")}`));
      assert.deepEqual(violations, [], "accessibility");
      assert.deepEqual(errors.filter((e) => page !== "/404.html" || !/404/.test(e)), [], "console errors");
      const overflow = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      assert.ok(overflow <= 0, `page scrolls sideways by ${overflow}px`);
      const visible = await p.evaluate(() => document.body.innerText);
      assert.doesNotMatch(visible, /lorem ipsum|TODO|FIXME|undefined|\[object Object\]|\{\{|\}\}|example\.com/i, "placeholder text visible");
      await p.context().close();
    });
  }
}
