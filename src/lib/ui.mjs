// Small building blocks shared by the page templates. Everything here returns HTML strings.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const dataFile = (name) => JSON.parse(readFileSync(fileURLToPath(new URL(`../data/${name}.json`, import.meta.url)), "utf8"));
export const site = dataFile("site");
export const demos = dataFile("demos");
/** Demos shown on public pages: invented businesses only. The rest stay reachable by link (noindex) but are never linked from our pages. */
export const publicDemos = demos.filter((d) => d.public);
export const faq = dataFile("faq");
export const { areas, cities } = dataFile("cities");
export const testimonialData = dataFile("testimonials");

// ---------- text helpers ----------
const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", rsquo: "’", lsquo: "‘", ldquo: "“", rdquo: "”", ndash: "–", mdash: "—", middot: "·", hellip: "…", rarr: "→", larr: "←", times: "×", check: "✓" };
export const decode = (s) => s.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, e) => {
  if (e[0] === "#") return String.fromCodePoint(e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
  return ENTITIES[e] ?? m;
});
/** Plain text of an HTML snippet (for structured data). */
export const plain = (html) => decode(html.replace(/<[^>]+>/g, ""));
export const money = (n) => "$" + n.toLocaleString("en-US");
export const attr = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

// ---------- icons ----------
export const ic = (name, cls = "w-5 h-5") => `<svg class="icon ${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
export const CHECK = ic("check", "w-4 h-4 shrink-0 mt-1 text-blue-400");
export const HL = '<span class="bg-gradient-to-r from-blue-400 via-sky-300 to-white bg-clip-text text-transparent">';

// ---------- the founding-client deal (one number in site.json drives every page) ----------
const P = site.pricing;
// FOUNDING_SPOTS overrides site.json for one build (tests use it to check 3, 1 and 0 spots left)
const F = { ...site.founding, ...(process.env.FOUNDING_SPOTS ? { spotsLeft: Number(process.env.FOUNDING_SPOTS) } : {}) };
export const foundingActive = () => F.spotsLeft > 0;
const spotsText = () => `${F.spotsLeft} of ${F.of} spots left`;
const fPrice = (reg) => reg - F.discount;
export const founding = {
  hero: () => foundingActive() ? `      <p class="mx-auto mt-4 max-w-2xl rounded-xl border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-sm text-amber-100"><b class="text-white">Founding-client deal:</b> ${money(F.discount)} off any website for my first ${F.of} clients &middot; <b class="text-white">${spotsText()}</b> &middot; <a class="link font-semibold" href="/#founding">See the terms</a></p>` : "",
  banner: () => foundingActive() ? `      <div id="founding" class="mt-12 flex flex-col gap-5 rounded-3xl border-2 border-amber-400/50 bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-900 p-7 lg:flex-row lg:items-center lg:justify-between">
        <div class="max-w-3xl"><p class="text-xs font-semibold uppercase tracking-wider text-amber-300">Founding-client deal</p><p class="mt-1 font-display text-2xl font-extrabold">${money(F.discount)} off any website for my first ${F.of} clients.</p><p class="mt-2 text-sm leading-relaxed text-slate-300">The discount applies to the first three website clients. After launch, I may ask for honest feedback and permission to feature your site. Your discount does not depend on a review.</p></div>
        <div class="shrink-0 lg:text-right"><p class="font-display text-3xl font-extrabold text-amber-200">${spotsText()}</p><p class="mt-1 text-sm text-slate-300">Starter ${money(fPrice(P.starter))} &middot; Business ${money(fPrice(P.business))}</p></div>
      </div>` : "",
  /** Price line on a pricing card. */
  card: (key) => foundingActive()
    ? `<p class="mt-2 font-display text-4xl font-extrabold text-white"><span><s class="mr-2 text-2xl font-bold text-slate-500">${money(P[key])}</s>${money(fPrice(P[key]))}</span><span class="ml-1 font-sans text-base font-normal text-slate-400">one time</span></p><p class="mt-1 text-sm font-semibold text-amber-200">Founding price for my first ${F.of} clients</p>`
    : `<p class="mt-2 font-display text-4xl font-extrabold text-white">${money(P[key])}<span class="ml-1 font-sans text-base font-normal text-slate-400">one time</span></p>`,
  /** The plan name the form sends, and that a pricing button preselects. */
  plan: (key) => foundingActive() ? `${{ starter: "Starter", business: "Business" }[key]} (${money(fPrice(P[key]))} founding price)` : `${{ starter: "Starter", business: "Business" }[key]} (${money(P[key])})`,
  /** Starter/business price shown in the city pages' price cards. */
  cityPrice: (key) => foundingActive() ? `<s class="mr-2 text-xl font-bold text-slate-500">${money(P[key])}</s>${money(fPrice(P[key]))}` : money(P[key]),
  cityNote: (cls = "") => foundingActive() ? `<p class="${cls} rounded-xl border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-sm text-amber-100"><b class="text-white">Founding-client deal:</b> ${money(F.discount)} off any website for my first ${F.of} clients &middot; <b class="text-white">${spotsText()}</b> &middot; <a class="link font-semibold" href="/#founding">See the terms</a></p>` : "",
};
// ---------- the founding offer for the bail-bond intake assistant (its own counter, separate from the website deal) ----------
const PI = site.pricing.intake;
const FI = { ...F.intake, ...(process.env.FOUNDING_INTAKE_SPOTS ? { spotsLeft: Number(process.env.FOUNDING_INTAKE_SPOTS) } : {}) };
export const intakeActive = () => FI.spotsLeft > 0;
export const intake = {
  regular: money(PI.monthly), founding: money(PI.founding), trialDays: PI.trialDays, lockMonths: PI.lockMonths, of: FI.of,
  spots: () => `${FI.spotsLeft} of ${FI.of} spots left`,
  /** The monthly price that applies today. */
  price: () => (intakeActive() ? PI.founding : PI.monthly),
};
export const planOptions = () => [
  "Not sure yet", founding.plan("starter"), founding.plan("business"),
  `Care plan (${money(P.care)}/mo)`, `Missed-call text-back (${money(P.textback)}/mo)`,
  `Website + text-back (${money(P.suite.monthly)}/mo + ${money(P.suite.setup)} setup)`,
  `Missed-call booking agent (${money(P.agent.setup)} setup + ${money(P.agent.monthly)}/mo)`,
].map((o) => `<option>${o}</option>`).join("");

// ---------- FAQ ----------
export const faqEntries = () => faq.filter((f) => !f.founding || foundingActive());
export const faqDetails = (entries, { indent = "        " } = {}) => entries.map((f, i) =>
  `${indent}<details class="group rounded-2xl border border-slate-800 bg-slate-900/80 open:border-blue-900/70"${i === 0 ? " open" : ""}><summary class="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-display text-[17px] font-extrabold text-white">${f.q}<span class="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-slate-700 text-blue-400 transition group-open:rotate-45">${ic("plus", "w-4 h-4")}</span></summary><p class="px-5 pb-5 text-[15px] leading-relaxed text-slate-400">${f.a}</p></details>`).join("\n");
export const faqJsonLd = (entries) => ({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: entries.map((f) => ({ "@type": "Question", name: plain(f.q), acceptedAnswer: { "@type": "Answer", text: plain(f.a) } })) });

export const DEMO_CATEGORIES = [["building", "Roofing &amp; building"], ["services", "Local services"], ["pets", "Pets"], ["health", "Health"], ["property", "Property"], ["food", "Food &amp; beauty"], ["showcase", "Showcase"]];

// ---------- demo cards ----------
const DOTS = '<span class="mr-2 inline-flex gap-1 align-middle"><i class="h-2 w-2 rounded-full bg-slate-700"></i><i class="h-2 w-2 rounded-full bg-slate-700"></i><i class="h-2 w-2 rounded-full bg-slate-700"></i></span>';
const browserBar = (url, dots = false) => `<div class="truncate border-b border-slate-800 bg-slate-950 px-3 py-2 font-mono text-[11px] text-slate-400" aria-hidden="true">${dots ? DOTS : ""}${url}</div>`;
const CARD = "group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 transition hover:-translate-y-0.5 hover:border-blue-500/60";
const img = (thumb, alt, sizes) => `<img class="aspect-[8/5] w-full object-cover object-top" src="/assets/work/${thumb}-sm.webp" srcset="/assets/work/${thumb}-sm.webp 560w, /assets/work/${thumb}.webp 1120w" sizes="${sizes}" alt="${alt}" loading="lazy" width="1120" height="700">`;

/** Card on the demos page. */
export function demoPageCard(d) {
  const ext = d.href.startsWith("http");
  const link = ext ? d.href : `/demos/${d.href}`;
  const url = ext ? d.href.replace("https://", "").replace(/\/$/, "") : `bartlettwebsitedesign.online/demos/${d.href}`;
  const target = ext ? ' target="_blank" rel="noopener"' : "";
  const label = ext ? `Open site${ic("out", "w-4 h-4")}<span class="sr-only"> (opens in a new tab)</span>` : `Open demo${ic("arrow", "w-4 h-4")}`;
  const chips = d.chips.map((c, i) => `<span class="rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${i === 0 ? "border-blue-500/50 bg-blue-500/10 text-blue-200" : "border-slate-700 text-slate-300"}">${c}</span>`).join("");
  return `      <li data-category="${d.category}"><a class="${CARD}" href="${link}"${target}>
        ${browserBar(url)}
        ${img(d.thumb, d.alt, "(max-width: 640px) calc(100vw - 32px), (max-width: 1024px) 50vw, 380px")}
        <div class="flex flex-1 flex-col p-5">
          <h2 class="font-display text-lg font-extrabold text-white">${d.name}</h2><p class="text-sm text-slate-400">${d.type}</p>
          <p class="mt-3 text-[15px] text-slate-300">${d.what}</p>
          <div class="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5"><div class="flex flex-wrap gap-1.5">${chips}</div><span class="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-400 group-hover:text-blue-300">${label}</span></div>
        </div></a></li>
`;
}

/** Card in a city page's demo list. */
export function demoCityCard(d) {
  const c = d.city;
  return `        <li><a class="${CARD}" href="/demos/${d.id}/">
          ${browserBar(`bartlettwebsitedesign.online/demos/${d.id}/`)}
          ${img(d.thumb, `${c.name} demo homepage`, "(max-width: 640px) calc(100vw - 32px), (max-width: 1024px) 50vw, 380px")}
          <div class="flex flex-1 flex-col p-5">
            <h3 class="font-display text-lg font-extrabold text-white">${c.name}</h3><p class="text-sm text-slate-400">${c.type}</p>
            <p class="mt-3 text-[15px] text-slate-300">${c.what}</p>
            <div class="mt-auto flex items-center justify-between pt-5"><span class="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-400 group-hover:text-blue-300">Try the live demo${ic("arrow", "w-4 h-4")}</span><span class="rounded-full border border-slate-700 px-2.5 py-0.5 text-[11px] font-semibold text-slate-300">${c.chip}</span></div>
          </div></a></li>
`;
}

/** Card in the homepage's random pool (the page shows five of these). */
export function demoHomeCard(d) {
  const h = d.home;
  return `        <li class="work-item" hidden><a class="work-card ${CARD}" href="/demos/${d.id}/">
          ${browserBar(`bartlettwebsitedesign.online/demos/${d.id}/`, true)}
          ${img(d.thumb, h.alt, "(max-width: 640px) calc(100vw - 32px), (max-width: 1024px) 50vw, 380px")}
          <div class="flex flex-1 flex-col p-5">
            <h3 class="font-display text-lg font-extrabold text-white">${h.name}</h3><p class="text-sm text-slate-400">${h.type}</p>
            <p class="mt-3 text-[15px] text-slate-300">${h.outcome}</p>
            ${h.built ? `<p class="mt-3 flex gap-2 text-sm text-slate-400">${CHECK}<span>${h.built}</span></p>` : ""}
            <div class="mt-auto flex items-center justify-between pt-5"><span class="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-400 group-hover:text-blue-300">Try the live demo${ic("arrow", "w-4 h-4")}</span><span class="rounded-full border border-slate-700 px-2.5 py-0.5 text-[11px] font-semibold text-slate-300">${h.chip}</span></div>
          </div></a></li>`;
}

export const promise = () => `<div class="mt-8 flex max-w-2xl items-start gap-4 rounded-2xl border border-blue-500/30 bg-blue-500/10 p-5">
        <span class="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blue-600 font-display text-lg font-extrabold" aria-hidden="true">$0</span>
        <div><p class="font-display font-extrabold text-white">See a free working draft of your site before you pay.</p><p class="mt-1 text-sm text-slate-300">Send me a few details and I'll build a real, clickable draft with your name, services and hours in 2&ndash;3 days. Your package and any extras are confirmed before paid work starts. Don't, and you owe nothing.</p></div>
      </div>`;

// ---------- real client quotes (src/data/testimonials.json: [{ quote, name, business, town }]). Renders nothing until there is one. ----------
export const testimonials = () => testimonialData.length === 0 ? "" : `    <div class="mx-auto mt-10 max-w-6xl">
      <p class="kicker">What clients say</p>
      <ul class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">${testimonialData.map((t) => `<li><figure class="h-full rounded-2xl border border-slate-800 bg-slate-900 p-5"><blockquote class="text-slate-200">&ldquo;${t.quote}&rdquo;</blockquote><figcaption class="mt-3 text-sm text-slate-400">${t.name} &middot; ${t.business}, ${t.town}</figcaption></figure></li>`).join("")}</ul>
    </div>
`;

