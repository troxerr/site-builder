// Small centered pages: thanks, thanks for the booking agent, and 404.
import { ic, site } from "../lib/ui.mjs";

const TEL = `tel:${site.phone.tel}`, PHONE = site.phone.display;

function simple(c, { pill = "", h1, lede, steps = [], buttons, after = "" }) {
  const items = steps.map(([t, d], i) => `<li class="flex gap-3"><span class="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-600 font-display text-xs font-extrabold">${i + 1}</span><span><b class="block text-white">${t}</b>${d}</span></li>`).join("");
  return c.shell(`
<main id="main">
  <section class="relative overflow-hidden bg-gradient-to-b from-brand/25 via-slate-950 to-slate-950 px-4 py-20 sm:px-6 sm:py-28 lg:px-8" aria-labelledby="pg-title">
    <div class="mx-auto max-w-2xl text-center">
      ${pill ? `<p class="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-300">${pill}</p>` : ""}
      <h1 id="pg-title" class="font-display text-4xl font-extrabold tracking-tight sm:text-6xl">${h1}</h1>
      <p class="mt-5 text-lg text-slate-300">${lede}</p>
      ${steps.length ? `<ol class="mx-auto mt-8 max-w-md space-y-4 text-left text-sm text-slate-300">${items}</ol>` : ""}
      <div class="mt-10 flex flex-col justify-center gap-3 sm:flex-row">${buttons}</div>
      ${after}
    </div>
  </section>
</main>
`);
}

export const notFound = (c) => simple(c, {
  h1: '<span class="block font-display text-7xl text-blue-400 sm:text-8xl" aria-hidden="true">404</span>That page isn\'t here.',
  lede: "The link may be old or mistyped. Here's where most people are headed:",
  buttons: `<a class="btn btn-primary" href="/#contact">Get my free draft${ic("arrow")}</a><a class="btn btn-dark" href="/demos/">See live demos</a><a class="btn btn-dark" href="/">Home</a>`,
  after: `<p class="mt-6 text-sm text-slate-400">Or call or text <a class="link" href="${TEL}">${PHONE}</a>.</p>`,
});

export const thanks = (c) => simple(c, {
  pill: "Sent &middot; your request", h1: "Got it, thanks!", lede: "Here's what happens next:",
  steps: [["I reply in 1–3 business days", "By text or email, with a couple of quick questions about your business."],
    ["Your draft follows once details are confirmed", "Usually 2–3 days after I have your business details. Open it on your phone and share your feedback."],
    ["You decide", "Love it, and we agree on a price before you pay. If not, you owe nothing."]],
  buttons: `<a class="btn btn-primary" href="${TEL}">${ic("phone")}Call or text ${PHONE}</a><a class="btn btn-dark" href="/demos/">Browse live demos</a>`,
});

export const thanksAgent = (c) => simple(c, {
  pill: "Sent &middot; your booking agent request", h1: "Got it, thanks!", lede: "Here's what happens next:",
  steps: [["I reply in 1–3 business days", "By text or email, to set up a short call."],
    ["We check your phones and calendar", "I confirm your scheduling software can connect before you pay anything."],
    ["You decide", "The price is in writing before setup starts. No long-term contract."]],
  buttons: `<a class="btn btn-primary" href="${TEL}">${ic("phone")}Call or text ${PHONE}</a><a class="btn btn-dark" href="/demos/missed-call-booking-agent/">Watch the demo again</a>`,
});

export const thanksTextback = (c) => simple(c, {
  pill: "Sent &middot; your text-back demo request", h1: "Your demo request is in.",
  lede: "I’ll reply in 1–3 business days to discuss your missed calls and phone setup.",
  steps: [["We check your phone setup", "I confirm compatibility and explain the number arrangements."],
    ["You see how follow-up works", "We walk through the automatic reply, customer message and owner’s inbox."],
    ["You decide", "Usage, any extra charges and cancellation steps are confirmed before paid work starts."]],
  buttons: `<a class="btn btn-primary" href="sms:${site.phone.tel}">Text Austin</a><a class="btn btn-dark" href="/#booking-agent">Review the text-back example</a>`,
});

