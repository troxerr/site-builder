// The founding-client deal is one number in src/data/site.json. Render the site with 3, 1 and 0 spots left and check every page agrees.
import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { ROOT } from "../tools/serve.mjs";

function render(spots, intake = spots) {
  const code = `const { renderPages } = await import("./tools/build.mjs"); console.log(JSON.stringify(Object.fromEntries(renderPages().map((p) => [p.path, p.html]))));`;
  return JSON.parse(execFileSync("node", ["--input-type=module", "-e", code], { cwd: ROOT, env: { ...process.env, FOUNDING_SPOTS: String(spots), FOUNDING_INTAKE_SPOTS: String(intake) }, maxBuffer: 64 * 1024 * 1024 }));
}
const count = (s, re) => (s.match(re) || []).length;
const CITY = ["/bartlett/", "/memphis/", "/germantown/", "/cordova/", "/arlington/", "/lakeland/"];

for (const spots of [3, 1]) {
  test(`${spots} spots left: shown on the homepage and demos page, founding prices and plan names everywhere`, () => {
    const pages = render(spots, 0), label = `${spots} of 3 spots left`;
    assert.equal(count(pages["/"], new RegExp(label, "g")), 1, "homepage pricing banner");
    assert.ok(pages["/"].includes('id="founding"'));
    assert.ok(pages["/"].includes('data-plan="Starter ($250 founding price)"'));
    assert.ok(pages["/"].includes("<option>Business ($850 founding price)</option>"));
    assert.ok(pages["/demos/"].includes("Founding-client deal"));
    for (const c of CITY) { assert.ok(pages[c].includes(label), c); assert.ok(pages[c].includes("<s class="), `${c} shows the struck-through regular price`); }
  });
}

test("0 spots left: the deal disappears everywhere and regular prices return", () => {
  const pages = render(0);
  for (const [path, html] of Object.entries(pages)) {
    assert.ok(!/founding/i.test(html), `${path} still mentions the founding deal`);
    assert.ok(!/spots left/i.test(html), `${path} still shows spots left`);
  }
  assert.ok(pages["/"].includes("<option>Starter ($350)</option>") && pages["/"].includes("<option>Business ($950)</option>"));
  assert.ok(pages["/"].includes('data-plan="Starter ($350)"'));
  for (const c of CITY) assert.ok(!pages[c].includes("<s class="), c);
});

test("bail-bond assistant offer has its own counter: 3 and 1 show $147, 0 shows plain $197", () => {
  for (const spots of [3, 1]) {
    const pages = render(0, spots), page = pages["/bail-bonds/"];
    assert.ok(page.includes(`${spots} of 3 spots left`) && page.includes("$147") && page.includes("$197"), `intake ${spots}`);
    assert.ok(pages["/"].includes("$147"), "homepage card shows the founding price");
    assert.ok(!/founding/i.test(pages["/dental/"]), "website deal at 0 stays hidden");
  }
  const pages = render(3, 0);
  assert.ok(!/founding|\$147|spots left/i.test(pages["/bail-bonds/"]), "bail-bonds page has no founding text at 0");
  assert.ok(pages["/bail-bonds/"].includes("$197") && !pages["/"].includes("$147"));
  assert.ok(pages["/"].includes("Founding-client deal"), "website deal unaffected");
});

test("every dollar amount on a page matches src/data/site.json", () => {
  const { site } = { site: JSON.parse(execFileSync("cat", ["src/data/site.json"], { cwd: ROOT, encoding: "utf8" })) };
  const P = site.pricing, F = site.founding;
  const allowed = new Set([P.starter, P.business, P.care, P.textback, P.suite.monthly, P.suite.setup, P.agent.setup, P.agent.monthly, F.discount, P.starter - F.discount, P.business - F.discount, P.textback * 12, P.intake.monthly, P.intake.founding, site.examples.jobProfit, 10, 12, 2600, 0] // 10-12 = yearly domain fee paid to the registrar; 2600 = the dental calculator's starting output (dental.js recalculates it)
    .map((n) => "$" + n.toLocaleString("en-US")));
  const pages = render(site.founding.spotsLeft);
  for (const path of ["/", "/dental/", "/bail-bonds/", ...CITY, "/demos/"]) {
    const text = pages[path].replace(/<script[\s\S]*?<\/script>/g, "").replace(/<[^>]+>/g, " ");
    const strays = [...new Set((text.match(/\$\d[\d,]*\d|\$\d/g) || []).filter((m) => !allowed.has(m)))];
    assert.deepEqual(strays, [], `${path} shows amounts that aren't in site.json`);
  }
});

