// URLs that people already have (texted links, posts, the sitemap) must keep working, and unknown URLs must 404 with the branded page.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createSite } from "../tools/serve.mjs";

const contract = JSON.parse(readFileSync(new URL("./url-contract.json", import.meta.url)));
let site;
before(async () => { site = await createSite(); });
after(async () => { await site.close(); });

for (const path of [...contract.pages, ...contract.images_and_files]) {
  test(`200 ${path}`, async () => {
    const res = await fetch(site.url + path);
    assert.equal(res.status, 200);
    await res.arrayBuffer();
  });
}

test("folder URL without a trailing slash redirects to the slash", async () => {
  const res = await fetch(site.url + "/demos", { redirect: "manual" });
  assert.equal(res.status, 301);
  assert.equal(res.headers.get("location"), "/demos/");
});

test("unknown URL returns 404 with the branded page", async () => {
  const res = await fetch(site.url + "/no-such-page");
  assert.equal(res.status, 404);
  assert.match(await res.text(), /That page isn.t here/);
});

test("development files are not served", async () => {
  for (const path of ["/package.json", "/node_modules/ignore/package.json", "/tests/helpers.mjs", "/tools/serve.mjs", "/README.md", "/wrangler.jsonc"]) {
    assert.equal((await fetch(site.url + path)).status, 404, path);
  }
});
