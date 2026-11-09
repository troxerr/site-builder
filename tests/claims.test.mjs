// Things a visitor, prospect or competitor must never find on our own pages.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { FIRST_PARTY, fileFor } from "../tools/lib/pages.mjs";

const FORBIDDEN = [
  [/Placeholder:/i, "placeholder text"],
  [/Client quote (about|for)/i, "sample testimonial"],
  [/Never fill with made-up/i, "internal note"],
  [/real client testimonials go here/i, "internal note"],
  [/\b(by hand|hand-built|hand-coded|handcoded|coded from scratch|from scratch)\b/i, "claim about how the sites are built"],
  [/lorem ipsum/i, "lorem ipsum"],
];

for (const page of FIRST_PARTY) {
  test(`no placeholder text or build-method claims on ${page}`, () => {
    const html = readFileSync(fileFor(page), "utf8").replace(/<script[\s\S]*?<\/script>/g, "");
    for (const [re, what] of FORBIDDEN) assert.ok(!re.test(html), `${page} contains ${what}: ${re}`);
  });
}
