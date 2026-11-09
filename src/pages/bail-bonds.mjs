// Landing page for the bail-bond after-hours intake assistant. Price and founding offer come from src/data/site.json.
import { ic, CHECK, HL, site, intake, intakeActive, faqDetails, money } from "../lib/ui.mjs";

const TEL = `tel:${site.phone.tel}`, PHONE = site.phone.display, DEMO = site.intakeDemo;
const trial = `${intake.trialDays}-day free trial first, after-hours calls only, no contract, cancel anytime.`;

export const intakeFaqs = () => [
  { q: "Does it quote prices or give legal advice?", a: "No. It never quotes prices, gives legal advice, writes bonds or takes payment. It collects the details and hands the lead to your licensed staff, who make every decision." },
  { q: "What does it collect?", a: "The caller's name and number, the defendant's name, which jail they're in, the charge, the bail amount if the caller knows it, and the court date. You get all of it in one alert, so you can call back first." },
  { q: "Does it speak Spanish?", a: "Yes. It switches languages automatically when the caller does." },
  { q: "How does it start working?", a: `Unanswered after-hours calls are forwarded to the assistant. I set it up with you. You get ${intake.trialDays} days free, then ${money(intake.price())}/month, and you can cancel any time.` },
];

const step = (n, t, d) => `<li class="rounded-2xl border border-slate-800 bg-slate-900/80 p-5"><span class="grid h-9 w-9 place-items-center rounded-full bg-blue-600 font-display text-sm font-extrabold">${n}</span><h3 class="mt-3 font-display text-lg font-extrabold">${t}</h3><p class="mt-1 text-sm text-slate-400">${d}</p></li>`;
const card = (t, d) => `<li class="rounded-2xl border border-slate-800 bg-slate-900/80 p-5"><p class="flex gap-2 font-display font-extrabold text-white">${CHECK}<span>${t}</span></p><p class="mt-1 pl-6 text-sm text-slate-400">${d}</p></li>`;

const priceBlock = () => intakeActive()
  ? `<p class="mt-2 font-display text-5xl font-extrabold text-white"><s class="mr-2 text-3xl font-bold text-slate-500">${intake.regular}</s>${intake.founding}<span class="ml-1 font-sans text-base font-normal text-slate-400">/ month</span></p>
          <p class="mt-2 text-sm font-semibold text-amber-200">Founding price for my first ${intake.of} offices, locked for ${intake.lockMonths} months &middot; ${intake.spots()}</p>`
  : `<p class="mt-2 font-display text-5xl font-extrabold text-white">${intake.regular}<span class="ml-1 font-sans text-base font-normal text-slate-400">/ month</span></p>`;

const foundingBox = () => intakeActive() ? `
      <div id="founding" class="mt-8 rounded-3xl border-2 border-amber-400/50 bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-900 p-6 sm:p-8">
        <p class="text-xs font-semibold uppercase tracking-wider text-amber-300">Founding offices &middot; ${intake.spots()}</p>
        <p class="mt-1 font-display text-2xl font-extrabold">My first ${intake.of} bail bond offices pay ${intake.founding}/month, locked for ${intake.lockMonths} months.</p>
        <p class="mt-2 text-sm leading-relaxed text-slate-300">That's ${intake.regular}/month for everyone after. You start with a ${intake.trialDays}-day free trial. In return, if you're happy, I'll ask for three things: an honest Google review, a sentence or two I can share, and permission to show how it's working for you.</p>
      </div>` : "";

export default (c) => c.shell(`
<main id="main">
  <section class="relative overflow-hidden bg-gradient-to-b from-brand/25 via-slate-950 to-slate-950 px-4 pb-16 pt-10 sm:px-6 sm:pt-16 lg:px-8 lg:pb-24" aria-labelledby="hero-title">
    <div class="mx-auto max-w-6xl">
      <p class="text-sm text-slate-400"><a class="link" href="/">Home</a> &rsaquo; Bail bond offices</p>
      <p class="mt-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-300">${ic("phone", "w-3.5 h-3.5")}For bail bond offices &middot; Memphis, TN</p>
      <h1 id="hero-title" class="mt-5 max-w-4xl font-display text-[2.3rem] font-extrabold leading-[1.08] tracking-tight sm:text-6xl">Every after-hours call, ${HL}answered in seconds.</span></h1>
      <p class="mt-6 max-w-3xl text-lg leading-relaxed text-slate-300 sm:text-xl">An AI intake assistant for bail bond offices. It picks up when you can't, collects the details, and sends the lead straight to you.</p>
      <div class="mt-8 flex flex-col gap-3 sm:flex-row">
        <a class="btn btn-primary btn-lg" href="#contact">Start my free trial${ic("arrow")}</a>
        <a class="btn btn-dark btn-lg" href="tel:${DEMO.phone.tel}">${ic("phone")}Hear it live: ${DEMO.phone.display}</a>
      </div>
      <p class="mt-4 text-sm text-slate-400">${trial.charAt(0).toUpperCase() + trial.slice(1)}</p>
${intakeActive() ? `      <p class="mt-5 max-w-2xl rounded-xl border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-sm text-amber-100"><b class="text-white">Founding offices:</b> ${intake.founding}/month instead of ${intake.regular} for my first ${intake.of}, locked for ${intake.lockMonths} months &middot; <b class="text-white">${intake.spots()}</b> &middot; <a class="link font-semibold" href="#pricing">See the terms</a></p>` : ""}
    </div>
  </section>

  <section class="border-t border-slate-900 bg-slate-900/40 px-4 py-16 sm:px-6 sm:py-20 lg:px-8" aria-labelledby="how-title">
    <div class="mx-auto max-w-6xl">
      <p class="kicker">How it works</p>
      <h2 id="how-title" class="h2">Three steps, and you call back first.</h2>
      <ol class="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
        ${step(1, "Call is forwarded", "Unanswered after-hours calls go to the assistant.")}
        ${step(2, "Details collected", "Caller, defendant, jail, charge, bail and court date.")}
        ${step(3, "Lead sent to you", "One alert in seconds, so you call back first.")}
      </ol>
      <p class="kicker mt-14">Built for bail bonds</p>
      <ul class="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
        ${card("Answers 24/7", "A calm, professional voice on the first ring, nights and weekends.")}
        ${card("Never loses the caller", "Keeps scared families from calling the next office on the list.")}
        ${card("Speaks Spanish", "Switches languages automatically when the caller does.")}
        ${card("You stay in control", "It hands off to your licensed staff for every bond.")}
      </ul>
      <p class="mt-8 rounded-2xl border border-slate-800 bg-slate-950/60 p-5 text-sm text-slate-300"><b class="text-white">What it doesn't do:</b> it doesn't quote prices, give legal advice, write bonds or take payment.</p>
    </div>
  </section>

  <section class="border-t border-slate-900 px-4 py-16 sm:px-6 sm:py-20 lg:px-8" aria-labelledby="demo-title">
    <div class="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-2">
      <div>
        <p class="kicker">Hear it for yourself</p>
        <h2 id="demo-title" class="h2">Call the live demo line.</h2>
        <p class="mt-4 text-lg text-slate-400">Call it from your own phone and play the worried caller. Or watch the 90-second demo.</p>
        <div class="mt-6 flex flex-col gap-3 sm:flex-row">
          <a class="btn btn-primary" href="tel:${DEMO.phone.tel}">${ic("phone")}${DEMO.phone.display}</a>
          <a class="btn btn-dark" href="${DEMO.video}" target="_blank" rel="noopener">Watch the 90-second demo<span class="sr-only"> (opens in a new tab)</span>${ic("out", "w-4 h-4")}</a>
        </div>
      </div>
      <div class="rounded-3xl border border-slate-800 bg-slate-900 p-6">
        <p class="font-display text-lg font-extrabold">Need the website too?</p>
        <p class="mt-2 text-sm text-slate-400">I build fast websites for local service businesses, with the phone number up top and tap to call.</p>
        <p class="mt-4"><a class="btn btn-dark" href="/#pricing">See website pricing</a></p>
      </div>
    </div>
  </section>

  <section id="pricing" class="border-t border-slate-900 bg-slate-900/40 px-4 py-16 sm:px-6 sm:py-20 lg:px-8" aria-labelledby="price-title">
    <div class="mx-auto max-w-6xl">
      <p class="kicker">Pricing</p>
      <h2 id="price-title" class="h2">One price. Free for ${intake.trialDays} days.</h2>
      <div class="mt-8 max-w-xl rounded-2xl border border-slate-800 bg-slate-900/90 p-6">
        <p class="text-xs font-semibold uppercase tracking-wider text-blue-400">After-hours intake assistant</p>
        ${priceBlock()}
        <ul class="mt-5 space-y-2 text-sm text-slate-300">
          <li class="flex gap-2">${CHECK}<span>${intake.trialDays}-day free trial, after-hours calls only</span></li>
          <li class="flex gap-2">${CHECK}<span>No contract. Cancel any time</span></li>
          <li class="flex gap-2">${CHECK}<span>Spanish included. Every lead goes to your staff</span></li>
        </ul>
      </div>${foundingBox()}
    </div>
  </section>

  <section class="border-t border-slate-900 px-4 py-16 sm:px-6 sm:py-20 lg:px-8" aria-labelledby="faq-title">
    <div class="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[1fr_2fr]">
      <div><p class="kicker">FAQ</p><h2 id="faq-title" class="h2">Questions from bail bond offices.</h2><p class="mt-4 text-slate-400">Don't see yours? <a class="link" href="${TEL}">Call or text</a> or <a class="link" href="#contact">send a message</a>.</p></div>
      <div class="space-y-3">
${faqDetails(intakeFaqs())}
      </div>
    </div>
  </section>

  <section id="contact" class="border-t border-slate-900 bg-slate-900/40 px-4 py-16 sm:px-6 sm:py-20 lg:px-8" aria-labelledby="contact-title">
    <div class="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[1fr_1.15fr]">
      <div>
        <p class="kicker">Next step</p>
        <h2 id="contact-title" class="h2">Start your free trial.</h2>
        <p class="mt-4 text-lg text-slate-400">Tell me about your office. There's no cost and no obligation to ask.</p>
        <a class="mt-8 flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-blue-600" href="${TEL}"><span class="grid h-12 w-12 place-items-center rounded-xl bg-blue-600">${ic("phone", "w-6 h-6")}</span><span><small class="block text-sm text-slate-400">Rather talk? Call or text Austin</small><b class="font-display text-2xl font-extrabold">${PHONE}</b></span></a>
      </div>
      <form id="contact-form" class="grid grid-cols-1 gap-4 rounded-3xl border border-blue-900/50 bg-slate-900 p-6 shadow-2xl sm:grid-cols-2 sm:p-8" action="https://api.web3forms.com/submit" method="POST">
        <h3 class="font-display text-xl font-extrabold sm:col-span-2">Tell me about your office</h3>
        <p class="-mt-2 text-sm text-slate-400 sm:col-span-2">Takes about a minute. Only your name, office and a way to reach you are required.</p>
        <input type="hidden" name="access_key" value="${site.formKey}">
        <input type="hidden" name="from_name" value="bartlettwebsitedesign.online/bail-bonds">
        <input type="hidden" name="plan" value="Bail bond intake assistant (${intakeActive() ? `${intake.founding} founding price` : intake.regular}/mo)">
        <input type="checkbox" name="botcheck" class="hidden" tabindex="-1" autocomplete="off" aria-hidden="true">
        <label class="field">Your name<input name="name" autocomplete="name" required></label>
        <label class="field">Bail bond office<input name="business" autocomplete="organization" required></label>
        <label class="field sm:col-span-2">Phone or email<input name="reach" required placeholder="Best number to text, or your email"></label>
        <label class="field sm:col-span-2"><span>Anything else? <span class="font-normal text-slate-400">(optional)</span></span><textarea name="message" rows="4" placeholder="Your hours, how many calls you miss after hours, or anything you want it to handle differently"></textarea></label>
        <button class="btn btn-primary btn-lg sm:col-span-2" type="submit">Start my free trial</button>
        <p id="form-status" class="text-sm sm:col-span-2" role="status" aria-live="polite"></p>
      </form>
    </div>
  </section>
</main>
`);

/** The card on the homepage's pricing section that points here. */
export const homeCard = () => `<div class="mt-5 flex flex-col gap-5 rounded-3xl border border-slate-800 bg-slate-900/70 p-7 lg:flex-row lg:items-center lg:justify-between">
        <div class="max-w-2xl"><p class="text-xs font-semibold uppercase tracking-wider text-blue-400">For bail bond offices</p><p class="mt-1 font-display text-xl font-extrabold">After-hours call intake assistant</p><p class="mt-2 text-sm text-slate-400">An AI assistant answers calls you miss after hours, collects the caller, defendant, jail and charge, and texts you the lead. Speaks Spanish. Free for ${intake.trialDays} days, no contract.${intakeActive() ? ` <b class="text-amber-200">Founding offices: ${intake.founding}/month for my first ${intake.of} (${intake.spots()}).</b>` : ""}</p></div>
        <div class="shrink-0 lg:text-right"><p class="font-display text-3xl font-extrabold">${intakeActive() ? `<s class="mr-2 text-xl font-bold text-slate-500">${intake.regular}</s>${intake.founding}` : intake.regular} <span class="font-sans text-base font-normal text-slate-400">/ month</span></p><a class="btn btn-dark mt-3" href="/bail-bonds/">See how it works</a></div>
      </div>`;
