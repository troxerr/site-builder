// What visitors can do: send the form, open the menu, drag the slider, browse the demos.
// The form provider (Web3Forms) is replaced by a stand-in that records what would have been sent.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { startEnv } from "./helpers.mjs";

let env;
before(async () => { env = await startEnv(); });
after(async () => { await env.close(); });

/** A page whose Web3Forms calls are recorded in `sent` and answered with `reply`. */
async function pageWithForm({ reply = { success: true }, width = 1280, rewriteHome } = {}) {
  const sent = [];
  const page = await env.newPage({
    width,
    route: async (context) => {
      await context.route("https://api.web3forms.com/**", (route) => {
        sent.push(Object.fromEntries([...route.request().postData().matchAll(/name="([^"]+)"\r\n\r\n([^\r]*)/g)].map((m) => [m[1], m[2]])));
        return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(reply) });
      });
      if (rewriteHome) await context.route(env.site.url + "/", async (route) => { const res = await route.fetch(); await route.fulfill({ response: res, body: rewriteHome(await res.text()) }); });
    },
  });
  return { page, sent };
}
async function fillAndSend(page, { name = "Test Person", business = "Test Shop", reach = "9015551234" } = {}) {
  await page.fill("#contact-form [name=name]", name);
  await page.fill("#contact-form [name=business]", business);
  await page.fill("#contact-form [name=reach]", reach);
  await page.click("#contact-form button[type=submit]");
}

test("homepage form: a website plan sends the request and lands on /thanks/", async () => {
  const { page, sent } = await pageWithForm();
  await page.goto(env.site.url + "/", { waitUntil: "networkidle" });
  await page.locator('a[data-plan^="Starter"]').click();
  await fillAndSend(page);
  await page.waitForURL(/\/thanks\/$/);
  assert.equal(sent.length, 1);
  assert.match(sent[0].subject, /^Free draft request: Test Shop \(Starter/);
  assert.equal(sent[0].business, "Test Shop");
  assert.equal(sent[0].from_name, "bartlettwebsitedesign.online");
  assert.ok(sent[0].access_key, "has the form key");
  await page.context().close();
});

test("homepage form: the booking agent plan is counted separately", async () => {
  const { page, sent } = await pageWithForm();
  await page.goto(env.site.url + "/", { waitUntil: "networkidle" });
  await page.selectOption("#plan", { index: 6 });
  await fillAndSend(page);
  await page.waitForURL(/\/thanks\/booking-agent\/$/);
  assert.match(sent[0].subject, /^Booking agent inquiry: Test Shop/);
  await page.context().close();
});

test("homepage form: the text-back plan is labelled in the email subject", async () => {
  const { page, sent } = await pageWithForm();
  await page.goto(env.site.url + "/", { waitUntil: "networkidle" });
  await page.locator('a[data-plan^="Missed-call text-back"]').first().click();
  await fillAndSend(page);
  await page.waitForURL(/\/thanks\/$/);
  assert.match(sent[0].subject, /^Text-back inquiry: Test Shop/);
  await page.context().close();
});

test("homepage form: a failed send keeps the visitor on the page with a way to reach Austin", async () => {
  const { page } = await pageWithForm({ reply: { success: false, message: "nope" } });
  await page.goto(env.site.url + "/", { waitUntil: "networkidle" });
  await fillAndSend(page);
  await page.waitForFunction(() => /Something went wrong/.test(document.getElementById("form-status").textContent));
  assert.ok(await page.locator("#form-status a[href^='tel:']").count(), "offers the phone number");
  assert.ok(await page.locator("#form-status a[href^='mailto:']").count(), "offers the email");
  assert.equal(await page.locator("#contact-form button[type=submit]").isEnabled(), true);
  assert.equal(new URL(page.url()).pathname, "/");
  await page.context().close();
});

test("homepage form: required fields stop an empty send", async () => {
  const { page, sent } = await pageWithForm();
  await page.goto(env.site.url + "/", { waitUntil: "networkidle" });
  await page.click("#contact-form button[type=submit]");
  assert.equal(sent.length, 0);
  assert.equal(await page.evaluate(() => document.querySelector("#contact-form").checkValidity()), false);
  await page.context().close();
});

test("dental form and calculator", async () => {
  const { page, sent } = await pageWithForm();
  await page.goto(env.site.url + "/dental/", { waitUntil: "networkidle" });
  await page.fill("#c-calls", "20");
  assert.equal(await page.textContent("#o-callers"), "26");
  assert.equal(await page.textContent("#o-value"), "$5,200");
  await page.fill("#c-value", "0");
  assert.match(await page.textContent("#o-even"), /Enter what a booked visit is worth/);
  await fillAndSend(page, { business: "Test Dental" });
  await page.waitForURL(/\/thanks\/booking-agent\/$/);
  assert.match(sent[0].subject, /^Booking agent inquiry: Test Dental/);
  await page.context().close();
});

test("phone menu opens, closes on a link tap, and reports its state", async () => {
  const { page } = await pageWithForm({ width: 375 });
  for (const path of ["/", "/dental/", "/bartlett/", "/demos/"]) {
    await page.goto(env.site.url + path, { waitUntil: "networkidle" });
    const toggle = page.locator("#menu-toggle");
    assert.equal(await toggle.getAttribute("aria-expanded"), "false");
    await toggle.click();
    assert.equal(await toggle.getAttribute("aria-expanded"), "true");
    assert.ok(await page.locator("#nav a").first().isVisible(), `${path}: menu links visible`);
    await page.locator("#nav a").first().click();
    assert.equal(await toggle.getAttribute("aria-expanded"), "false", `${path}: closes after a tap`);
  }
  await page.context().close();
});

test("before/after slider: keyboard, buttons, drag and trade tabs", async () => {
  const { page } = await pageWithForm();
  await page.goto(env.site.url + "/", { waitUntil: "networkidle" });
  const now = async () => Number(await page.getAttribute("#slider-handle", "aria-valuenow"));
  assert.equal(await now(), 50);
  await page.focus("#slider-handle");
  await page.keyboard.press("ArrowRight"); await page.keyboard.press("ArrowRight");
  assert.equal(await now(), 60);
  await page.keyboard.press("Home"); assert.equal(await now(), 4);
  await page.click('[data-slide="92"]'); assert.equal(await now(), 92);
  await page.click('[data-slide="8"]'); assert.equal(await now(), 8);
  const box = await page.locator("#comparison-stage").boundingBox();
  await page.mouse.move(box.x + box.width * 0.5, box.y + 200); await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.8, box.y + 200, { steps: 5 }); await page.mouse.up();
  assert.equal(await now(), 80);
  await page.click("#tab-auto");
  assert.equal(await page.isVisible("#after-auto"), true);
  assert.equal(await page.isVisible("#after-roofing"), false);
  assert.equal(await page.getAttribute("#tab-auto", "aria-selected"), "true");
  assert.match(await page.textContent("#before-title"), /Auto/);
  await page.context().close();
});

test("homepage shows the curated five demos in a fixed order", async () => {
  const { page } = await pageWithForm();
  const orders = new Set();
  for (let i = 0; i < 6; i++) {
    await page.goto(env.site.url + "/", { waitUntil: "networkidle" });
    const shown = await page.$$eval(".work > .work-item:not([hidden]):not(.wide) h3", (hs) => hs.map((h) => h.textContent));
    assert.equal(shown.length, 5, "the five curated public concepts");
    assert.equal(new Set(shown).size, 5, "no repeats");
    orders.add(shown.join("|"));
  }
  assert.equal(orders.size, 1, "curated order stays stable between visits");
  await page.context().close();
});

test("demos page lists the curated five in a fixed order", async () => {
  const { page } = await pageWithForm();
  const orders = new Set();
  for (let i = 0; i < 5; i++) {
    await page.goto(env.site.url + "/demos/", { waitUntil: "networkidle" });
    const names = await page.$$eval(".demo-list > li h2", (hs) => hs.map((h) => h.textContent));
    assert.equal(names.length, 5, "only the five public demos");
    assert.equal(new Set(names).size, 5);
    orders.add(names.join("|"));
  }
  assert.equal(orders.size, 1, "curated order stays stable between visits");
  await page.context().close();
});

test("phone first screen (375×667): headline and both buttons sit above the sticky call bar", async () => {
  const page = await env.newPage({ width: 375, height: 667 });
  await page.goto(env.site.url + "/", { waitUntil: "networkidle" });
  const barTop = await page.locator(".mobile-bar").evaluate((el) => el.getBoundingClientRect().top);
  assert.ok(await page.locator("h1").evaluate((el) => el.getBoundingClientRect().top) < 300, "headline near the top");
  for (const label of ["Get my free draft", "See the difference"]) {
    const bottom = await page.locator("main a.btn", { hasText: label }).first().evaluate((el) => el.getBoundingClientRect().bottom);
    assert.ok(bottom <= barTop, `"${label}" ends at ${Math.round(bottom)}px, but the call bar starts at ${Math.round(barTop)}px`);
  }
  await page.context().close();
});

test("demos page: industry chips filter the list, and without JavaScript every demo shows", async () => {
  const page = await env.newPage({ width: 1280 });
  await page.goto(env.site.url + "/demos/", { waitUntil: "networkidle" });
  const visible = () => page.locator(".demo-list > li:visible").count();
  assert.equal(await visible(), 5);
  assert.equal(await page.locator('[data-filter="pets"]').count(), 0, "no chip for a category without a public demo");
  await page.click('[data-filter="food"]');
  assert.equal(await visible(), 2);
  assert.equal(await page.getAttribute('[data-filter="food"]', "aria-pressed"), "true");
  assert.match(await page.textContent("#demo-count"), /Showing 2 demos/);
  await page.click('[data-filter="all"]');
  assert.equal(await visible(), 5);
  await page.context().close();
  const noJs = await (await env.browser.newContext({ javaScriptEnabled: false })).newPage();
  await noJs.goto(env.site.url + "/demos/");
  assert.equal(await noJs.locator(".demo-list > li:visible").count(), 5);
  assert.equal(await noJs.locator("#demo-filter").isVisible(), false, "chips stay hidden without JS");
  await noJs.context().close();
});

test("scroll reveal: below-the-fold sections fade in for normal motion, and show immediately with reduced motion", async () => {
  for (const [reducedMotion, expectReveal] of [["no-preference", true], ["reduce", false]]) {
    const ctx = await env.browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion });
    const page = await ctx.newPage();
    await page.goto(env.site.url + "/", { waitUntil: "networkidle" });
    assert.equal((await page.locator("main > section > .reveal").count()) > 0, expectReveal, `reducedMotion=${reducedMotion}`);
    if (expectReveal) {
      await page.locator("#faq").scrollIntoViewIfNeeded();
      await page.waitForFunction(() => document.querySelector("#faq .reveal.is-in, #faq.reveal.is-in, #faq > .is-in"), null, { timeout: 3000 });
    }
    await ctx.close();
  }
});

test("bail-bonds form sends the lead and lands on the booking-agent thanks page", async () => {
  const { page, sent } = await pageWithForm();
  await page.goto(env.site.url + "/bail-bonds/", { waitUntil: "networkidle" });
  await fillAndSend(page, { business: "Test Bonding Co" });
  await page.waitForURL("**/thanks/booking-agent/");
  assert.equal(sent.length, 1);
  assert.equal(sent[0].subject, "Bail bond assistant inquiry: Test Bonding Co");
  assert.match(sent[0].plan, /Bail bond intake assistant/);
  await page.context().close();
});

