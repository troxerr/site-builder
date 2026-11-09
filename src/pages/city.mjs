// A city landing page ("Website design in Bartlett"). Data: src/data/cities.json
import { ic, HL, CHECK, plain, founding, foundingActive, publicDemos as demos, demoCityCard, faqDetails, promise, areas, money, site } from "../lib/ui.mjs";

const P = site.pricing, TEL = `tel:${site.phone.tel}`, PHONE = site.phone.display;
const price = (name, amt, unit, what) => `<li class="rounded-2xl border border-slate-800 bg-slate-900/90 p-6"><p class="text-xs font-semibold uppercase tracking-wider text-blue-400">${name}</p><p class="mt-1 font-display text-3xl font-extrabold">${amt}<span class="ml-1 font-sans text-sm font-normal text-slate-400">${unit}</span></p><p class="mt-2 text-sm text-slate-400">${what}</p></li>`;

/** The FAQ entries for a city page, with the founding deal mentioned wherever a price is quoted. */
export const cityFaqs = (city) => city.faqs.map(([q, a]) => ({ q, a: foundingActive() ? a.replace("both one-time.", `both one-time. My first ${site.founding.of} clients get ${money(site.founding.discount)} off either one.`) : a }));

export default (c, slug, city) => {
  const h1 = city.h1.replace('<span class="hl">', HL);
  const points = city.points.map(([t, d]) => `<li class="rounded-2xl border border-slate-800 bg-slate-900/80 p-5"><p class="flex gap-2 font-display font-extrabold text-white">${CHECK}<span>${t}</span></p><p class="mt-1 pl-6 text-sm text-slate-400">${d}</p></li>`).join("");
  const cards = city.demos.map((key) => demoCityCard(demos.find((d) => d.city?.key === key))).join("");
  const areaLinks = areas.map(([s, n]) => `<li><a class="inline-block rounded-full border px-4 py-2 text-sm font-semibold transition ${s === slug ? "border-blue-500 bg-blue-600 text-white" : "border-slate-700 text-slate-200 hover:border-blue-500 hover:text-white"}" href="/${s}/"${s === slug ? ' aria-current="page"' : ""}>${n}</a></li>`).join("");
  return c.shell(`
<main id="main">
  <section class="relative overflow-hidden bg-gradient-to-b from-brand/25 via-slate-950 to-slate-950 px-4 pb-14 pt-10 sm:px-6 sm:pt-14 lg:px-8 lg:pb-20" aria-labelledby="hero-title">
    <div class="mx-auto max-w-6xl">
      <p class="text-sm text-slate-400"><a class="link" href="/">Home</a> &rsaquo; Website design in ${city.name}</p>
      <p class="mt-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-300">${ic("pin", "w-3.5 h-3.5")}${city.name}, TN</p>
      <h1 id="hero-title" class="mt-5 max-w-4xl font-display text-[2.3rem] font-extrabold leading-[1.08] tracking-tight sm:text-6xl">${h1}</h1>
      <p class="mt-6 max-w-3xl text-lg leading-relaxed text-slate-300 sm:text-xl">${city.lede}</p>
      ${promise()}
      <div class="mt-8 flex flex-col gap-3 sm:flex-row">
        <a class="btn btn-primary btn-lg" href="/#contact">Get my free draft${ic("arrow")}</a>
        <a class="btn btn-dark btn-lg" href="${TEL}">${ic("phone")}Call or text ${PHONE}</a>
      </div>
      <ul class="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">${points}</ul>
    </div>
  </section>

  <section class="border-t border-slate-900 bg-slate-900/40 px-4 py-16 sm:px-6 sm:py-20 lg:px-8" aria-labelledby="demos-title">
    <div class="mx-auto max-w-6xl">
      <p class="kicker">Live demos</p>
      <h2 id="demos-title" class="h2">${city.demos_title}</h2>
      <p class="mt-4 max-w-3xl text-lg text-slate-400">Working examples, built the same way I'll build yours. These are sample businesses I made up to show what's possible.</p>
      <ul class="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
${cards}      </ul>
      <p class="mt-10 text-center"><a class="btn btn-primary" href="/demos/">See all live demos${ic("arrow")}</a></p>
    </div>
  </section>

  <section class="border-t border-slate-900 px-4 py-16 sm:px-6 sm:py-20 lg:px-8" aria-labelledby="price-title">
    <div class="mx-auto max-w-6xl">
      <p class="kicker">Pricing</p>
      <h2 id="price-title" class="h2">Clear prices. Paid only after you approve your draft.</h2>
      ${founding.cityNote("mt-6 max-w-3xl")}
      <ul class="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
        ${price("Starter", founding.cityPrice("starter"), "one time", "A polished one-page site with services, hours, map and tap to call.")}
        ${price("Business", founding.cityPrice("business"), "one time", "Custom logo, online booking or price list, Google Business Profile setup.")}
        ${price("Care plan", money(P.care), "/ month", "Optional. Text me changes any time. Cancel any time.")}
      </ul>
      <p class="mt-6 rounded-2xl border border-blue-900/50 bg-blue-950/30 p-5 text-sm text-slate-300"><b class="text-white">Contractors and shops:</b> missed-call text-back is ${money(P.textback)}/month, or get a website with text-back built in for ${money(P.suite.monthly)}/month + ${money(P.suite.setup)} setup. Month to month, no long-term contract.</p>
      <p class="mt-6"><a class="link font-semibold" href="/#pricing">See everything included &rarr;</a></p>
    </div>
  </section>

  <section class="border-t border-slate-900 bg-slate-900/40 px-4 py-16 sm:px-6 sm:py-20 lg:px-8" aria-labelledby="faq-title">
    <div class="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[1fr_2fr]">
      <div>
        <p class="kicker">FAQ</p>
        <h2 id="faq-title" class="h2">Questions from ${city.name} owners.</h2>
        <p class="mt-4 text-slate-400">Don't see yours? <a class="link" href="${TEL}">Call or text</a> or <a class="link" href="/#contact">send a message</a>.</p>
      </div>
      <div class="space-y-3">
${faqDetails(cityFaqs(city))}
      </div>
    </div>
  </section>

  <section class="border-t border-slate-900 px-4 py-16 sm:px-6 sm:py-20 lg:px-8" aria-labelledby="cta-title">
    <div class="mx-auto max-w-6xl">
      <div class="flex flex-col gap-6 rounded-3xl border border-blue-900/50 bg-gradient-to-r from-blue-950/50 via-slate-900 to-slate-900 p-7 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
        <div><h2 id="cta-title" class="font-display text-2xl font-extrabold sm:text-3xl">Let's see what your site could look like.</h2><p class="mt-2 text-slate-300">Free working draft in 2&ndash;3 days. No payment, no card and no obligation.</p></div>
        <div class="flex shrink-0 flex-col gap-3 sm:flex-row"><a class="btn btn-primary" href="/#contact">Get my free draft</a><a class="btn btn-dark" href="${TEL}">${PHONE}</a></div>
      </div>
      <h2 class="kicker mt-12">Other areas I serve</h2>
      <ul class="mt-4 flex flex-wrap gap-2">${areaLinks}<li><a class="inline-block rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-blue-500 hover:text-white" href="/">All of the Memphis area</a></li></ul>
    </div>
  </section>
</main>
`);
};
