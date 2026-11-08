// The demos page. Data: src/data/demos.json. The order is shuffled on every visit by src/js/demos.js.
import { ic, HL, demos, demoPageCard, site, DEMO_CATEGORIES } from "../lib/ui.mjs";

const TEL = `tel:${site.phone.tel}`, PHONE = site.phone.display;

export default (c) => c.shell(`
<main id="main">
  <section class="relative overflow-hidden bg-gradient-to-b from-brand/25 via-slate-950 to-slate-950 px-4 pb-10 pt-12 sm:px-6 sm:pt-16 lg:px-8" aria-labelledby="pg-title">
    <div class="mx-auto max-w-6xl">
      <p class="text-sm text-slate-400"><a class="link" href="/">Home</a> &rsaquo; Website demos</p>
      <p class="kicker mt-6">Website demos</p>
      <h1 id="pg-title" class="mt-2 max-w-4xl font-display text-[2.3rem] font-extrabold leading-[1.08] tracking-tight sm:text-6xl">Live demos, built the same way I'll build ${HL}yours.</span></h1>
      <p class="mt-6 max-w-3xl text-lg leading-relaxed text-slate-300">Every demo below is a full website you can scroll, tap and try on your phone. Each one has its own logo, colors and layout, built around how that business actually gets customers.</p>
      <p class="mt-6 flex max-w-3xl gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-sm text-slate-300">${ic("eye", "w-5 h-5 shrink-0 text-blue-400")}<span>These are demos I built to show what's possible. They aren't the businesses' official websites, and Cedar &amp; Hickory BBQ, Linen &amp; Lark Salon, Summit Roofing and Bright Smile Dental are made-up businesses.</span></p>
    </div>
  </section>

  <section class="px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8" aria-label="All demos">
    <div class="mx-auto max-w-6xl">
      <div id="demo-filter" hidden><div class="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter demos by industry">
        <button type="button" class="chip is-active" data-filter="all" aria-pressed="true">All ${demos.length}</button>
${DEMO_CATEGORIES.map(([k, n]) => `        <button type="button" class="chip" data-filter="${k}" aria-pressed="false">${n} ${demos.filter((d) => d.category === k).length}</button>`).join("\n")}
      </div></div>
      <p id="demo-count" class="sr-only" role="status" aria-live="polite"></p>
      <ul class="demo-list grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
${demos.map(demoPageCard).join("")}      </ul>
      <div class="mt-14 flex flex-col gap-6 rounded-3xl border border-blue-900/50 bg-gradient-to-r from-blue-950/50 via-slate-900 to-slate-900 p-7 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
        <div><h2 class="font-display text-2xl font-extrabold sm:text-3xl">Want to see yours next?</h2><p class="mt-2 text-slate-300">Tell me about your business and I'll build a free working draft. You only pay if you love it.</p>${c.foundingNote("mt-4")}</div>
        <div class="flex shrink-0 flex-col gap-3 sm:flex-row"><a class="btn btn-primary" href="/#contact">Get my free draft</a><a class="btn btn-dark" href="${TEL}">${ic("phone")}${PHONE}</a></div>
      </div>
    </div>
  </section>
</main>
`);
