#!/usr/bin/env node
// Visual regression for refactors.
//   node tools/snapshot.mjs before            takes screenshots of every first-party page at 3 widths into .snapshots/before/
//   node tools/snapshot.mjs after             same, into .snapshots/after/
//   node tools/snapshot.mjs --compare before after [--max 0.0]   pixel-diffs two sets, writes .snapshots/diff/, exits 1 above the limit
// Shuffles are seeded and animations disabled, so identical code gives identical pixels.
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import { createSite, ROOT } from "./serve.mjs";
import { launch, stubExternal, seedRandom, loadAllImages } from "./lib/browser.mjs";
import { FIRST_PARTY } from "./lib/pages.mjs";

const WIDTHS = [375, 768, 1280];
const slug = (p) => (p === "/" ? "home" : p.replace(/^\/|\/$/g, "").replace(/[/.]/g, "-"));
const dir = (name) => join(ROOT, ".snapshots", name);

async function take(name) {
  const out = dir(name);
  await mkdir(out, { recursive: true });
  const site = await createSite();
  const browser = await launch();
  for (const width of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce", deviceScaleFactor: 1 });
    await stubExternal(ctx, site.url);
    await ctx.addInitScript(seedRandom());
    for (const path of FIRST_PARTY) {
      const page = await ctx.newPage();
      await page.goto(site.url + path, { waitUntil: "networkidle" });
      await loadAllImages(page);
      await page.addStyleTag({ content: "*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}" });
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: join(out, `${slug(path)}-${width}.png`), fullPage: true });
      if (width === 1280) await writeFile(join(out, `${slug(path)}.txt`), await page.evaluate(() => document.body.innerText));
      await page.close();
    }
    await ctx.close();
  }
  await browser.close();
  await site.close();
  console.log(`Saved ${FIRST_PARTY.length * WIDTHS.length} screenshots to ${out}`);
}

async function compare(a, b, max) {
  const files = (await readdir(dir(a))).filter((f) => f.endsWith(".png"));
  await mkdir(dir("diff"), { recursive: true });
  let worst = 0;
  for (const f of files) {
    const one = PNG.sync.read(await readFile(join(dir(a), f)));
    const two = PNG.sync.read(await readFile(join(dir(b), f)).catch(() => { throw new Error(`missing in ${b}: ${f}`); }));
    if (one.width !== two.width || one.height !== two.height) {
      console.log(`DIFF  ${f}: size ${one.width}x${one.height} -> ${two.width}x${two.height}`);
      worst = 100;
      continue;
    }
    const diff = new PNG({ width: one.width, height: one.height });
    const n = pixelmatch(one.data, two.data, diff.data, one.width, one.height, { threshold: 0.1 });
    const pct = (n / (one.width * one.height)) * 100;
    worst = Math.max(worst, pct);
    if (n) { await writeFile(join(dir("diff"), f), PNG.sync.write(diff)); console.log(`DIFF  ${f}: ${n} pixels (${pct.toFixed(3)}%)`); }
    else console.log(`same  ${f}`);
  }
  for (const f of (await readdir(dir(a))).filter((f) => f.endsWith(".txt"))) {
    const same = (await readFile(join(dir(a), f), "utf8")) === (await readFile(join(dir(b), f), "utf8").catch(() => null));
    console.log(`${same ? "same" : "DIFF"}  ${f} (visible text)`);
    if (!same) worst = Math.max(worst, 100);
  }
  console.log(`Worst difference: ${worst.toFixed(3)}% (limit ${max}%)`);
  process.exit(worst > max ? 1 : 0);
}

const args = process.argv.slice(2);
if (args[0] === "--compare") {
  const maxIdx = args.indexOf("--max");
  await compare(args[1] || "before", args[2] || "after", maxIdx > -1 ? Number(args[maxIdx + 1]) : 0);
} else {
  await take(args[0] || "before");
}
