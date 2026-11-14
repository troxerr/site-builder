import { site, publicDemos, attr, money } from "../lib/ui.mjs";

const P = site.pricing;
const textbackPlan = `Missed-call text-back (${money(P.textback)}/mo)`;
const suitePlan = `Website + text-back (${money(P.suite.monthly)}/mo + ${money(P.suite.setup)} setup)`;
const agentPlan = `Missed-call booking agent (${money(P.agent.setup)} setup + ${money(P.agent.monthly)}/mo)`;
const action = (label, plan = "Not sure yet", primary = false) => `<a class="btn ${primary ? "btn-primary" : "btn-dark"}" href="#contact" data-plan="${attr(plan)}">${label}</a>`;
const list = (items) => `<ul class="cro-list">${items.map(t => `<li>${t}</li>`).join("")}</ul>`;
const blueprints = [
  { id: "summit-roofing", industry: "Roofing & contractors", title: "Make the next estimate easier to request", description: "Gives homeowners a clear estimate request and a tap-to-call button without hunting through a mobile menu.", built: ["Roof-price estimate slider", "Before-and-after project comparison", "Estimate request and call buttons"] },
  { id: "linen-and-lark-salon", industry: "Salons & personal care", title: "Help customers choose a service and stylist", description: "Keeps services, prices and stylist choices together so mobile visitors can find the next step quickly.", built: ["Service and price information", "Stylist-specific appointment links", "Live open-or-closed status"] },
  { id: "cedar-and-hickory-bbq", industry: "Restaurants & catering", title: "Put the menu and catering inquiry first", description: "Gets phone visitors to the menu, directions or a catering request without searching for contact details.", built: ["Mobile-friendly food menu", "Catering quote request", "One-tap directions"] },
];

export default (c) => `${c.head}
<body class="cro-home bg-slate-950 font-sans text-white antialiased">
${c.top}
<main id="main">
  <span id="top"></span>
  <section class="cro-hero" aria-labelledby="hero-title">
    <div class="cro-wrap cro-hero-grid">
      <div>
        <p class="kicker">Bartlett, TN · Websites for local service businesses</p>
        <h1 id="hero-title">Turn more website visitors into <span>calls, quotes, and bookings.</span></h1>
        <p class="cro-lede">I’m Austin in Bartlett. I build websites that help local customers choose you and get in touch.<span class="cro-optional"> Add automatic missed-call texts to follow up while you’re busy.</span></p>
        <div class="cro-actions">${action("Get my free website draft", "Not sure yet", true)}<a class="btn btn-dark" href="#work">See example websites</a></div>
        <p class="cro-note">A clickable draft with your business details. No deposit or obligation.</p>
        <p class="cro-direct"><a class="link" href="tel:${site.phone.tel}">Call Austin</a><span aria-hidden="true">·</span><a class="link" href="sms:${site.phone.tel}">Text Austin</a><span>${site.phone.display} · Reply in 1–3 business days</span></p>
      </div>
      <aside class="cro-preview" aria-label="Featured roofing website concept">
        <div class="cro-preview-label"><span>Inside a website blueprint</span><span>Interactive concept</span></div>
        <a href="/demos/summit-roofing/" aria-label="Explore the roofing and contractor website concept"><img src="/assets/work/demo-summit-roofing.webp" alt="Summit Roofing concept with a prominent estimate request button and roof photo" width="1120" height="700" fetchpriority="high"></a>
        <div class="cro-preview-bottom"><p><strong>A clear next step, on every screen.</strong><br>Explore the roofing concept and try its estimate tools.</p><a class="link" href="/demos/summit-roofing/">Open blueprint →</a></div>
      </aside>
    </div>
    <div class="cro-wrap cro-trust"><span>Based in Bartlett</span><span>Free draft before payment</span><span>Your domain and site files</span><span>Direct contact with Austin</span></div>
  </section>

  <section id="work" class="cro-section" aria-labelledby="work-title">
    <div class="cro-wrap">
      <div class="cro-section-head"><div><p class="kicker">See how the websites work</p><h2 id="work-title" class="h2">Interactive Industry Blueprints</h2></div><a class="link" href="/demos/">Browse all concepts →</a></div>
      <p class="cro-intro">Built around how local customers choose a business: clear services, useful information, and an easy way to call or request a quote. Open a blueprint on your phone and try it.</p>
      <ul class="cro-blueprints work">${blueprints.map(b => { const d = publicDemos.find(d => d.id === b.id); if (!d) throw new Error(`Blueprint must be public: ${b.id}`); return `<li class="work-item cro-blueprint"><a class="cro-blueprint-image" href="/demos/${b.id}/"><img src="/assets/work/${d.thumb}-sm.webp" alt="${attr(d.alt)}" width="560" height="350" loading="lazy"><span>Explore interactive concept →</span></a><div class="cro-blueprint-copy"><p class="kicker">${b.industry}</p><h3>${b.title}</h3><p>${b.description}</p><h4>What’s built in</h4>${list(b.built)}</div></li>`; }).join("")}</ul>
      <p class="cro-note">Interactive concept builds, ready to customize for your local brand and customers.</p>
      ${c.testimonials}
    </div>
  </section>

  <section id="services" class="cro-section cro-surface" aria-labelledby="services-title">
    <div class="cro-wrap">
      <p class="kicker">Start with what your business needs</p><h2 id="services-title" class="h2">A better website. Help with missed calls. Or both.</h2>
      <div class="cro-two cro-service-paths">
        <article class="cro-path"><span class="cro-number">01 / Website design</span><h3>Make it easier for customers to contact you.</h3><p>For a business with no website, an outdated site, or a booking link that needs a proper home.</p>${list(["Your services, hours and contact details", "Clear call, quote or booking links", "A free draft before you decide"])}${action("Get my free website draft", "Not sure yet", true)}<p class="cro-note">One-time website prices. Automation is optional.</p></article>
        <article class="cro-path"><span class="cro-number">02 / Missed-call follow-up</span><h3>Keep the conversation going while you’re on a job.</h3><p>For a business that gets calls it can’t always answer. Keep your current website or combine the services.</p>${list(["An automatic text after a missed call", "Customer replies sent to one inbox", "A booking agent option for appointments"])}${action("Request a text-back demo", textbackPlan)}<p class="cro-note">Monthly service. Phone compatibility checked first.</p></article>
      </div>
    </div>
  </section>

  <!-- BEFORE / AFTER SHOWCASE -->
  <section id="showcase" class="border-y border-slate-900 bg-slate-950/60 px-4 py-16 sm:px-6 sm:py-20 lg:px-8" aria-labelledby="showcase-title">
    <div class="mx-auto max-w-6xl">
      <div class="mx-auto mb-10 max-w-3xl text-center">
        <p class="kicker">Before &amp; after</p>
        <h2 id="showcase-title" class="h2">See what changes when the next step is clear.</h2>
        <p class="mt-4 text-lg text-slate-400">Compare two illustrative layouts. The new version puts calling and estimate requests up front; automation is an optional addition.</p>
      </div>

      <div class="mx-auto mb-5 flex max-w-4xl flex-col items-stretch justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/90 p-2.5 sm:flex-row sm:items-center">
        <div class="flex rounded-xl border border-slate-800 bg-slate-950 p-1" role="tablist" aria-label="Choose a trade">
          <button type="button" role="tab" aria-selected="true" aria-controls="comparison-stage" id="tab-roofing" data-trade="roofing" class="trade-tab is-active">Roofing</button>
          <button type="button" role="tab" aria-selected="false" aria-controls="comparison-stage" id="tab-auto" data-trade="auto" class="trade-tab">Auto repair</button>
        </div>
        <div class="flex items-center justify-end gap-2 px-1 text-xs font-semibold">
          <button type="button" data-slide="92" class="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-red-300 hover:bg-red-500/20">Show the old site</button>
          <button type="button" data-slide="8" class="rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-blue-300 hover:bg-blue-500/20">Show the new site</button>
        </div>
      </div>

      <div id="comparison-stage" class="no-select relative h-[600px] w-full touch-pan-y overflow-hidden rounded-2xl border-2 border-slate-800 bg-slate-900 shadow-2xl sm:h-[560px]">

        <!-- AFTER -->
        <div class="absolute inset-0 flex flex-col bg-slate-900">
          <div class="flex items-center justify-between gap-2 border-b border-slate-800 bg-slate-950 px-3 py-2.5 sm:px-4">
            <div class="flex min-w-0 items-center gap-2">
              <span class="hidden gap-1.5 sm:flex" aria-hidden="true"><i class="h-3 w-3 rounded-full bg-red-500/80"></i><i class="h-3 w-3 rounded-full bg-amber-500/80"></i><i class="h-3 w-3 rounded-full bg-emerald-500/80"></i></span>
              <span class="truncate rounded border border-slate-800 bg-slate-900 px-2.5 py-1 font-mono text-[11px] text-slate-400">&#128274; Secure &middot; <span class="font-semibold text-blue-400">fast on phones</span></span>
            </div>
            <span class="shrink-0 rounded-full border border-blue-500/40 bg-blue-500/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-blue-200 sm:text-xs">&check; After</span>
          </div>

          <div id="after-roofing" class="after-pane flex flex-1 flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-5 sm:p-8">
            <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
              <div class="flex items-center gap-3"><span class="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 font-display text-sm font-extrabold">SR</span><span><span class="block font-display text-[15px] font-extrabold leading-none">SUMMIT ROOFING CO.</span><span class="mt-1 block text-xs text-blue-300">Roofing &amp; repairs &middot; Memphis area</span></span></div>
              <div class="flex items-center gap-2"><span class="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/15 px-3 py-1.5 text-xs font-semibold text-blue-200"><span class="h-2 w-2 rounded-full bg-blue-400 motion-safe:animate-ping" aria-hidden="true"></span>Storm mode on</span><span class="hidden rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold shadow-md sm:inline-flex">&#128222; Call now</span></div>
            </div>
            <div class="my-auto grid grid-cols-1 items-center gap-6 py-4 lg:grid-cols-12 lg:gap-8">
              <div class="space-y-3 lg:col-span-7">
                <p class="inline-flex rounded-md border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-200">Free roof inspections &middot; Help with insurance claims</p>
                <p class="font-display text-2xl font-extrabold leading-tight sm:text-4xl">Storm damage? <span class="text-blue-400">Book a free inspection in 30 seconds.</span></p>
                <p class="max-w-xl text-sm text-slate-300 sm:text-base">Send a photo of the damage, pick a time and get a call back. Built for the week after a storm, when every roofer's phone is ringing.</p>
                <div class="flex flex-wrap gap-2.5 pt-1"><span class="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold shadow-lg shadow-blue-600/30">Book a free inspection &rarr;</span><span class="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-semibold">Text a photo of the leak</span></div>
              </div>
              <div class="hidden rounded-2xl border border-slate-800 bg-slate-950/90 p-4 shadow-xl lg:block lg:col-span-5">
                <div class="mb-3 flex items-center justify-between border-b border-slate-800 pb-2.5"><span class="flex items-center gap-2 text-xs font-semibold text-slate-200"><span class="h-2.5 w-2.5 rounded-full bg-blue-400" aria-hidden="true"></span>Missed-call text-back</span><span class="font-mono text-[11px] text-blue-300">Example</span></div>
                <div class="space-y-2.5 text-xs">
                  <div class="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-slate-400"><span>&#128245; Missed call &middot; (901) 555-0142</span><span class="text-[10px]">2:14 PM</span></div>
                  <div class="rounded-xl rounded-bl-none bg-blue-600 px-3 py-2.5 font-medium shadow-md">&ldquo;Hi, this is Summit Roofing. Sorry we missed you, the crew's up on a roof. Is this about a leak or an inspection?&rdquo;</div>
                  <div class="ml-6 rounded-xl rounded-br-none border border-slate-700 bg-slate-800 px-3 py-2">&ldquo;Shingles blew off near Stage Rd. Need an estimate.&rdquo;</div>
                  <p class="flex items-center gap-1 pt-1 text-[11px] font-semibold text-blue-300">&check; Lead saved and sent to the owner</p>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-3 gap-2 border-t border-slate-800/80 pt-3 text-center text-[11px] font-semibold text-white sm:text-xs"><span>&check; Text-back on missed calls</span><span>&check; Photo upload</span><span>&check; One-tap calling</span></div>
          </div>

          <div id="after-auto" class="after-pane hidden flex-1 flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-5 sm:p-8">
            <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
              <div class="flex items-center gap-3"><span class="grid h-10 w-10 place-items-center rounded-xl bg-sky-400 font-display text-sm font-extrabold text-slate-950">PAR</span><span><span class="block font-display text-[15px] font-extrabold leading-none">PARKVIEW AUTO REPAIR</span><span class="mt-1 block text-xs text-sky-300">Auto repair &middot; Memphis</span></span></div>
              <div class="flex items-center gap-2"><span class="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/15 px-3 py-1.5 text-xs font-semibold text-sky-200"><span class="h-2 w-2 rounded-full bg-sky-400" aria-hidden="true"></span>Book a drop-off</span><span class="hidden rounded-lg bg-sky-400 px-4 py-2 text-xs font-semibold text-slate-950 shadow-md sm:inline-flex">&#128222; Call the shop</span></div>
            </div>
            <div class="my-auto grid grid-cols-1 items-center gap-6 py-4 lg:grid-cols-12 lg:gap-8">
              <div class="space-y-3 lg:col-span-7">
                <p class="inline-flex rounded-md border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-200">Symptom finder &middot; Typical price ranges up front</p>
                <p class="font-display text-2xl font-extrabold leading-tight sm:text-4xl">Check engine light on? <span class="text-sky-300">Book a diagnostic in 30 seconds.</span></p>
                <p class="max-w-xl text-sm text-slate-300 sm:text-base">Tell the shop what the car is doing, see a typical price range and pick a drop-off time, all from your phone.</p>
                <div class="flex flex-wrap gap-2.5 pt-1"><span class="rounded-xl bg-sky-400 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/20">Book a drop-off &rarr;</span><span class="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-semibold">Text the shop</span></div>
              </div>
              <div class="hidden rounded-2xl border border-slate-800 bg-slate-950/90 p-4 shadow-xl lg:block lg:col-span-5">
                <div class="mb-3 flex items-center justify-between border-b border-slate-800 pb-2.5"><span class="flex items-center gap-2 text-xs font-semibold text-slate-200"><span class="h-2.5 w-2.5 rounded-full bg-sky-400" aria-hidden="true"></span>Missed-call text-back</span><span class="font-mono text-[11px] text-sky-300">Example</span></div>
                <div class="space-y-2.5 text-xs">
                  <div class="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-slate-400"><span>&#128245; Missed call while techs are in the bay</span><span class="text-[10px]">10:05 AM</span></div>
                  <div class="rounded-xl rounded-bl-none bg-sky-400 px-3 py-2.5 font-medium text-slate-950 shadow-md">&ldquo;Hi, this is Parkview Auto Repair. Our hands are under a hood right now. What year, make and model, and what's it doing?&rdquo;</div>
                  <div class="ml-6 rounded-xl rounded-br-none border border-slate-700 bg-slate-800 px-3 py-2">&ldquo;2018 F-150, grinding brakes when I stop.&rdquo;</div>
                  <p class="flex items-center gap-1 pt-1 text-[11px] font-semibold text-sky-300">&check; Details sent to the shop for a call back</p>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-3 gap-2 border-t border-slate-800/80 pt-3 text-center text-[11px] font-semibold text-white sm:text-xs"><span>&check; Symptom finder</span><span>&check; Missed-call text-back</span><span>&check; Google review requests</span></div>
          </div>
        </div>

        <!-- BEFORE (a made-up outdated site) -->
        <div id="before-overlay" class="absolute inset-y-0 left-0 z-20 w-1/2 overflow-hidden border-r-2 border-blue-500" aria-hidden="true">
          <div id="before-inner" class="flex h-full flex-col bg-stone-200 text-stone-800">
            <div class="flex items-center justify-between gap-2 border-b border-stone-400 bg-stone-300 px-3 py-2.5 sm:px-4">
              <span class="truncate rounded border border-stone-400 bg-stone-100 px-2.5 py-1 font-mono text-[11px] text-red-800">&#9888; Not secure | http://old-site.net &middot; <b>slow</b></span>
              <span class="shrink-0 rounded-full bg-red-700 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white sm:text-xs">&times; Before</span>
            </div>
            <div class="flex flex-1 flex-col justify-between bg-stone-100 p-5 font-serif sm:p-8">
              <div class="flex flex-col justify-between gap-2 border-b-4 border-double border-stone-400 pb-4 sm:flex-row sm:items-center">
                <div><p id="before-title" class="text-xl font-bold uppercase tracking-tight sm:text-2xl">Generic Mid-South Roofing Co.</p><p class="text-xs text-stone-600">Serving the area since 2009 &bull; Desktop view only</p></div>
                <p class="border border-stone-400 bg-stone-200 px-3 py-2 font-mono text-xs text-stone-700">Call Office: 901-555-0100</p>
              </div>
              <div class="my-auto grid grid-cols-1 items-center gap-6 py-4 lg:grid-cols-12">
                <div class="space-y-3 lg:col-span-7">
                  <p class="inline-block rounded border border-red-300 bg-red-100 px-2.5 py-1 font-sans text-xs font-semibold text-red-800">&#9888; Hard to use on a phone</p>
                  <p class="text-xl font-bold sm:text-2xl">About Us &amp; Our Mission Statement</p>
                  <p id="before-copy" class="font-sans text-sm leading-relaxed text-stone-700">We pride ourselves on quality roofs. If you have hail damage or a roof leak, please fill out our 9-field email form and our office will check the inbox within 3 to 5 business days.</p>
                  <ul class="grid grid-cols-2 gap-2 pt-1 font-sans text-xs font-semibold text-red-800"><li>&times; Phone number not tappable</li><li>&times; Missed calls go to a full voicemail</li><li>&times; Tiny text needs pinching</li><li>&times; No text-back</li></ul>
                </div>
                <div class="hidden border-2 border-stone-400 bg-white p-4 font-sans shadow-inner lg:block lg:col-span-5">
                  <p class="mb-3 border-b border-stone-300 pb-2 text-xs font-bold uppercase text-stone-700">Send email inquiry</p>
                  <div class="space-y-2 text-xs"><p class="border border-stone-300 bg-stone-100 px-2.5 py-1.5 text-stone-500">First &amp; last name *</p><p class="border border-stone-300 bg-stone-100 px-2.5 py-1.5 text-stone-500">Email address *</p><p class="border border-stone-300 bg-stone-100 px-2.5 py-1.5 text-stone-500">Enter CAPTCHA: 8X9qB2 *</p><p class="mt-1 bg-stone-400 py-2 text-center font-bold text-stone-900">Submit (reply in 3&ndash;5 days)</p></div>
                </div>
              </div>
              <p class="border-t border-stone-300 pt-3 text-center font-sans text-xs text-stone-600">Copyright &copy; 2012 &bull; All Rights Reserved</p>
            </div>
          </div>
        </div>

        <div id="slider-handle" class="group absolute inset-y-0 left-1/2 z-30 flex -translate-x-1/2 cursor-ew-resize items-center justify-center" role="slider" tabindex="0" aria-label="Compare the old site and the new site" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" aria-valuetext="Half old site, half new site">
          <span class="grid h-12 w-12 place-items-center rounded-full border-4 border-slate-950 bg-blue-600 text-lg font-extrabold text-white shadow-xl shadow-black/60 transition-transform group-hover:scale-110 group-focus-visible:ring-4 group-focus-visible:ring-sky-300" aria-hidden="true">&harr;</span>
        </div>
      </div>
      <p class="mx-auto mt-4 max-w-4xl text-center text-xs text-slate-400">Both sides are made-up examples, not any real business's website. Prices, details and the text conversation are examples. <a class="link" id="showcase-link" href="/demos/">See the sample demos</a>.</p>
    </div>
  </section>



  <section id="booking-agent" class="cro-section cro-surface" aria-labelledby="math-title">
    <div class="cro-wrap">
      <p class="kicker">Missed-call text-back</p><h2 id="math-title" class="h2">You miss the call. Your business still responds.</h2>
      <p class="cro-intro">An automatic text asks what the caller needs. Their reply reaches your inbox so you can follow up. The basic text-back starts the conversation; the booking agent can also book appointments with a supported calendar.</p>
      <div class="cro-two cro-demo-grid">
        <div class="cro-conversation">
          <p class="cro-number">Illustrative conversation · No real texts sent</p>
          <ol class="cro-messages">
            <li><small>1 / Missed call</small><p>A homeowner calls while your crew is working.</p></li>
            <li><small>2 / Automatic text</small><p>“Thanks for calling. This is an automatic reply from the roofing team. Are you looking for an estimate? Reply STOP to opt out.”</p></li>
            <li data-demo-step="1" hidden><small>3 / Customer reply</small><p>“There’s a leak near the chimney. Can someone take a look?”</p></li>
            <li data-demo-step="2" hidden><small>4 / Owner’s inbox</small><p>The caller’s number and message are ready for you to review and call back.</p></li>
          </ol>
          <button id="textback-next" type="button" class="btn btn-dark" hidden>Show the customer reply</button>
          <noscript><p class="cro-note">The customer replies with the job details; those details are sent to the owner for follow-up.</p></noscript>
        </div>
        <div>
          <h3 class="cro-subhead">See the difference before you choose.</h3>
          <dl class="cro-definitions"><div><dt>Text-back · ${money(P.textback)}/month</dt><dd>Missed-call reply, lead inbox and review requests. You handle the callback and confirm the job.</dd></div><div><dt>Booking agent · ${money(P.agent.setup)} setup + ${money(P.agent.monthly)}/month</dt><dd>Adds appointment booking into a supported calendar, with a way to request staff help.</dd></div></dl>
          <div class="cro-actions">${action("Request a text-back demo", textbackPlan, true)}<a class="link" href="/demos/missed-call-booking-agent/">Try the booking simulation →</a></div>
          <details class="cro-details"><summary>What gets checked before setup?<span aria-hidden="true"> +</span></summary><div><p>I check your phone setup, number arrangements and any calendar connection before you pay. Your quote confirms the message allowance, any extra usage charges, handoff process and cancellation steps.</p><p>The conversation here is a simulation. Automated texts depend on a working connection and a number that can receive texts. A text-back does not guarantee a reply or a booked job.</p></div></details>
          <div class="cro-calculator">
            <h3>What would it take to cover the monthly fee?</h3>
            <label class="field" for="job-profit">Your estimated profit per additional job ($)<input id="job-profit" type="number" min="0" step="any" value="${site.examples.jobProfit}" inputmode="decimal" aria-describedby="profit-note"></label>
            <p id="profit-result" role="status" aria-live="polite">At ${money(site.examples.jobProfit)} profit per extra job, 1 additional job would cover the ${money(P.textback)} monthly fee.</p>
            <p id="profit-note" class="cro-note">Illustration only. Use profit after job costs, not the total invoice. This estimates fee coverage, not expected results.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="pricing" class="cro-section" aria-labelledby="pricing-title">
    <div class="cro-wrap">
      <p class="kicker">Know the cost before paid work starts</p><h2 id="pricing-title" class="h2">Choose your website. Add follow-up if you need it.</h2>
      <p class="cro-intro">A one-time website purchase and a monthly follow-up service are separate choices. I confirm your package, scope and any extras in writing.</p>
      <h3 class="cro-group-title">1. A website you pay for once</h3>
      <div class="cro-two cro-prices">
        <article class="cro-price"><p class="kicker">Starter</p>${c.card.starter}<p>A clear one-page home for your business.</p>${list(["Custom one-page design", "Services, hours, map and tap to call", "Mobile-friendly layout", "Domain and free static hosting setup"])}<a class="btn btn-dark" href="#contact" ${c.attr.starter}>Get my free website draft</a></article>
        <article class="cro-price cro-price-featured"><p class="kicker">Business · More ways to get in touch</p>${c.card.business}<p>Everything in Starter, with more help presenting your business.</p>${list(["Custom logo design", "Online booking link or price list", "Google Business Profile setup", "Matching email address setup", "Three rounds of changes"])}<a class="btn btn-primary" href="#contact" ${c.attr.business}>Get my free website draft</a></article>
      </div>
      <p class="cro-cost-note"><strong>Ongoing costs:</strong> Static hosting is included. Your domain is paid to the registrar; renewal varies by name and provider. Care is optional at ${money(P.care)}/month for hours, prices and photo updates, plus domain renewal handling. Paid email or booking subscriptions, if needed, are confirmed separately before you agree.</p>
      ${c.founding.banner}
      <h3 class="cro-group-title">2. Optional monthly follow-up</h3>
      <div class="cro-two cro-prices">
        <article class="cro-price"><p class="kicker">Keep your existing website</p><h4>Missed-call text-back</h4><p class="cro-price-line">${money(P.textback)}<span>/month</span></p>${list(["Automatic missed-call texts", "One inbox for leads", "Google review requests after jobs", "Month to month"])}${action("Request a text-back demo", textbackPlan)}</article>
        <article class="cro-price"><p class="kicker">Website and follow-up together</p><h4>Website + text-back</h4><p class="cro-price-line">${money(P.suite.monthly)}<span>/month</span></p><p class="cro-note">+ ${money(P.suite.setup)} one-time setup after draft approval</p>${list(["Custom site with quote and contact paths", "Missed-call text-back", "Local search and Google Business Profile setup", "Ongoing hours, prices and photo updates"])}${action("Ask about website + text-back", suitePlan)}</article>
      </div>
      <p class="cro-cost-note"><strong>Why the monthly website package?</strong> It combines the site, text-back and ongoing updates. A one-time website purchase does not include ongoing automation or updates. Compare the recurring cost with buying a website and adding only the services you need. Before starting a monthly plan, I confirm your usage allowance, any extra charges, and what ends or transfers if you cancel.</p>
      <details class="cro-details cro-specialist"><summary>Appointment booking and specialist services<span aria-hidden="true"> +</span></summary><div><h3>Missed-call booking agent</h3><p>${money(P.agent.setup)} setup + ${money(P.agent.monthly)}/month. Offers available appointments in a supported calendar and sends your team a booking summary.</p><div class="cro-actions">${action("Request a booking-agent demo", agentPlan)}<a class="link" href="/dental/">For dental offices →</a></div>${c.intakeCard}</div></details>
    </div>
  </section>

  <section id="process" class="cro-section cro-surface" aria-labelledby="process-title"><div class="cro-wrap">
    <p class="kicker">How it works</p><h2 id="process-title" class="h2">See your draft before you commit.</h2>
    <ol class="cro-process"><li><span class="cro-number">01 / Tell me about your business</span><h3>A few details, by text or email.</h3><p>I reply in 1–3 business days. We confirm what your customers need and which package fits.</p></li><li><span class="cro-number">02 / Review your draft</span><h3>Open it on your own phone.</h3><p>Your free working draft is usually ready 2–3 days after I have your business details. No deposit or card needed.</p></li><li><span class="cro-number">03 / Decide and launch</span><h3>Approve the scope and price.</h3><p>If you go ahead, we agree on the changes, payment and launch timing. If you decline the draft, you owe nothing.</p></li></ol>
  </div></section>

  <section id="about" class="cro-section" aria-labelledby="about-title"><div class="cro-wrap cro-two">
    <div><p class="kicker">Your local point of contact</p><h2 id="about-title" class="h2">Hi, I’m Austin.</h2><p class="cro-intro">I was born in Memphis and have lived in Bartlett for over 15 years. I build websites for local contractors, shops, clinics and service businesses.</p><p>Tell me what customers need to do, and I’ll work that into your site. When you call or text, you reach the person building it. I reply in 1–3 business days.</p><div class="cro-actions"><a class="btn btn-dark" href="tel:${site.phone.tel}">Call Austin</a><a class="btn btn-dark" href="sms:${site.phone.tel}">Text Austin</a></div></div>
    <div id="no-risk" class="cro-ownership"><p class="kicker">Your business stays yours</p><h3 id="risk-title">You keep control.</h3>${list(["Your domain is registered in your name.", "You receive a copy of your site files.", "I confirm the price before paid work starts.", "Monthly services are month to month."])}<p class="cro-note">A good fit for local businesses that want more calls, quotes or bookings. For a large online store or a custom customer portal, ask about scope first.</p></div>
  </div></section>

  <section id="faq" class="cro-section cro-surface" aria-labelledby="faq-title"><div class="cro-wrap"><p class="kicker">Questions before you start</p><h2 id="faq-title" class="h2">Straight answers.</h2><div class="cro-faq">${c.faqItems}</div></div></section>

  <section id="contact" class="cro-section" aria-labelledby="contact-title"><div class="cro-wrap">
    <p class="kicker">Let’s look at your business</p><h2 id="contact-title" class="h2">Get your free website draft.</h2><p id="contact-intro" class="cro-intro">Your name, business and a way to reach you are enough to start. I reply in 1–3 business days.</p>
    <div class="cro-two cro-contact-grid">
      <form id="contact-form" class="cro-form" action="https://api.web3forms.com/submit" method="POST">
        <h3 id="form-title">Request my free website draft</h3><p id="form-promise" class="cro-note">No payment, card or obligation. Draft usually ready 2–3 days after your details are confirmed.</p>
        <input type="hidden" name="access_key" value="${site.formKey}"><input type="hidden" name="from_name" value="bartlettwebsitedesign.online"><input type="hidden" name="redirect" value="${site.url}/thanks/"><input type="hidden" name="subject" value="Website or follow-up inquiry">
        <input type="checkbox" name="botcheck" class="hidden" tabindex="-1" autocomplete="off" aria-hidden="true">
        <label class="field" for="inquiry-type">I’m interested in<select id="inquiry-type" name="inquiry"><option value="website">A free website draft</option><option value="textback">A missed-call text-back demo</option><option value="booking">A booking-agent demo</option><option value="care">Website care</option></select></label>
        <label class="field">Your name<input name="name" autocomplete="name" required placeholder="Your name"></label><label class="field">Business name<input name="business" autocomplete="organization" required placeholder="Your business"></label><label class="field">Phone or email<input name="reach" required placeholder="Best number to text, or your email"></label>
        <details id="extra-details" class="cro-details"><summary>Add a website link or other details (optional)<span aria-hidden="true"> +</span></summary><div><label class="field">Where are you online now?<select name="current"><option>Not provided</option><option>Nowhere yet</option><option>Facebook or Instagram only</option><option>A booking page or Linktree</option><option>An old website</option></select></label><label class="field">Package (optional)<select name="plan" id="plan">${c.planOptions}</select></label><label class="field">Anything else?<textarea name="message" rows="3" placeholder="Website link, services, or what you’d like help with"></textarea></label></div></details>
        <button class="btn btn-primary btn-lg" type="submit">Get my free website draft</button><p class="cro-note">Your details are used to reply about this inquiry. No mailing lists.</p><p class="cro-note" id="form-status" role="status" aria-live="polite">I reply in 1–3 business days. No payment or card needed.</p>
      </form>
      <aside class="cro-contact-next"><h3>What happens next?</h3><ol id="contact-next"><li><strong>I reply personally.</strong> We confirm your services, hours and what your website needs to do.</li><li><strong>You get a working draft.</strong> Open it on your phone and share your feedback.</li><li><strong>You decide.</strong> The scope and price are agreed before you pay.</li></ol><p>Prefer to talk directly?</p><div class="cro-actions"><a class="link" href="tel:${site.phone.tel}">Call ${site.phone.display}</a><a class="link" href="sms:${site.phone.tel}">Text Austin</a></div><a class="link cro-email" href="mailto:${site.email}">${site.email}</a></aside>
    </div>
  </div></section>
</main>
${c.bottom}
${c.scripts}
</body>
</html>
`;
