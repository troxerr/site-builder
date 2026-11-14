// Homepage. Dynamic parts come from tools/build.mjs (c = page context); everything else is the page itself.
export default (c) => `${c.head}
<body class="bg-slate-950 font-sans text-white antialiased selection:bg-blue-600 selection:text-white">
${c.top}

<main id="main">
  <span id="top"></span>

  <!-- HERO -->
  <section class="studio-hero relative overflow-hidden bg-gradient-to-b from-brand/25 via-slate-950 to-slate-950 px-4 pb-16 pt-8 sm:px-6 sm:pt-20 lg:px-8 lg:pb-24 lg:pt-24" aria-labelledby="hero-title">
    <div class="pointer-events-none absolute left-1/2 top-1/3 h-[350px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-[150px]" aria-hidden="true"></div>
    <div class="hero-layout relative z-10 mx-auto max-w-5xl text-center">
      <div class="hero-copy">
      <p class="mb-4 hidden items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1.5 sm:mb-6 sm:inline-flex text-xs font-semibold uppercase tracking-wider text-blue-300"><span class="h-2 w-2 rounded-full bg-blue-400 motion-safe:animate-pulse" aria-hidden="true"></span>Free draft before you pay &bull; No long-term contracts</p>
      <h1 id="hero-title" class="font-display text-[2.1rem] font-extrabold leading-[1.08] sm:text-[2.4rem] tracking-tight sm:text-6xl lg:text-7xl">A better website.<br>A clearer path to <span class="bg-gradient-to-r from-blue-400 via-sky-300 to-white bg-clip-text text-transparent"><span class="whitespace-nowrap">booked jobs.</span></span></h1>
      <p class="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-slate-300 sm:mt-6 sm:text-xl">Fast, custom websites and missed-call text-back for Memphis-area businesses.<span class="hidden sm:inline"> I'm Austin, your web designer here in Bartlett. You work directly with me, from the first draft to launch.</span></p>
      <div class="mt-6 flex flex-col items-center justify-center gap-3 sm:mt-8 sm:flex-row">
        <a class="btn btn-primary btn-lg w-full sm:w-auto" href="#contact">Get my free draft<svg class="icon w-5 h-5" aria-hidden="true"><use href="#i-arrow"/></svg></a>
        <a class="btn btn-dark btn-lg w-full sm:w-auto" href="#showcase">See the difference &darr;</a>
      </div>
      <p class="mt-4 text-sm text-slate-400">Or call or text <a class="link font-semibold text-white" href="tel:+19013210023">(901) 321-0023</a>. It reaches me directly, and I reply within 1–3 business days.</p>
      </div>
      <div class="hero-aside">
      <div class="draft-panel mx-auto mt-10 flex max-w-2xl items-start gap-4 rounded-2xl border border-blue-500/30 bg-blue-500/10 p-5 text-left">
        <span class="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blue-600 font-display text-lg font-extrabold" aria-hidden="true">$0</span>
        <div><p class="font-display font-extrabold text-white">See a free working draft of your site before you pay.</p><p class="mt-1 text-sm text-slate-300">Send me a few details and I'll build a real, clickable draft with your name, services and hours in 2&ndash;3 days. Love it, then we talk price. Don't, and you owe nothing. No deposit, no card.</p></div>
      </div>
${c.founding.hero}
      </div>
      <ul class="mt-12 grid grid-cols-2 gap-4 border-t border-slate-800 pt-8 text-sm font-semibold text-slate-300 md:grid-cols-4">
        <li class="flex items-center justify-center gap-2"><svg class="icon w-4 h-4 shrink-0 mt-1 text-blue-400" aria-hidden="true"><use href="#i-check"/></svg>Built in Bartlett</li>
        <li class="flex items-center justify-center gap-2"><svg class="icon w-4 h-4 shrink-0 mt-1 text-blue-400" aria-hidden="true"><use href="#i-check"/></svg>Missed-call text-back</li>
        <li class="flex items-center justify-center gap-2"><svg class="icon w-4 h-4 shrink-0 mt-1 text-blue-400" aria-hidden="true"><use href="#i-check"/></svg>Fast on any phone</li>
        <li class="flex items-center justify-center gap-2"><svg class="icon w-4 h-4 shrink-0 mt-1 text-blue-400" aria-hidden="true"><use href="#i-check"/></svg>Text me directly</li>
      </ul>
      <p class="mt-6 flex items-center justify-center gap-2 text-sm text-slate-400"><svg class="icon w-4 h-4 text-blue-400" aria-hidden="true"><use href="#i-pin"/></svg><span>Serving <a class="link" href="/bartlett/">Bartlett</a>, <a class="link" href="/memphis/">Memphis</a>, <a class="link" href="/cordova/">Cordova</a>, <a class="link" href="/germantown/">Germantown</a>, <a class="link" href="/arlington/">Arlington</a> &amp; <a class="link" href="/lakeland/">Lakeland</a></span></p>
    </div>
  </section>

  <!-- BEFORE / AFTER SHOWCASE -->
  <section id="showcase" class="border-y border-slate-900 bg-slate-950/60 px-4 py-16 sm:px-6 sm:py-20 lg:px-8" aria-labelledby="showcase-title">
    <div class="mx-auto max-w-6xl">
      <div class="mx-auto mb-10 max-w-3xl text-center">
        <p class="kicker">Before &amp; after</p>
        <h2 id="showcase-title" class="h2">Stop losing big jobs to a <span class="bg-gradient-to-r from-blue-400 to-sky-200 bg-clip-text text-transparent">2012 website.</span></h2>
        <p class="mt-4 text-lg text-slate-400">Drag the slider to compare a typical outdated site with the kind of site I build: one tap to call, quick quote buttons and a text-back for the calls you can't take.</p>
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

  <!-- TEXT-BACK + BOOKING AGENT (id kept for links from other pages) -->
  <section id="booking-agent" class="px-4 py-16 sm:px-6 sm:py-20 lg:px-8" aria-labelledby="math-title">
    <div class="mx-auto max-w-6xl rounded-3xl border border-blue-900/40 bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-900 p-7 sm:p-12">
      <div class="max-w-3xl">
        <p class="kicker">The real math</p>
        <h2 id="math-title" class="h2">One saved job can pay for a year of text-back.</h2>
        <p class="mt-4 text-base leading-relaxed text-slate-300 sm:text-lg">When you miss a call, most people don't leave a voicemail. They call the next business on Google. A text-back replies within a minute, so the job doesn't walk away. At $297 a month, that's $3,564 a year, and for a roofer or remodeler one saved job is often worth more than that.</p>
      </div>
      <ol class="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
        <li class="rounded-2xl border border-slate-800 bg-slate-950/80 p-6"><p class="text-xs font-semibold uppercase tracking-wider text-blue-400">Step 1</p><h3 class="mt-1 font-display text-xl font-extrabold text-white">You miss a call</h3><p class="mt-2 text-sm text-slate-400">You're on a job site or with a customer and can't pick up.</p></li>
        <li class="rounded-2xl border border-slate-800 bg-slate-950/80 p-6"><p class="text-xs font-semibold uppercase tracking-wider text-blue-400">Step 2</p><h3 class="mt-1 font-display text-xl font-extrabold text-white">They get a text right away</h3><p class="mt-2 text-sm text-slate-400">&ldquo;Sorry we missed you. Are you looking for an estimate?&rdquo; It goes out from your business within a minute.</p></li>
        <li class="rounded-2xl border border-slate-800 bg-slate-950/80 p-6"><p class="text-xs font-semibold uppercase tracking-wider text-blue-400">Step 3</p><h3 class="mt-1 font-display text-xl font-extrabold text-white">You call back a warm lead</h3><p class="mt-2 text-sm text-slate-400">They reply with details or photos, and you get it all before they call anyone else.</p></li>
      </ol>
      <div class="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div class="rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
          <p class="text-xs font-semibold uppercase tracking-wider text-blue-400">For contractors &amp; shops</p>
          <h3 class="mt-1 font-display text-xl font-extrabold">Missed-call text-back &middot; $297/mo</h3>
          <p class="mt-2 text-sm text-slate-400">Texts every missed caller back, asks what they need and sends their reply to you. Includes Google review requests after a job and one inbox for every lead.</p>
          <a class="btn btn-dark mt-5" href="#contact" data-plan="Missed-call text-back ($297/mo)">Ask about text-back</a>
        </div>
        <div class="rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
          <p class="text-xs font-semibold uppercase tracking-wider text-blue-400">For offices that book appointments</p>
          <h3 class="mt-1 font-display text-xl font-extrabold">Booking agent &middot; $1,500 setup + $1,000/mo</h3>
          <p class="mt-2 text-sm text-slate-400">Goes a step further: offers times that are really open and books the appointment into your calendar. It always says it's automated, and callers can reply STAFF to reach a person.</p>
          <div class="mt-5 flex flex-wrap gap-3"><a class="btn btn-dark" href="/demos/missed-call-booking-agent/">Try the live demo<svg class="icon w-4 h-4" aria-hidden="true"><use href="#i-arrow"/></svg></a><a class="link self-center text-sm" href="/dental/">How it works for dental offices</a></div>
        </div>
      </div>
    </div>
  </section>

  <!-- DEMOS -->
  <section id="work" class="border-t border-slate-900 px-4 py-16 sm:px-6 sm:py-20 lg:px-8" aria-labelledby="work-title">
    <div class="mx-auto max-w-6xl">
      <div class="max-w-3xl">
        <p class="kicker">Live demos</p>
        <h2 id="work-title" class="h2">Five designs. Five different approaches.</h2>
        <p class="mt-4 text-lg text-slate-400">Selected for clear layouts, distinctive typography and useful interactions. Explore three business websites, a booking workflow and an interactive 3D study.</p>
      </div>
      <ul class="work mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
${c.demoPool}
        <li class="work-item wide"><a class="flex h-full flex-col justify-center rounded-2xl border-2 border-dashed border-blue-700/60 bg-blue-950/30 p-7 transition hover:border-blue-500" href="#contact" data-plan="Not sure yet">
          <span class="w-fit rounded-full border border-blue-500/40 px-3 py-1 text-xs font-semibold text-blue-300">Your business here</span>
          <h3 class="mt-4 font-display text-2xl font-extrabold">Want to see yours next?</h3>
          <p class="mt-2 text-slate-400">Tell me about your business and I'll build a free working draft in 2&ndash;3 days. Contractors, shops, clinics, salons and restaurants all welcome.</p>
          <span class="mt-5 inline-flex items-center gap-1.5 font-semibold text-blue-400">Get my free draft<svg class="icon w-4 h-4" aria-hidden="true"><use href="#i-arrow"/></svg></span></a></li>
      </ul>
      <p class="mt-10 text-center"><a class="btn btn-primary" href="/demos/">See all ${c.demoCount} live demos<svg class="icon w-5 h-5" aria-hidden="true"><use href="#i-arrow"/></svg></a></p>
      <p class="mx-auto mt-4 max-w-3xl text-center text-sm text-slate-400">Five selected concepts, each showing a different approach to design and interaction. Sample businesses and design studies; customizable for your brand.</p>
    </div>
  </section>

  <!-- PROCESS -->
  <section id="process" class="border-t border-slate-900 bg-slate-900/40 px-4 py-16 sm:px-6 sm:py-20 lg:px-8" aria-labelledby="process-title">
    <div class="mx-auto max-w-6xl">
      <div class="mx-auto max-w-3xl text-center">
        <p class="kicker">How it works</p>
        <h2 id="process-title" class="h2">From &ldquo;we need a website&rdquo; to live in four steps.</h2>
        <p class="mt-4 text-lg text-slate-400">You see a real, clickable draft before you spend a dime. No deposit and no card on file.</p>
      </div>
      <ol class="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <li class="rounded-2xl border border-slate-800 bg-slate-950 p-6"><p class="text-xs font-semibold uppercase tracking-wider text-blue-400">1&ndash;3 business days &middot; Free</p><h3 class="mt-1 font-display text-lg font-extrabold">Quick chat</h3><p class="mt-2 text-sm text-slate-400">I reply within 1–3 business days with a couple of quick questions. A 15-minute call or a few texts, your pick.</p></li>
        <li class="rounded-2xl border border-slate-800 bg-slate-950 p-6"><p class="text-xs font-semibold uppercase tracking-wider text-blue-400">After our chat &middot; Free</p><h3 class="mt-1 font-display text-lg font-extrabold">Your draft</h3><p class="mt-2 text-sm text-slate-400">I build a working draft with your name, services, hours and a custom look, and text you the link.</p></li>
        <li class="rounded-2xl border border-slate-800 bg-slate-950 p-6"><p class="text-xs font-semibold uppercase tracking-wider text-blue-400">Once approved</p><h3 class="mt-1 font-display text-lg font-extrabold">Tweak and launch</h3><p class="mt-2 text-sm text-slate-400">Tell me what to change. Once you love it, you pay, I connect your domain in your name, and you're live.</p></li>
        <li class="rounded-2xl border border-slate-800 bg-slate-950 p-6"><p class="text-xs font-semibold uppercase tracking-wider text-blue-400">After launch</p><h3 class="mt-1 font-display text-lg font-extrabold">Stay current</h3><p class="mt-2 text-sm text-slate-400">New prices, hours or photos? Text them to me, the same person who built your site.</p></li>
      </ol>
    </div>
  </section>

  <!-- PRICING -->
  <section id="pricing" class="border-t border-slate-900 px-4 py-16 sm:px-6 sm:py-20 lg:px-8" aria-labelledby="pricing-title">
    <div class="mx-auto max-w-6xl">
      <div class="mx-auto max-w-3xl text-center">
        <p class="kicker">Pricing</p>
        <h2 id="pricing-title" class="h2">Clear prices. No long-term contracts.</h2>
        <p class="mt-4 text-lg text-slate-400">Pay once for a website, or pick a monthly plan built for contractors. Either way, you see your free draft first.</p>
      </div>

${c.founding.banner}
      <h3 class="mt-12 font-display text-xl font-extrabold">Websites <span class="mt-1 block text-sm font-sans font-normal text-slate-400 sm:ml-2 sm:mt-0 sm:inline sm:align-middle">Pay once, after you approve your draft</span></h3>
      <ul class="mt-5 grid grid-cols-1 gap-6 md:grid-cols-3">
        <li class="relative flex flex-col rounded-3xl border border-slate-800 bg-slate-900/90 p-7">
          <p class="text-xs font-semibold uppercase tracking-wider text-blue-400">Starter</p>
          ${c.card.starter}
          <p class="mt-3 text-sm text-slate-400">A polished one-page site to get you found.</p>
          <ul class="mt-5 mb-7 space-y-2.5 text-sm text-slate-300"><li class="flex gap-2"><svg class="icon w-4 h-4 shrink-0 mt-1 text-blue-400" aria-hidden="true"><use href="#i-check"/></svg><span>Custom one-page design</span></li><li class="flex gap-2"><svg class="icon w-4 h-4 shrink-0 mt-1 text-blue-400" aria-hidden="true"><use href="#i-check"/></svg><span>Services, hours, map and tap to call</span></li><li class="flex gap-2"><svg class="icon w-4 h-4 shrink-0 mt-1 text-blue-400" aria-hidden="true"><use href="#i-check"/></svg><span>Mobile-first and fast</span></li><li class="flex gap-2"><svg class="icon w-4 h-4 shrink-0 mt-1 text-blue-400" aria-hidden="true"><use href="#i-check"/></svg><span>Domain and free hosting setup</span></li></ul>
          <a class="btn btn-dark mt-auto w-full" href="#contact" ${c.attr.starter}>Start with a free draft</a></li>
        <li class="relative flex flex-col rounded-3xl border-2 border-blue-600 bg-gradient-to-b from-blue-950/50 via-slate-900 to-slate-900 shadow-2xl shadow-blue-600/10 p-7"><span class="absolute -top-3 right-6 rounded-full bg-blue-600 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">Most popular</span>
          <p class="text-xs font-semibold uppercase tracking-wider text-blue-400">Business</p>
          ${c.card.business}
          <p class="mt-3 text-sm text-slate-400">Everything in Starter, plus the extras that bring in customers.</p>
          <ul class="mt-5 mb-7 space-y-2.5 text-sm text-slate-300"><li class="flex gap-2"><svg class="icon w-4 h-4 shrink-0 mt-1 text-blue-400" aria-hidden="true"><use href="#i-check"/></svg><span>Custom logo design</span></li><li class="flex gap-2"><svg class="icon w-4 h-4 shrink-0 mt-1 text-blue-400" aria-hidden="true"><use href="#i-check"/></svg><span>Online booking or price list</span></li><li class="flex gap-2"><svg class="icon w-4 h-4 shrink-0 mt-1 text-blue-400" aria-hidden="true"><use href="#i-check"/></svg><span>Google Business Profile setup</span></li><li class="flex gap-2"><svg class="icon w-4 h-4 shrink-0 mt-1 text-blue-400" aria-hidden="true"><use href="#i-check"/></svg><span>Matching email address</span></li><li class="flex gap-2"><svg class="icon w-4 h-4 shrink-0 mt-1 text-blue-400" aria-hidden="true"><use href="#i-check"/></svg><span>3 rounds of changes</span></li></ul>
          <a class="btn btn-primary mt-auto w-full" href="#contact" ${c.attr.business}>Get my free draft</a></li>
        <li class="relative flex flex-col rounded-3xl border border-slate-800 bg-slate-900/90 p-7">
          <p class="text-xs font-semibold uppercase tracking-wider text-blue-400">Care plan</p>
          <p class="mt-2 font-display text-4xl font-extrabold text-white">$45<span class="ml-1 font-sans text-base font-normal text-slate-400">/ month</span></p>
          <p class="mt-3 text-sm text-slate-400">Optional. For owners who'd rather not think about it.</p>
          <ul class="mt-5 mb-7 space-y-2.5 text-sm text-slate-300"><li class="flex gap-2"><svg class="icon w-4 h-4 shrink-0 mt-1 text-blue-400" aria-hidden="true"><use href="#i-check"/></svg><span>Text me changes any time</span></li><li class="flex gap-2"><svg class="icon w-4 h-4 shrink-0 mt-1 text-blue-400" aria-hidden="true"><use href="#i-check"/></svg><span>Hours, prices and photo updates</span></li><li class="flex gap-2"><svg class="icon w-4 h-4 shrink-0 mt-1 text-blue-400" aria-hidden="true"><use href="#i-check"/></svg><span>Domain renewals handled</span></li><li class="flex gap-2"><svg class="icon w-4 h-4 shrink-0 mt-1 text-blue-400" aria-hidden="true"><use href="#i-check"/></svg><span>Cancel any time</span></li></ul>
          <a class="btn btn-dark mt-auto w-full" href="#contact" data-plan="Care plan ($45/mo)">Ask about care</a></li>
      </ul>

      <h3 class="mt-14 font-display text-xl font-extrabold">Monthly plans for contractors <span class="mt-1 block text-sm font-sans font-normal text-slate-400 sm:ml-2 sm:mt-0 sm:inline sm:align-middle">Month to month, cancel any time</span></h3>
      <ul class="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2">
        <li class="relative flex flex-col rounded-3xl border border-slate-800 bg-slate-900/90 p-7">
          <p class="text-xs font-semibold uppercase tracking-wider text-blue-400">Lead recovery</p>
          <p class="mt-2 font-display text-4xl font-extrabold text-white">$297<span class="ml-1 font-sans text-base font-normal text-slate-400">/ month</span></p>
          <p class="mt-3 text-sm text-slate-400">For established businesses that already have a website and want to stop losing calls to voicemail.</p>
          <ul class="mt-5 mb-7 space-y-2.5 text-sm text-slate-300"><li class="flex gap-2"><svg class="icon w-4 h-4 shrink-0 mt-1 text-blue-400" aria-hidden="true"><use href="#i-check"/></svg><span>Missed-call text-back, day and night</span></li><li class="flex gap-2"><svg class="icon w-4 h-4 shrink-0 mt-1 text-blue-400" aria-hidden="true"><use href="#i-check"/></svg><span>Google review requests after each job</span></li><li class="flex gap-2"><svg class="icon w-4 h-4 shrink-0 mt-1 text-blue-400" aria-hidden="true"><use href="#i-check"/></svg><span>One inbox for every lead</span></li><li class="flex gap-2"><svg class="icon w-4 h-4 shrink-0 mt-1 text-blue-400" aria-hidden="true"><use href="#i-check"/></svg><span>No long-term contract</span></li></ul>
          <a class="btn btn-dark mt-auto w-full" href="#contact" data-plan="Missed-call text-back ($297/mo)">Get started</a></li>
        <li class="relative flex flex-col rounded-3xl border-2 border-blue-600 bg-gradient-to-b from-blue-950/50 via-slate-900 to-slate-900 shadow-2xl shadow-blue-600/10 p-7"><span class="absolute -top-3 right-6 rounded-full bg-blue-600 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">Best for contractors</span>
          <p class="text-xs font-semibold uppercase tracking-wider text-blue-400">Website + text-back</p>
          <p class="mt-2 font-display text-4xl font-extrabold text-white">$497<span class="ml-1 font-sans text-base font-normal text-slate-400">/ month</span></p><p class="mt-1 text-sm font-semibold text-blue-300">+ $497 one-time setup, paid after you approve your draft</p>
          <p class="mt-3 text-sm text-slate-400">A fast custom site for your trade, with the text-back built in.</p>
          <ul class="mt-5 mb-7 space-y-2.5 text-sm text-slate-300"><li class="flex gap-2"><svg class="icon w-4 h-4 shrink-0 mt-1 text-blue-400" aria-hidden="true"><use href="#i-check"/></svg><span>Custom site built for your trade</span></li><li class="flex gap-2"><svg class="icon w-4 h-4 shrink-0 mt-1 text-blue-400" aria-hidden="true"><use href="#i-check"/></svg><span>Quote, booking and call buttons up front</span></li><li class="flex gap-2"><svg class="icon w-4 h-4 shrink-0 mt-1 text-blue-400" aria-hidden="true"><use href="#i-check"/></svg><span>Missed-call text-back, day and night</span></li><li class="flex gap-2"><svg class="icon w-4 h-4 shrink-0 mt-1 text-blue-400" aria-hidden="true"><use href="#i-check"/></svg><span>Local search and Google Business Profile setup</span></li><li class="flex gap-2"><svg class="icon w-4 h-4 shrink-0 mt-1 text-blue-400" aria-hidden="true"><use href="#i-check"/></svg><span>Updates by text, straight to me</span></li></ul>
          <a class="btn btn-primary mt-auto w-full" href="#contact" data-plan="Website + text-back ($497/mo + $497 setup)">Start with a free draft</a></li>
      </ul>

      <div class="mt-8 flex flex-col gap-5 rounded-3xl border border-slate-800 bg-slate-900/70 p-7 lg:flex-row lg:items-center lg:justify-between">
        <div class="max-w-2xl"><p class="text-xs font-semibold uppercase tracking-wider text-blue-400">For appointment-based offices</p><p class="mt-1 font-display text-xl font-extrabold">Missed-call booking agent</p><p class="mt-2 text-sm text-slate-400">Text-back plus real booking: it offers open times and books into your calendar, with a front-desk summary for every booking and urgent requests handed to a person.</p></div>
        <div class="shrink-0 lg:text-right"><p class="font-display text-3xl font-extrabold">$1,500 <span class="font-sans text-base font-normal text-slate-400">setup</span></p><p class="font-display text-xl font-extrabold text-slate-200">+ $1,000 <span class="font-sans text-base font-normal text-slate-400">/ month</span></p><a class="btn btn-dark mt-4" href="#contact" data-plan="Missed-call booking agent ($1,500 setup + $1,000/mo)">Ask about the agent</a></div>
      </div>
      ${c.intakeCard}
      <p class="mx-auto mt-8 max-w-4xl rounded-2xl border border-slate-800 bg-slate-900/50 p-5 text-sm leading-relaxed text-slate-300">For a one-time website, you pay <strong class="text-white">after</strong> you approve your draft, and your only running cost is the domain, <strong class="text-white">about $10 to $12 a year</strong>. Monthly plans are month to month, and I confirm the price in writing before anything starts. On Website + text-back, the $497 setup is due only once you approve your draft.</p>
    </div>
  </section>

  <!-- NO RISK -->
  <section id="no-risk" class="border-t border-slate-900 bg-slate-900/40 px-4 py-16 sm:px-6 sm:py-20 lg:px-8" aria-labelledby="risk-title">
    <div class="mx-auto max-w-6xl">
      <div class="mx-auto max-w-3xl text-center">
        <p class="kicker">No risk, no lock-in</p>
        <h2 id="risk-title" class="h2">You keep control of everything.</h2>
        <p class="mt-4 text-lg text-slate-400">Plenty of owners have been burned by a web company that held their site hostage. Here's how I make sure that never happens to you.</p>
      </div>
      <ul class="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <li class="rounded-2xl border border-slate-800 bg-slate-950 p-5"><svg class="icon w-6 h-6 text-blue-400" aria-hidden="true"><use href="#i-eye"/></svg><h3 class="mt-3 font-display font-extrabold">Free draft first</h3><p class="mt-1 text-sm text-slate-400">See your actual site before paying anything. No deposit.</p></li>
        <li class="rounded-2xl border border-slate-800 bg-slate-950 p-5"><svg class="icon w-6 h-6 text-blue-400" aria-hidden="true"><use href="#i-key"/></svg><h3 class="mt-3 font-display font-extrabold">Your domain, your name</h3><p class="mt-1 text-sm text-slate-400">Registered to you, at cost, not to me.</p></li>
        <li class="rounded-2xl border border-slate-800 bg-slate-950 p-5"><svg class="icon w-6 h-6 text-blue-400" aria-hidden="true"><use href="#i-cloud"/></svg><h3 class="mt-3 font-display font-extrabold">Free hosting</h3><p class="mt-1 text-sm text-slate-400">Fast, secure hosting with no hosting bill.</p></li>
        <li class="rounded-2xl border border-slate-800 bg-slate-950 p-5"><svg class="icon w-6 h-6 text-blue-400" aria-hidden="true"><use href="#i-file"/></svg><h3 class="mt-3 font-display font-extrabold">Every file is yours</h3><p class="mt-1 text-sm text-slate-400">You get a full copy of the site to keep.</p></li>
        <li class="rounded-2xl border border-slate-800 bg-slate-950 p-5"><svg class="icon w-6 h-6 text-blue-400" aria-hidden="true"><use href="#i-unlock"/></svg><h3 class="mt-3 font-display font-extrabold">No long-term contracts</h3><p class="mt-1 text-sm text-slate-400">Websites are paid once. Monthly plans are month to month.</p></li>
      </ul>
    </div>
  </section>

  <!-- ABOUT + PROOF (no invented reviews; the dashed cards show only with ?preview) -->
  <section id="about" class="border-t border-slate-900 px-4 py-16 sm:px-6 sm:py-20 lg:px-8" aria-labelledby="about-title">
    <div class="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
      <div>
        <p class="kicker">About</p>
        <h2 id="about-title" class="h2">Hi, I'm Austin.</h2>
        <p class="mt-4 text-lg leading-relaxed text-slate-300">I was born in Memphis and have lived in Bartlett for over 15 years. I build websites for the kinds of local businesses I grew up around: contractors, shops, groomers, clinics and salons.</p>
        <p class="mt-4 text-lg leading-relaxed text-slate-300">I built my first fully working website at age 10, in fifth grade. Now, at 23, I build custom sites for local businesses, designed to load fast and do exactly what your customers need.</p>
        <p class="mt-4 text-lg leading-relaxed text-slate-300">When you call or text, you get me. There's no sales team and no call center, and I reply within 1–3 business days.</p>
        <div class="mt-7 flex flex-col gap-3 sm:flex-row"><a class="btn btn-primary" href="#contact">Get my free draft<svg class="icon w-5 h-5" aria-hidden="true"><use href="#i-arrow"/></svg></a><a class="btn btn-dark" href="tel:+19013210023"><svg class="icon w-5 h-5" aria-hidden="true"><use href="#i-phone"/></svg>Call or text me</a></div>
      </div>
      <div class="space-y-5">
        <div class="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h3 class="font-display text-lg font-extrabold">Check it yourself</h3>
          <ul class="mt-4 space-y-3 text-sm text-slate-300">
            <li class="flex gap-2"><svg class="icon w-4 h-4 shrink-0 mt-1 text-blue-400" aria-hidden="true"><use href="#i-check"/></svg><span><b class="text-white">Try a live demo.</b> Open <a class="link" href="/demos/summit-roofing/">Summit Roofing</a> or <a class="link" href="/demos/cedar-and-hickory-bbq/">Cedar &amp; Hickory BBQ</a> on your phone and see how fast it loads.</span></li>
            <li class="flex gap-2"><svg class="icon w-4 h-4 shrink-0 mt-1 text-blue-400" aria-hidden="true"><use href="#i-check"/></svg><span><b class="text-white">Custom-built, not a template.</b> Every site is designed around your business, your services and your customers.</span></li>
            <li class="flex gap-2"><svg class="icon w-4 h-4 shrink-0 mt-1 text-blue-400" aria-hidden="true"><use href="#i-check"/></svg><span><b class="text-white">Local.</b> Based in Bartlett, so we can meet in person if you'd like.</span></li>
            <li class="flex gap-2"><svg class="icon w-4 h-4 shrink-0 mt-1 text-blue-400" aria-hidden="true"><use href="#i-check"/></svg><span><b class="text-white">Everything stays in your name.</b> Your domain, your files, your accounts.</span></li>
          </ul>
        </div>
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div class="rounded-2xl border border-slate-800 bg-slate-900 p-6"><h3 class="font-display font-extrabold">A good fit if&hellip;</h3><ul class="mt-3 space-y-2 text-sm text-slate-300"><li class="flex gap-2"><svg class="icon w-4 h-4 shrink-0 mt-1 text-blue-400" aria-hidden="true"><use href="#i-check"/></svg><span>You run a local service business or trade</span></li><li class="flex gap-2"><svg class="icon w-4 h-4 shrink-0 mt-1 text-blue-400" aria-hidden="true"><use href="#i-check"/></svg><span>You want more calls, quotes or bookings</span></li><li class="flex gap-2"><svg class="icon w-4 h-4 shrink-0 mt-1 text-blue-400" aria-hidden="true"><use href="#i-check"/></svg><span>You'd rather text a person than learn a website builder</span></li></ul></div>
          <div class="rounded-2xl border border-slate-800 bg-slate-900 p-6"><h3 class="font-display font-extrabold">Probably not if&hellip;</h3><ul class="mt-3 space-y-2 text-sm text-slate-300"><li class="flex gap-2"><svg class="icon w-4 h-4 shrink-0 mt-1 text-slate-400" aria-hidden="true"><use href="#i-x"/></svg><span>You need a big online store</span></li><li class="flex gap-2"><svg class="icon w-4 h-4 shrink-0 mt-1 text-slate-400" aria-hidden="true"><use href="#i-x"/></svg><span>You need custom software or a customer portal</span></li><li class="flex gap-2"><svg class="icon w-4 h-4 shrink-0 mt-1 text-slate-400" aria-hidden="true"><use href="#i-x"/></svg><span>You want someone to run your ads and social media</span></li></ul></div>
        </div>
      </div>
    </div>
${c.testimonials}
  </section>

  <!-- FAQ -->
  <section id="faq" class="border-t border-slate-900 bg-slate-900/40 px-4 py-16 sm:px-6 sm:py-20 lg:px-8" aria-labelledby="faq-title">
    <div class="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[1fr_2fr]">
      <div>
        <p class="kicker">FAQ</p>
        <h2 id="faq-title" class="h2">Questions owners ask me.</h2>
        <p class="mt-4 text-slate-400">Don't see yours? <a class="link" href="tel:+19013210023">Call or text</a> or <a class="link" href="#contact">send a message</a>.</p>
      </div>
      <div class="space-y-3">
${c.faqItems}
      </div>
    </div>
  </section>

  <!-- CONTACT -->
  <section id="contact" class="border-t border-slate-900 px-4 py-16 sm:px-6 sm:py-20 lg:px-8" aria-labelledby="contact-title">
    <div class="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[1fr_1.15fr]">
      <div>
        <p class="kicker">Zero risk</p>
        <h2 id="contact-title" class="h2">Get your free working draft.</h2>
        <p class="mt-4 text-lg text-slate-400">Tell me a little about your business and I'll build a free, clickable draft. No payment, no card and no obligation.</p>
        <h3 class="mt-8 font-display font-extrabold">What happens next</h3>
        <ol class="mt-4 space-y-4 text-sm text-slate-300">
          <li class="flex gap-3"><span class="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-600 font-display text-xs font-extrabold">1</span><span><b class="block text-white">I reply within 1–3 business days</b>By text or email, with a couple of quick questions.</span></li>
          <li class="flex gap-3"><span class="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-600 font-display text-xs font-extrabold">2</span><span><b class="block text-white">You get a link to your draft in 2&ndash;3 days</b>A real, working site you can open on your phone and share.</span></li>
          <li class="flex gap-3"><span class="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-600 font-display text-xs font-extrabold">3</span><span><b class="block text-white">You decide</b>Love it, and we agree on a price before you pay. If not, you owe nothing.</span></li>
        </ol>
        <a class="mt-8 flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-blue-600" href="tel:+19013210023"><span class="grid h-12 w-12 place-items-center rounded-xl bg-blue-600"><svg class="icon w-6 h-6" aria-hidden="true"><use href="#i-phone"/></svg></span><span><small class="block text-sm text-slate-400">Rather talk? Call or text Austin</small><b class="font-display text-2xl font-extrabold">(901) 321-0023</b></span></a>
        <p class="mt-4 flex items-center gap-2 text-sm text-slate-400"><svg class="icon w-4 h-4 text-blue-400" aria-hidden="true"><use href="#i-mail"/></svg><a class="link" href="mailto:bartlett.website.design@gmail.com">bartlett.website.design@gmail.com</a></p>
      </div>
      <form id="contact-form" class="grid grid-cols-1 gap-4 rounded-3xl border border-blue-900/50 bg-slate-900 p-6 shadow-2xl sm:grid-cols-2 sm:p-8" action="https://api.web3forms.com/submit" method="POST">
        <h3 class="font-display text-xl font-extrabold sm:col-span-2">Request my free draft</h3>
        <p class="-mt-2 text-sm text-slate-400 sm:col-span-2">Takes about a minute. Only your name, business and a way to reach you are required.</p>
        <input type="hidden" name="access_key" value="20844a35-5000-46b3-997a-be5114bb4edf">
        <input type="hidden" name="from_name" value="bartlettwebsitedesign.online">
        <input type="checkbox" name="botcheck" class="hidden" tabindex="-1" autocomplete="off" aria-hidden="true">
        <label class="field">Your name<input name="name" autocomplete="name" required placeholder="e.g. Mike Taylor"></label>
        <label class="field">Business name<input name="business" autocomplete="organization" required placeholder="e.g. Taylor Roofing"></label>
        <label class="field sm:col-span-2">Phone or email<input name="reach" required placeholder="Best number to text, or your email"></label>
        <label class="field">Where are you online now?
          <select name="current"><option>Nowhere yet</option><option>Facebook or Instagram only</option><option>A booking page or Linktree</option><option>An old website</option></select>
        </label>
        <label class="field">What are you interested in?
          <select name="plan" id="plan">${c.planOptions}</select>
        </label>
        <label class="field sm:col-span-2"><span>Anything else? <span class="font-normal text-slate-400">(optional)</span></span><textarea name="message" rows="4" placeholder="Your trade, your website or Facebook page if you have one, and what customers should be able to do"></textarea></label>
        <button class="btn btn-primary btn-lg sm:col-span-2" type="submit">Get my free draft</button>
        <p class="flex items-center gap-2 text-xs text-slate-400 sm:col-span-2"><svg class="icon w-4 h-4" aria-hidden="true"><use href="#i-lock"/></svg>I only use your details to reply about your website. No mailing lists, never shared.</p>
        <p class="text-sm text-slate-400 sm:col-span-2" id="form-status" role="status" aria-live="polite">No payment or card needed. Prefer to talk? Call or text <a class="link" href="tel:+19013210023">(901) 321-0023</a>.</p>
      </form>
    </div>
  </section>
</main>

${c.bottom}

${c.scripts}
</body>
</html>
`;

