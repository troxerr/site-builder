// The dental-office landing page (missed-call booking agent).
export default (c) => c.shell(`
<main id="main">
  <section class="relative overflow-hidden bg-gradient-to-b from-[#143fc5]/25 via-slate-950 to-slate-950 px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pb-24" aria-labelledby="hero-title">
    <div class="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-[1.15fr_1fr]">
      <div>
        <p class="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-300"><svg class="icon w-3.5 h-3.5" aria-hidden="true"><use href="#i-tooth"/></svg>Dental offices &middot; Bartlett, Memphis &amp; the Mid-South</p>
        <h1 id="hero-title" class="mt-5 font-display text-[2.3rem] font-extrabold leading-[1.08] tracking-tight sm:text-6xl">Missed calls, booked before they call the <span class="bg-gradient-to-r from-blue-400 via-sky-300 to-white bg-clip-text text-transparent">next office.</span></h1>
        <p class="mt-6 text-lg leading-relaxed text-slate-300">When your front desk can't pick up, the booking agent texts the caller back within a minute, offers times that are really open and books the one they pick. Your team gets a clean summary. Anything urgent goes straight to a person.</p>
        <p class="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-300"><strong class="font-display text-lg font-extrabold text-white">$1,500 setup + $1,000/mo</strong><span class="flex items-center gap-1.5"><svg class="icon w-4 h-4 text-blue-400" aria-hidden="true"><use href="#i-check"/></svg>No long-term contract</span><span class="flex items-center gap-1.5"><svg class="icon w-4 h-4 text-blue-400" aria-hidden="true"><use href="#i-check"/></svg>No new website needed</span></p>
        <div class="mt-8 flex flex-col gap-3 sm:flex-row">
          <a class="btn btn-primary btn-lg" href="/demos/missed-call-booking-agent/">Watch it book a patient<svg class="icon w-5 h-5" aria-hidden="true"><use href="#i-arrow"/></svg></a>
          <a class="btn btn-dark btn-lg" href="#contact">See if it fits your office</a>
        </div>
        <p class="mt-4 text-sm text-slate-400">Questions? Call or text Austin at <a class="link font-semibold text-white" href="tel:+19013210023">(901) 321-0023</a>. You'll reach me, not a call center.</p>
      </div>
      <div>
        <div class="mx-auto max-w-[360px] rounded-[2.5rem] border-[10px] border-slate-800 bg-slate-900 p-4 shadow-2xl shadow-blue-900/40" role="img" aria-label="Example text conversation: after a missed call, a new patient asks for a cleaning, the automated assistant offers three morning times, and books Thursday at 8 AM.">
          <div class="flex items-center gap-2 border-b border-slate-800 pb-3"><span class="grid h-9 w-9 place-items-center rounded-full bg-blue-600"><svg class="icon w-4 h-4" aria-hidden="true"><use href="#i-tooth"/></svg></span><b class="font-display text-sm font-extrabold">Bright Smile Dental</b></div>
          <div class="mt-3 space-y-2.5 text-[13px]" aria-hidden="true">
            <div class="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-red-200"><svg class="icon w-4 h-4" aria-hidden="true"><use href="#i-missed"/></svg><span><b>Missed call</b> &middot; 10:17 AM</span></div>
            <div class="ml-8 rounded-2xl rounded-br-md bg-blue-600 px-3 py-2">Hi, I need a cleaning. I'm a new patient. Any mornings next week?</div>
            <div class="mr-6 rounded-2xl rounded-bl-md bg-slate-800 px-3 py-2">Hi, this is the automated booking assistant at Bright Smile Dental. Sorry we missed your call! We have Tue 9:30, Thu 8:00 or Fri 10:15. Which works best? (Reply STAFF for a person.)</div>
            <p class="text-center text-[11px] text-slate-400">Replied in 40 seconds</p>
            <div class="ml-auto w-fit rounded-2xl rounded-br-md bg-blue-600 px-3 py-2">Thursday 8am</div>
            <p class="text-center text-[11px] text-slate-400">Name and email collected</p>
            <div class="mr-6 rounded-2xl rounded-bl-md bg-slate-800 px-3 py-2">You're booked for Thursday at 8:00 AM with Dr. Patel. Your confirmation is on its way.</div>
            <div class="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500/15 px-3 py-2 text-xs font-semibold text-emerald-300"><svg class="icon w-4 h-4" aria-hidden="true"><use href="#i-check"/></svg>Booked &middot; front desk notified</div>
          </div>
        </div>
        <p class="mt-4 text-center text-sm text-slate-400">From the <a class="link" href="/demos/missed-call-booking-agent/">live demo</a>. Bright Smile Dental is a made-up practice.</p>
      </div>
    </div>
  </section>

  <section id="how" class="border-t border-slate-900 bg-slate-900/40 px-4 py-16 sm:px-6 sm:py-20 lg:px-8" aria-labelledby="how-title">
    <div class="mx-auto max-w-6xl">
      <div class="mx-auto max-w-3xl text-center">
        <p class="kicker">How it works</p>
        <h2 id="how-title" class="h2">One job: turn a missed call into an appointment.</h2>
        <p class="mt-4 text-lg text-slate-400">It doesn't answer insurance questions or give clinical advice. It books, and it hands everything else to your team.</p>
      </div>
      <ol class="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <li class="rounded-2xl border border-slate-800 bg-slate-950 p-6"><p class="text-xs font-semibold uppercase tracking-wider text-blue-400">Step 1</p><h3 class="mt-1 font-display text-lg font-extrabold">A call goes unanswered</h3><p class="mt-2 text-sm text-slate-400">Your team is with a patient, at lunch or closed for the day. The caller gets a text instead of voicemail.</p></li>
        <li class="rounded-2xl border border-slate-800 bg-slate-950 p-6"><p class="text-xs font-semibold uppercase tracking-wider text-blue-400">Step 2</p><h3 class="mt-1 font-display text-lg font-extrabold">It finds out what they need</h3><p class="mt-2 text-sm text-slate-400">New or existing patient, the kind of visit, and the days and times that suit them.</p></li>
        <li class="rounded-2xl border border-slate-800 bg-slate-950 p-6"><p class="text-xs font-semibold uppercase tracking-wider text-blue-400">Step 3</p><h3 class="mt-1 font-display text-lg font-extrabold">It offers real openings</h3><p class="mt-2 text-sm text-slate-400">Only times that are open in your schedule, then it holds the one they pick while it gets their name and email.</p></li>
        <li class="rounded-2xl border border-slate-800 bg-slate-950 p-6"><p class="text-xs font-semibold uppercase tracking-wider text-blue-400">Step 4</p><h3 class="mt-1 font-display text-lg font-extrabold">It books and tells your team</h3><p class="mt-2 text-sm text-slate-400">The appointment goes on your calendar, the patient gets a confirmation and reminder, and your front desk gets a summary.</p></li>
      </ol>
      <p class="mt-10 text-center"><a class="btn btn-primary" href="/demos/missed-call-booking-agent/">Watch the full conversation<svg class="icon w-5 h-5" aria-hidden="true"><use href="#i-arrow"/></svg></a></p>
    </div>
  </section>

  <section id="cost" class="border-t border-slate-900 px-4 py-16 sm:px-6 sm:py-20 lg:px-8" aria-labelledby="cost-title">
    <div class="mx-auto max-w-6xl">
      <div class="max-w-3xl">
        <p class="kicker">Missed-call cost</p>
        <h2 id="cost-title" class="h2">What are missed calls costing your office?</h2>
        <p class="mt-4 text-lg text-slate-400">The starting numbers are only examples. Change them to match your phone log and your fees.</p>
      </div>
      <div class="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr]">
        <form class="space-y-7 rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8" id="calc" aria-label="Missed-call calculator" onsubmit="return false">
          <label class="block" for="c-calls"><span class="font-display font-extrabold text-white">Missed calls a week</span><small class="mt-0.5 block text-sm text-slate-400">Calls that went to voicemail or rang out.</small>
            <span class="mt-3 flex items-center gap-3"><input class="h-2 flex-1 cursor-pointer accent-blue-500" type="range" id="c-calls-r" min="0" max="100" value="10" aria-hidden="true" tabindex="-1"><input class="w-24 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-right text-white focus:border-blue-500 focus:outline-none" type="number" id="c-calls" min="0" max="500" value="10" inputmode="numeric"><span class="w-14 text-sm text-slate-400">calls</span></span></label>
          <label class="block" for="c-share"><span class="font-display font-extrabold text-white">How many of those wanted an appointment</span><small class="mt-0.5 block text-sm text-slate-400">The rest were questions, vendors or wrong numbers.</small>
            <span class="mt-3 flex items-center gap-3"><input class="h-2 flex-1 cursor-pointer accent-blue-500" type="range" id="c-share-r" min="0" max="100" value="30" aria-hidden="true" tabindex="-1"><input class="w-24 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-right text-white focus:border-blue-500 focus:outline-none" type="number" id="c-share" min="0" max="100" value="30" inputmode="numeric"><span class="w-14 text-sm text-slate-400">%</span></span></label>
          <label class="block" for="c-value"><span class="font-display font-extrabold text-white">What one booked visit is worth to you</span><small class="mt-0.5 block text-sm text-slate-400">For example, your fee for a new-patient exam and cleaning.</small>
            <span class="mt-3 flex items-center gap-3"><input class="h-2 flex-1 cursor-pointer accent-blue-500" type="range" id="c-value-r" min="0" max="1000" step="10" value="200" aria-hidden="true" tabindex="-1"><input class="w-24 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-right text-white focus:border-blue-500 focus:outline-none" type="number" id="c-value" min="0" max="10000" step="10" value="200" inputmode="numeric"><span class="w-14 text-sm text-slate-400">dollars</span></span></label>
        </form>
        <div class="flex flex-col rounded-3xl border border-blue-900/50 bg-gradient-to-b from-blue-950/60 via-slate-900 to-slate-900 p-6 sm:p-8" aria-live="polite">
          <div class="flex items-center justify-between border-b border-slate-800 pb-4"><span class="text-slate-300">Callers a month who wanted to book</span><b class="font-display text-2xl font-extrabold" id="o-callers">13</b></div>
          <div class="flex items-center justify-between border-b border-slate-800 py-4"><span class="text-slate-300">Visits at stake each month</span><b class="font-display text-4xl font-extrabold text-sky-300" id="o-value">$2,600</b></div>
          <p class="mt-4 text-slate-200" id="o-even">The agent's monthly fee is covered once it books <b>5 visits</b> a month that would otherwise have gone to voicemail.</p>
          <p class="mt-auto pt-6 text-xs text-slate-400">An estimate from your numbers, not a promise. Some callers would have called back anyway, and not everyone who gets a text will book.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="border-t border-slate-900 bg-slate-900/40 px-4 py-16 sm:px-6 sm:py-20 lg:px-8" aria-labelledby="feat-title">
    <div class="mx-auto max-w-6xl">
      <div class="mx-auto max-w-3xl text-center">
        <p class="kicker">Built for a dental front desk</p>
        <h2 id="feat-title" class="h2">Fast for patients. Safe for your practice.</h2>
      </div>
      <ul class="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <li class="rounded-2xl border border-slate-800 bg-slate-950 p-6"><span class="grid h-11 w-11 place-items-center rounded-xl bg-blue-500/15 text-blue-300"><svg class="icon w-5 h-5" aria-hidden="true"><use href="#i-chat"/></svg></span><h3 class="mt-4 font-display text-lg font-extrabold">Replies within a minute</h3><p class="mt-2 text-sm text-slate-400">Callers hear back while they're still deciding, not after they've booked somewhere else.</p></li>
        <li class="rounded-2xl border border-slate-800 bg-slate-950 p-6"><span class="grid h-11 w-11 place-items-center rounded-xl bg-blue-500/15 text-blue-300"><svg class="icon w-5 h-5" aria-hidden="true"><use href="#i-user"/></svg></span><h3 class="mt-4 font-display text-lg font-extrabold">Always says it's automated</h3><p class="mt-2 text-sm text-slate-400">Every conversation starts by saying it's an assistant. Patients can reply STAFF to reach a person any time.</p></li>
        <li class="rounded-2xl border border-slate-800 bg-slate-950 p-6"><span class="grid h-11 w-11 place-items-center rounded-xl bg-amber-500/15 text-amber-300"><svg class="icon w-5 h-5" aria-hidden="true"><use href="#i-alert"/></svg></span><h3 class="mt-4 font-display text-lg font-extrabold">Urgent goes to a person</h3><p class="mt-2 text-sm text-slate-400">Pain, swelling, bleeding or a broken tooth isn't booked by a bot. Your team gets an urgent alert to call back.</p></li>
        <li class="rounded-2xl border border-slate-800 bg-slate-950 p-6"><span class="grid h-11 w-11 place-items-center rounded-xl bg-blue-500/15 text-blue-300"><svg class="icon w-5 h-5" aria-hidden="true"><use href="#i-cal"/></svg></span><h3 class="mt-4 font-display text-lg font-extrabold">Books into your schedule</h3><p class="mt-2 text-sm text-slate-400">It works with most practice calendars and only offers times that are really open. If yours can't connect, I'll tell you before you pay.</p></li>
        <li class="rounded-2xl border border-slate-800 bg-slate-950 p-6"><span class="grid h-11 w-11 place-items-center rounded-xl bg-blue-500/15 text-blue-300"><svg class="icon w-5 h-5" aria-hidden="true"><use href="#i-bell"/></svg></span><h3 class="mt-4 font-display text-lg font-extrabold">A summary for every booking</h3><p class="mt-2 text-sm text-slate-400">Who it is, new or existing, what they need and when. Your team doesn't have to read the whole thread.</p></li>
        <li class="rounded-2xl border border-slate-800 bg-slate-950 p-6"><span class="grid h-11 w-11 place-items-center rounded-xl bg-blue-500/15 text-blue-300"><svg class="icon w-5 h-5" aria-hidden="true"><use href="#i-list"/></svg></span><h3 class="mt-4 font-display text-lg font-extrabold">Every conversation logged</h3><p class="mt-2 text-sm text-slate-400">A full record of what was said and booked, so nothing depends on someone remembering a voicemail.</p></li>
      </ul>
    </div>
  </section>

  <section id="pricing" class="border-t border-slate-900 px-4 py-16 sm:px-6 sm:py-20 lg:px-8" aria-labelledby="pricing-title">
    <div class="mx-auto max-w-6xl">
      <div class="mx-auto max-w-3xl text-center">
        <p class="kicker">Pricing</p>
        <h2 id="pricing-title" class="h2">One setup fee, one monthly fee.</h2>
        <p class="mt-4 text-lg text-slate-400">Confirmed in writing before any work starts. No long-term contract.</p>
      </div>
      <div class="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-8 rounded-3xl border-2 border-blue-600 bg-gradient-to-b from-blue-950/50 via-slate-900 to-slate-900 p-7 shadow-2xl shadow-blue-600/10 sm:p-10 md:grid-cols-2">
        <div>
          <p class="font-display text-5xl font-extrabold">$1,500<span class="ml-2 font-sans text-base font-normal text-slate-400">one-time setup</span></p>
          <p class="mt-2 font-display text-3xl font-extrabold text-slate-200">+ $1,000<span class="ml-1 font-sans text-base font-normal text-slate-400">/ month</span></p>
          <p class="mt-4 text-sm text-slate-400">Works with or without a website from me. You don't need a new one.</p>
          <a class="btn btn-primary mt-7" href="#contact">See if it fits your office<svg class="icon w-5 h-5" aria-hidden="true"><use href="#i-arrow"/></svg></a>
        </div>
        <ul class="space-y-3 text-sm text-slate-300">
          <li class="flex gap-2"><svg class="icon w-4 h-4 shrink-0 mt-1 text-blue-400" aria-hidden="true"><use href="#i-check"/></svg><span>Setup and calendar connection</span></li>
          <li class="flex gap-2"><svg class="icon w-4 h-4 shrink-0 mt-1 text-blue-400" aria-hidden="true"><use href="#i-check"/></svg><span>Text-back within a minute</span></li>
          <li class="flex gap-2"><svg class="icon w-4 h-4 shrink-0 mt-1 text-blue-400" aria-hidden="true"><use href="#i-check"/></svg><span>Booking, confirmations and reminders</span></li>
          <li class="flex gap-2"><svg class="icon w-4 h-4 shrink-0 mt-1 text-blue-400" aria-hidden="true"><use href="#i-check"/></svg><span>Urgent handoff to your team</span></li>
          <li class="flex gap-2"><svg class="icon w-4 h-4 shrink-0 mt-1 text-blue-400" aria-hidden="true"><use href="#i-check"/></svg><span>Front-desk summaries and a full log</span></li>
          <li class="flex gap-2"><svg class="icon w-4 h-4 shrink-0 mt-1 text-blue-400" aria-hidden="true"><use href="#i-check"/></svg><span>Monthly monitoring</span></li>
        </ul>
      </div>
    </div>
  </section>

  <section id="faq" class="border-t border-slate-900 bg-slate-900/40 px-4 py-16 sm:px-6 sm:py-20 lg:px-8" aria-labelledby="faq-title">
    <div class="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[1fr_2fr]">
      <div>
        <p class="kicker">FAQ</p>
        <h2 id="faq-title" class="h2">Questions practices ask me.</h2>
        <p class="mt-4 text-slate-400">Don't see yours? <a class="link" href="tel:+19013210023">Call or text</a> or <a class="link" href="#contact">send a message</a>.</p>
      </div>
      <div class="space-y-3">
        <details class="group rounded-2xl border border-slate-800 bg-slate-900/80 open:border-blue-900/70" open><summary class="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-display text-[17px] font-extrabold text-white">Will patients know they're texting an automated assistant?<span class="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-slate-700 text-blue-400 transition group-open:rotate-45"><svg class="icon w-4 h-4" aria-hidden="true"><use href="#i-plus"/></svg></span></summary><p class="px-5 pb-5 text-[15px] leading-relaxed text-slate-400">Yes. The first text says it's your office's automated booking assistant, and patients can reply STAFF at any point to reach a person.</p></details>
        <details class="group rounded-2xl border border-slate-800 bg-slate-900/80 open:border-blue-900/70"><summary class="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-display text-[17px] font-extrabold text-white">What happens when someone has an emergency?<span class="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-slate-700 text-blue-400 transition group-open:rotate-45"><svg class="icon w-4 h-4" aria-hidden="true"><use href="#i-plus"/></svg></span></summary><p class="px-5 pb-5 text-[15px] leading-relaxed text-slate-400">It doesn't try to book it. Pain, swelling, bleeding or a broken tooth sends your front desk an urgent alert to call the patient back, and the patient is told someone will call shortly. If they mention trouble breathing or swallowing, they're told to call 911 or go to the ER.</p></details>
        <details class="group rounded-2xl border border-slate-800 bg-slate-900/80 open:border-blue-900/70"><summary class="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-display text-[17px] font-extrabold text-white">Does it work with our practice software?<span class="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-slate-700 text-blue-400 transition group-open:rotate-45"><svg class="icon w-4 h-4" aria-hidden="true"><use href="#i-plus"/></svg></span></summary><p class="px-5 pb-5 text-[15px] leading-relaxed text-slate-400">It works with most practice calendars. Tell me what you use and I'll confirm it connects before you pay anything. If it can't, I'll say so.</p></details>
        <details class="group rounded-2xl border border-slate-800 bg-slate-900/80 open:border-blue-900/70"><summary class="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-display text-[17px] font-extrabold text-white">Do we need a new website?<span class="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-slate-700 text-blue-400 transition group-open:rotate-45"><svg class="icon w-4 h-4" aria-hidden="true"><use href="#i-plus"/></svg></span></summary><p class="px-5 pb-5 text-[15px] leading-relaxed text-slate-400">No. The agent works with the phone number and calendar you already have. If you do want a new site too, that's priced separately on the <a class="link" href="/#pricing">main pricing page</a>.</p></details>
        <details class="group rounded-2xl border border-slate-800 bg-slate-900/80 open:border-blue-900/70"><summary class="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-display text-[17px] font-extrabold text-white">What does it cost, and is there a contract?<span class="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-slate-700 text-blue-400 transition group-open:rotate-45"><svg class="icon w-4 h-4" aria-hidden="true"><use href="#i-plus"/></svg></span></summary><p class="px-5 pb-5 text-[15px] leading-relaxed text-slate-400">$1,500 to set up and $1,000 a month after that, confirmed in writing before any work starts. There's no long-term contract.</p></details>
        <details class="group rounded-2xl border border-slate-800 bg-slate-900/80 open:border-blue-900/70"><summary class="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-display text-[17px] font-extrabold text-white">Can we see it before we commit?<span class="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-slate-700 text-blue-400 transition group-open:rotate-45"><svg class="icon w-4 h-4" aria-hidden="true"><use href="#i-plus"/></svg></span></summary><p class="px-5 pb-5 text-[15px] leading-relaxed text-slate-400">Yes. <a class="link" href="/demos/missed-call-booking-agent/">Watch the demo</a> for a full conversation, including an urgent request handed to a person. Then send the form below and I'll walk you through how it would work with your phones and calendar.</p></details>
      </div>
    </div>
  </section>

  <section id="contact" class="border-t border-slate-900 px-4 py-16 sm:px-6 sm:py-20 lg:px-8" aria-labelledby="contact-title">
    <div class="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[1fr_1.15fr]">
      <div>
        <p class="kicker">Next step</p>
        <h2 id="contact-title" class="h2">See if it fits your office.</h2>
        <p class="mt-4 text-lg text-slate-400">Tell me a little about your practice. There's no cost and no obligation to ask.</p>
        <ol class="mt-8 space-y-4 text-sm text-slate-300">
          <li class="flex gap-3"><span class="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-600 font-display text-xs font-extrabold">1</span><span><b class="block text-white">I reply within one business day</b>By text or email, to set up a short call.</span></li>
          <li class="flex gap-3"><span class="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-600 font-display text-xs font-extrabold">2</span><span><b class="block text-white">We check your phones and calendar</b>I confirm your scheduling software can connect before you pay anything.</span></li>
          <li class="flex gap-3"><span class="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-600 font-display text-xs font-extrabold">3</span><span><b class="block text-white">You decide</b>If it's a fit, you get the price in writing before setup starts.</span></li>
        </ol>
        <a class="mt-8 flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-blue-600" href="tel:+19013210023"><span class="grid h-12 w-12 place-items-center rounded-xl bg-blue-600"><svg class="icon w-6 h-6" aria-hidden="true"><use href="#i-phone"/></svg></span><span><small class="block text-sm text-slate-400">Rather talk? Call or text Austin</small><b class="font-display text-2xl font-extrabold">(901) 321-0023</b></span></a>
      </div>
      <form id="contact-form" class="grid grid-cols-1 gap-4 rounded-3xl border border-blue-900/50 bg-slate-900 p-6 shadow-2xl sm:grid-cols-2 sm:p-8" action="https://api.web3forms.com/submit" method="POST">
        <h3 class="font-display text-xl font-extrabold sm:col-span-2">Tell me about your practice</h3>
        <p class="-mt-2 text-sm text-slate-400 sm:col-span-2">Takes about a minute. Only your name, practice and a way to reach you are required.</p>
        <input type="hidden" name="access_key" value="20844a35-5000-46b3-997a-be5114bb4edf">
        <input type="hidden" name="from_name" value="bartlettwebsitedesign.online/dental">
        <input type="hidden" name="plan" value="Missed-call booking agent ($1,500 setup + $1,000/mo)">
        <input type="checkbox" name="botcheck" class="hidden" tabindex="-1" autocomplete="off" aria-hidden="true">
        <label class="field">Your name<input name="name" autocomplete="name" required></label>
        <label class="field">Practice name<input name="business" autocomplete="organization" required></label>
        <label class="field sm:col-span-2">Phone or email<input name="reach" required placeholder="Best number to text, or your email"></label>
        <label class="field">Scheduling software
          <select name="software"><option>Not sure</option><option>Dentrix</option><option>Open Dental</option><option>Eaglesoft</option><option>Curve Dental</option><option>Denticon</option><option>Something else</option></select>
        </label>
        <label class="field">Missed calls a week
          <select name="missed_calls"><option>Not sure</option><option>Under 5</option><option>5 to 15</option><option>15 to 30</option><option>More than 30</option></select>
        </label>
        <label class="field sm:col-span-2"><span>Anything else? <span class="font-normal text-slate-400">(optional)</span></span><textarea name="message" rows="4" placeholder="How many locations, when calls get missed most, or anything you want the agent to handle differently"></textarea></label>
        <button class="btn btn-primary btn-lg sm:col-span-2" type="submit">See if it fits my office</button>
        <p class="flex items-center gap-2 text-xs text-slate-400 sm:col-span-2"><svg class="icon w-4 h-4" aria-hidden="true"><use href="#i-lock"/></svg>I only use your details to reply about the booking agent. No mailing lists, never shared.</p>
        <p class="text-sm text-slate-400 sm:col-span-2" id="form-status" role="status" aria-live="polite">Prefer to talk? Call or text <a class="link" href="tel:+19013210023">(901) 321-0023</a>.</p>
      </form>
    </div>
  </section>
</main>
`);
