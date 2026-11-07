// Shared browser setup: a hermetic Chromium (no real network), plus helpers used by tests and snapshots.
import { chromium } from "playwright";

export async function launch() {
  return chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
}

const PNG_1PX = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==", "base64");

/** Answers every request that isn't the local site with an empty response of the right type, so pages
 *  render the same offline, in CI and on a laptop. `allow` lets specific hosts through. */
export async function stubExternal(context, siteUrl, { allow = [] } = {}) {
  await context.route((url) => !url.href.startsWith(siteUrl) && !allow.some((h) => url.hostname === h), (route) => {
    const type = route.request().resourceType();
    if (type === "script") return route.fulfill({ status: 200, contentType: "text/javascript", body: "" });
    if (type === "stylesheet") return route.fulfill({ status: 200, contentType: "text/css", body: "" });
    if (type === "image") return route.fulfill({ status: 200, contentType: "image/png", body: PNG_1PX });
    if (type === "font") return route.fulfill({ status: 200, contentType: "font/woff2", body: "" });
    return route.fulfill({ status: 204, body: "" });
  });
}

/** Makes Math.random repeatable, so shuffled lists render in the same order every run. */
export const seedRandom = (seed = 12345) => `(() => { let s = ${seed}; Math.random = () => (s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296; })();`;

/** Collects console errors and uncaught exceptions on a page. */
export function watchErrors(page) {
  const errors = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => { if (m.type() === "error") errors.push(`console: ${m.text()}`); });
  return errors;
}

/** Forces lazy images to load and waits for them, so full-page screenshots are complete. */
export async function loadAllImages(page) {
  await page.evaluate(async () => {
    document.querySelectorAll("img[loading=lazy]").forEach((i) => { i.loading = "eager"; });
    await Promise.all([...document.images].map((i) => i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; })));
  });
}
