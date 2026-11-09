// The demo catalogue (src/data/demos.json) and the demo folders must agree.
import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "../tools/serve.mjs";

const demos = JSON.parse(readFileSync(join(ROOT, "src/data/demos.json"), "utf8"));
const CATEGORIES = ["building", "services", "pets", "health", "property", "food", "showcase"];
const folders = readdirSync(join(ROOT, "demos")).filter((f) => statSync(join(ROOT, "demos", f)).isDirectory());
const local = demos.filter((d) => !d.href.startsWith("http"));

test("every demo folder is in the catalogue, and every local catalogue entry has a folder", () => {
  assert.deepEqual(folders.sort(), local.map((d) => d.id).sort());
});

for (const d of local) {
  test(`demo ${d.id}: category, images and front page`, () => {
    assert.ok(CATEGORIES.includes(d.category), `category "${d.category}"`);
    for (const f of [`assets/work/${d.thumb}.webp`, `assets/work/${d.thumb}-sm.webp`, `demos/${d.id}/index.html`]) assert.ok(existsSync(join(ROOT, f)), `missing ${f}`);
    const html = readFileSync(join(ROOT, `demos/${d.id}/index.html`), "utf8");
    const og = html.match(/property="og:image" content="https:\/\/bartlettwebsitedesign\.online(\/[^"]+)"/)?.[1];
    assert.ok(og && existsSync(join(ROOT, og)), `preview image ${og}`);
    assert.match(html, /<aside class="bwd-demo-bar" aria-label="About this demo"/, "demo bar");
    assert.match(html, /<meta name="robots" content="noindex/, "noindex");
  });
}

// Demos of real businesses are unlisted: their URLs keep working (links already sent to owners), but we never link to them.
const PUBLIC = ["castle-above-clouds", "cedar-and-hickory-bbq", "linen-and-lark-salon", "missed-call-booking-agent", "summit-roofing"];

test("only invented businesses (and the castle showcase) are public", () => {
  assert.deepEqual(demos.filter((d) => d.public).map((d) => d.id).sort(), PUBLIC);
  assert.ok(demos.every((d) => typeof d.public === "boolean"), "every demo has a public flag");
});

test("no first-party page links to an unlisted demo", async () => {
  const { FIRST_PARTY, fileFor } = await import("../tools/lib/pages.mjs");
  const unlisted = demos.filter((d) => !d.public).map((d) => d.id);
  for (const page of FIRST_PARTY) {
    const html = readFileSync(fileFor(page), "utf8");
    for (const id of unlisted) assert.ok(!html.includes(`/demos/${id}`), `${page} links to unlisted demo ${id}`);
    assert.ok(!html.includes("waggles-stay-n-play.com"), `${page} links to a real business's own site`);
  }
});
