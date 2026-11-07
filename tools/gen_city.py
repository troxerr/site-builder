"""Builds the city landing pages, /thanks/, /thanks/booking-agent/ and 404.html in the homepage's design.
The header, footer, icon sprite and mobile bar are copied from index.html, and the CSS is Tailwind 3 compiled
from these pages with the homepage's config (tools/home/), then inlined.
Run from the repo root after changing the homepage header or footer, or the data below: python3 -I tools/gen_city.py
(needs Node; it fetches tailwindcss@3.4.17 with npx)"""
import json, os, re, subprocess, tempfile

SITE = "https://bartlettwebsitedesign.online"
home = open("index.html", encoding="utf8").read()

def grab(pattern):
    return re.search(pattern, home).group(0)

sprite = grab(r'<svg width="0" height="0" style="position:absolute" aria-hidden="true">[\s\S]*?</svg>')
header = grab(r'<header id="header"[\s\S]*?</header>')
footer = grab(r'<footer class="border-t[\s\S]*?</footer>')
mbar = grab(r'<nav class="mobile-bar[\s\S]*?</nav>')
beacon = grab(r'<!-- Cloudflare Web Analytics[\s\S]*?</script>')

def absolutize(html):
    # Homepage-relative links become root-relative so they work from /bartlett/ and from any 404 path
    html = re.sub(r'href="#(?!i-)', 'href="/#', html)
    html = html.replace('href="/#top"', 'href="/"')
    return re.sub(r'href="(demos|dental|bartlett|memphis|germantown|cordova|arlington|lakeland)/"', r'href="/\1/"', html)

header, footer, mbar = absolutize(header), absolutize(footer), absolutize(mbar)

SCRIPT = """<script>
(function () {
  var nav = document.getElementById("nav"), toggle = document.getElementById("menu-toggle");
  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  nav.addEventListener("click", function (e) { if (e.target.tagName === "A") { nav.classList.remove("open"); toggle.setAttribute("aria-expanded", false); toggle.setAttribute("aria-label", "Open menu"); } });
  document.getElementById("year").textContent = new Date().getFullYear();
})();
</script>"""

def ic(name, cls="w-5 h-5"):
    return f'<svg class="icon {cls}" aria-hidden="true"><use href="#i-{name}"/></svg>'

CHECK = ic("check", "w-4 h-4 shrink-0 mt-1 text-blue-400")
HL = '<span class="bg-gradient-to-r from-blue-400 via-sky-300 to-white bg-clip-text text-transparent">'
TEL, PHONE = "tel:+19013210023", "(901) 321-0023"

def head(title, desc, canonical, robots=None, ld=()):
    lds = "".join(f'<script type="application/ld+json">{json.dumps(x, ensure_ascii=False, separators=(",", ":"))}</script>\n' for x in ld)
    return f"""<!doctype html>
<html lang="en" class="motion-safe:scroll-smooth">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{title}</title>
<meta name="description" content="{desc}">
{f'<meta name="robots" content="{robots}">' + chr(10) if robots else ''}<meta name="theme-color" content="#143fc5">
{f'<link rel="canonical" href="{canonical}">' + chr(10) if canonical else ''}<meta property="og:type" content="website">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="{SITE}/assets/og-image.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/assets/logo-mark.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/logo-mark-512.png">
<link rel="preload" href="/assets/fonts/sora-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin>
{lds}<style>
/*CSS*/
</style>
</head>
<body class="bg-slate-950 font-sans text-white antialiased selection:bg-blue-600 selection:text-white">
{sprite}
<a class="skip" href="#main">Skip to content</a>
{header}
"""

def tail(bar=True):
    return f"""{footer}

{mbar if bar else ""}

{SCRIPT}
{beacon}
</body>
</html>
"""

# Demo cards (same data as the demos page; thumbnails use the 560px -sm files)
DEMOS = {
    "summer": ("summer-avenue-animal-hospital", "Summer Avenue Animal Hospital", "Veterinary clinic · Memphis", "Turns &ldquo;vet near me&rdquo; searches into phone calls with live hours and one-tap directions.", "Live demo"),
    "jim": ("jim-fields-plumbing", "Jim Fields Plumbing Heating &amp; A/C", "Plumbing &amp; HVAC · Bartlett", "Gets the phone ringing for leaks, clogs and dead A/C, with the number up top on every page.", "Live demo"),
    "lynn": ("lynns-dog-house", "Lynn&rsquo;s Dog House", "Dog grooming · Bartlett", "Puts &ldquo;Call to book&rdquo; and open days right up top, where phone-first customers look.", "Live demo"),
    "groomden": ("the-groom-den", "The Groom Den", "Mobile grooming · Bartlett, Lakeland &amp; Arlington", "Explains driveway grooming and shows the service area, so the calls that come in are already a fit.", "Live demo"),
    "effective": ("effective-automotive", "Effective Automotive Repair", "Auto repair · Memphis", "Turns &ldquo;what&rsquo;s that noise?&rdquo; into a booked appointment, with a symptom finder and price ranges.", "Live demo"),
    "reedy": ("reedy-company", "Reedy &amp; Company", "Property management · Memphis", "Sends owners to a rent analysis and renters to rent pay, so the office phone isn&rsquo;t the help desk.", "Live demo"),
    "bigm": ("big-m-roofing", "Big M Roofing", "Roofing · Memphis", "Books free roof inspections fast after a storm, with the phone and quote form up front.", "Live demo"),
    "morris": ("morris-general-construction", "Morris General Construction", "General contractor · Memphis", "Spells out the process and itemized quotes, so homeowners request an estimate with confidence.", "Live demo"),
    "cedar": ("cedar-and-hickory-bbq", "Cedar &amp; Hickory BBQ", "Restaurant · Sample business", "Answers &ldquo;what&rsquo;s on the menu?&rdquo; before anyone calls, and brings in catering leads.", "Sample"),
    "dorsey": ("dorsey-contracting", "Dorsey Contracting", "Remodeling · Germantown", "Answers &ldquo;what will it cost and how long?&rdquo; up front, then takes estimate requests with photos.", "Live demo"),
    "linen": ("linen-and-lark-salon", "Linen &amp; Lark Salon", "Hair salon · Sample business", "Shows every price and stylist up front, then books appointments without phone tag.", "Sample"),
    "prestige": ("prestige-baths", "Prestige Baths", "Bath &amp; kitchen remodeling · Cordova", "Lets homeowners text a photo or request an itemized estimate instead of calling around.", "Live demo"),
    "paws": ("paws-n-motion", "Paws &rsquo;n Motion", "Mobile dog grooming · Bartlett &amp; Cordova", "A ZIP code checker shows the travel fee up front, so nobody has to call to ask.", "Live demo"),
}

AREAS = [("bartlett", "Bartlett"), ("memphis", "Memphis"), ("germantown", "Germantown"), ("cordova", "Cordova"), ("arlington", "Arlington"), ("lakeland", "Lakeland")]

CITIES = {
    "bartlett": dict(
        name="Bartlett",
        title="Website Design in Bartlett, TN | Bartlett Website Design",
        desc="Website design for Bartlett, TN small businesses, from $350. A local designer you can call or text, and a free working draft before you pay.",
        h1="Website design for <span class=\"hl\">Bartlett</span> small businesses.",
        lede="I'm Austin, and Bartlett is home. I've lived here for over 15 years, and I build fast, mobile-friendly websites that help Bartlett shops, salons, groomers and contractors get found on Google and get the call.",
        points=[("Local and easy to meet", "I'm in Bartlett, so a coffee or a visit to your shop is easy to set up."), ("Free draft first", "You see a working draft of your site before you pay anything."), ("Yours to keep", "Your domain and every file stay in your name. No long-term contract.")],
        demos_title="Demos for Bartlett businesses",
        demos=["jim", "lynn", "groomden"],
        faqs=[("Can we meet in person?", "Yes. I'm based in Bartlett, so meeting at your shop or over coffee is easy. Plenty of owners prefer to just call or text, and that works too."),
              ("Do you only work with Bartlett businesses?", "No. I also work with businesses in Memphis, Cordova, Germantown, Arlington and Lakeland. Bartlett is just home base."),
              ("How fast will I hear back?", "Within one business day. Call or text (901) 321-0023 and you reach me directly, not a call center."),
              ("What does a website cost?", "A one-page Starter site is $350 and the Business site is $950, both one-time. Hosting is free, and the domain is about $10 to $12 a year.")],
    ),
    "memphis": dict(
        name="Memphis",
        title="Website Design in Memphis, TN for Small Businesses | Bartlett Website Design",
        desc="Fast, mobile-friendly websites for Memphis small businesses, from $350. Call or text a local designer, and see a free working draft before you pay.",
        h1="Website design for <span class=\"hl\">Memphis</span> small businesses.",
        lede="From Midtown shops to East Memphis clinics, customers check their phones before they call. I build fast websites that turn those searches into calls and bookings, from a one-person studio in Bartlett.",
        points=[("Built for phone searches", "Tap to call, live hours and directions, on pages that load fast on a weak signal."), ("Free draft first", "You see a working draft of your site before you pay anything."), ("One person, start to finish", "The person you text is the person who builds and updates your site.")],
        demos_title="Demos for Memphis businesses",
        demos=["summer", "effective", "reedy", "bigm", "morris", "cedar"],
        faqs=[("Do you work with businesses all over Memphis?", "Yes. Midtown, East Memphis, Downtown, Whitehaven, Raleigh, Frayser and everywhere in between. Most of the work happens by phone, text and email."),
              ("Can you meet in person?", "Yes. I'm in Bartlett, about 20 minutes from most of Memphis, and happy to stop by your business."),
              ("I already have a website. Can you replace it?", "Yes. I keep what's working, like your content, photos and web address, and build the free draft as a replacement. Your address doesn't change."),
              ("How long does it take?", "Your free draft is usually ready in 2 to 3 days, and most sites go live in about a week.")],
    ),
    "germantown": dict(
        name="Germantown",
        title="Website Design in Germantown, TN | Bartlett Website Design",
        desc="Polished, fast websites for Germantown small businesses, from $350. A local designer you can call or text, with a free working draft before you pay.",
        h1="Website design for <span class=\"hl\">Germantown</span> small businesses.",
        lede="Germantown customers expect a polished first impression. I build clean, fast websites for Germantown clinics, salons, contractors and shops, and you see a working draft before you spend a dime.",
        points=[("A polished first impression", "A custom design that matches the quality of your work, not a template."), ("Free draft first", "You see a working draft of your site before you pay anything."), ("Easy to keep current", "Text me new prices, hours or photos and your site stays up to date.")],
        demos_title="Demos for Germantown-area businesses",
        demos=["dorsey", "linen", "summer"],
        faqs=[("Do you work with Germantown businesses?", "Yes. I'm based in nearby Bartlett and work with businesses across Germantown and the rest of Shelby County."),
              ("Can I take bookings online?", "Yes. If you already use Square, Vagaro, MoeGo or a similar tool, your Book online buttons go straight to it. If not, I can add a simple request form."),
              ("Will my site work well on phones?", "Every site is built phone-first, with big tap-to-call and booking buttons that stay within reach."),
              ("Are there monthly fees?", "No. You pay once for your site. The $45/month care plan is optional, and you can cancel any time.")],
    ),
    "cordova": dict(
        name="Cordova",
        title="Website Design in Cordova, TN | Bartlett Website Design",
        desc="Websites that bring in calls and bookings for Cordova small businesses, from $350. Call or text a local designer, and see a free draft before you pay.",
        h1="Website design for <span class=\"hl\">Cordova</span> small businesses.",
        lede="Cordova businesses compete with all of east Memphis for the same searches. I build fast, mobile-friendly websites that make it easy to pick you: clear prices, live hours, and one tap to call or book.",
        points=[("Stand out in local search", "A real website, set up for local search, plus help with your Google Business Profile."), ("Free draft first", "You see a working draft of your site before you pay anything."), ("Yours to keep", "Your domain and every file stay in your name. No long-term contract.")],
        demos_title="Demos for Cordova businesses",
        demos=["prestige", "linen", "paws"],
        faqs=[("Do you work with Cordova businesses?", "Yes. I'm based in Bartlett, just up the road, and work with businesses all over Cordova and east Memphis."),
              ("Can you set up my Google Business Profile?", "Yes. It's included in the Business plan, and it's one of the biggest things that helps local customers find you."),
              ("What do you need from me to start?", "Your business name, services, hours and any photos or logo you have. A Facebook page or Google listing is often enough to start."),
              ("What happens if I need changes later?", "Text me. On the care plan, updates like hours, prices and photos are included. Without it, I tell you the price before I do any work.")],
    ),
    "arlington": dict(
        name="Arlington",
        title="Website Design in Arlington, TN | Bartlett Website Design",
        desc="Website design for Arlington, TN small businesses, from $350. A designer just down the road in Bartlett, and a free working draft before you pay.",
        h1="Website design for <span class=\"hl\">Arlington</span> small businesses.",
        lede="Arlington is growing fast, and new neighbors look up local businesses on their phones before they call. I build fast, mobile-friendly websites for Arlington shops, groomers, contractors and service businesses, from a studio just down the road in Bartlett.",
        points=[("Just down the road", "I'm in Bartlett, so meeting at your business is easy."), ("Free draft first", "You see a working draft of your site before you pay anything."), ("Yours to keep", "Your domain and every file stay in your name. No long-term contract.")],
        demos_title="Demos for Arlington-area businesses",
        demos=["groomden", "jim", "lynn"],
        faqs=[("Do you work with Arlington businesses?", "Yes. Arlington is right next to Bartlett, where I'm based, and I'm glad to work with businesses all over town."),
              ("Can we meet in person?", "Yes. I'm about 15 minutes away and happy to stop by. Calling or texting works just as well."),
              ("My customers mostly find me on Facebook. Do I still need a website?", "A website shows up in Google searches where Facebook pages often don't, and it answers hours, prices and directions in one place. Your Facebook page can link right to it."),
              ("What does a website cost?", "A one-page Starter site is $350 and the Business site is $950, both one-time. Hosting is free, and the domain is about $10 to $12 a year.")],
    ),
    "lakeland": dict(
        name="Lakeland",
        title="Website Design in Lakeland, TN | Bartlett Website Design",
        desc="Fast, mobile-friendly websites for Lakeland, TN small businesses, from $350. A local designer you can call or text, with a free working draft before you pay.",
        h1="Website design for <span class=\"hl\">Lakeland</span> small businesses.",
        lede="Lakeland customers search for services from home, often on their phones. I build fast websites that show up for those searches and make it easy to call, book or request a quote, from a one-person studio in nearby Bartlett.",
        points=[("Built for &ldquo;near me&rdquo; searches", "Set up for local search, with your service area spelled out clearly."), ("Free draft first", "You see a working draft of your site before you pay anything."), ("One person, start to finish", "The person you text is the person who builds and updates your site.")],
        demos_title="Demos for Lakeland-area businesses",
        demos=["groomden", "paws", "jim"],
        faqs=[("Do you work with Lakeland businesses?", "Yes. I'm based in nearby Bartlett and work with businesses across Lakeland, Arlington and the rest of the area."),
              ("I serve customers at their homes. Can my site show where I go?", "Yes. Service-area businesses get a clear list or map of where they travel, and even a ZIP code checker like the one in the Paws &rsquo;n Motion demo."),
              ("How long does it take?", "Your free draft is usually ready in 2 to 3 days, and most sites go live in about a week."),
              ("How fast will I hear back?", "Within one business day. Call or text (901) 321-0023 and you reach me directly.")],
    ),
}


def card(key):
    slug, name, typ, what, chip = DEMOS[key]
    return f"""        <li><a class="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 transition hover:-translate-y-0.5 hover:border-blue-500/60" href="/demos/{slug}/">
          <div class="truncate border-b border-slate-800 bg-slate-950 px-3 py-2 font-mono text-[11px] text-slate-400" aria-hidden="true">bartlettwebsitedesign.online/demos/{slug}/</div>
          <img class="aspect-[8/5] w-full object-cover object-top" src="/assets/work/demo-{slug}-sm.webp" srcset="/assets/work/demo-{slug}-sm.webp 560w, /assets/work/demo-{slug}.webp 1120w" sizes="(max-width: 640px) calc(100vw - 32px), (max-width: 1024px) 50vw, 380px" alt="{name} demo homepage" loading="lazy" width="1120" height="700">
          <div class="flex flex-1 flex-col p-5">
            <h3 class="font-display text-lg font-extrabold text-white">{name}</h3><p class="text-sm text-slate-400">{typ}</p>
            <p class="mt-3 text-[15px] text-slate-300">{what}</p>
            <div class="mt-auto flex items-center justify-between pt-5"><span class="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-400 group-hover:text-blue-300">Try the live demo{ic("arrow", "w-4 h-4")}</span><span class="rounded-full border border-slate-700 px-2.5 py-0.5 text-[11px] font-semibold text-slate-300">{chip}</span></div>
          </div></a></li>
"""

def promise():
    return f"""<div class="mt-8 flex max-w-2xl items-start gap-4 rounded-2xl border border-blue-500/30 bg-blue-500/10 p-5">
        <span class="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blue-600 font-display text-lg font-extrabold" aria-hidden="true">$0</span>
        <div><p class="font-display font-extrabold text-white">See a free working draft of your site before you pay.</p><p class="mt-1 text-sm text-slate-300">Send me a few details and I'll build a real, clickable draft with your name, services and hours in 2&ndash;3 days. Love it, then we talk price. Don't, and you owe nothing.</p></div>
      </div>"""

def city_page(slug, c):
    url = f"{SITE}/{slug}/"
    ld = [
        {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": f"{SITE}/"},
            {"@type": "ListItem", "position": 2, "name": f"Website design in {c['name']}", "item": url}]},
        {"@context": "https://schema.org", "@type": "ProfessionalService", "name": "Bartlett Website Design", "url": f"{SITE}/",
         "telephone": "+1-901-321-0023", "email": "bartlett.website.design@gmail.com", "priceRange": "$297–$1,500",
         "address": {"@type": "PostalAddress", "addressLocality": "Bartlett", "addressRegion": "TN", "addressCountry": "US"},
         "areaServed": {"@type": "City", "name": f"{c['name']}, TN"}},
        {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
            {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in c["faqs"]]},
    ]
    h1 = c["h1"].replace('<span class="hl">', HL)
    points = "".join(f'<li class="rounded-2xl border border-slate-800 bg-slate-900/80 p-5"><p class="flex gap-2 font-display font-extrabold text-white">{CHECK}<span>{t}</span></p><p class="mt-1 pl-6 text-sm text-slate-400">{d}</p></li>' for t, d in c["points"])
    demos = "".join(card(k) for k in c["demos"])
    faqs = "\n".join(f'        <details class="group rounded-2xl border border-slate-800 bg-slate-900/80 open:border-blue-900/70"{" open" if i == 0 else ""}><summary class="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-display text-[17px] font-extrabold text-white">{q}<span class="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-slate-700 text-blue-400 transition group-open:rotate-45">{ic("plus", "w-4 h-4")}</span></summary><p class="px-5 pb-5 text-[15px] leading-relaxed text-slate-400">{a}</p></details>' for i, (q, a) in enumerate(c["faqs"]))
    areas = "".join(f'<li><a class="inline-block rounded-full border px-4 py-2 text-sm font-semibold transition {"border-blue-500 bg-blue-600 text-white" if s == slug else "border-slate-700 text-slate-200 hover:border-blue-500 hover:text-white"}" href="/{s}/"{" aria-current=\"page\"" if s == slug else ""}>{n}</a></li>' for s, n in AREAS)
    price = lambda name, amt, unit, what: f'<li class="rounded-2xl border border-slate-800 bg-slate-900/90 p-6"><p class="text-xs font-semibold uppercase tracking-wider text-blue-400">{name}</p><p class="mt-1 font-display text-3xl font-extrabold">{amt}<span class="ml-1 font-sans text-sm font-normal text-slate-400">{unit}</span></p><p class="mt-2 text-sm text-slate-400">{what}</p></li>'
    body = f"""
<main id="main">
  <section class="relative overflow-hidden bg-gradient-to-b from-[#143fc5]/25 via-slate-950 to-slate-950 px-4 pb-14 pt-10 sm:px-6 sm:pt-14 lg:px-8 lg:pb-20" aria-labelledby="hero-title">
    <div class="mx-auto max-w-6xl">
      <p class="text-sm text-slate-400"><a class="link" href="/">Home</a> &rsaquo; Website design in {c['name']}</p>
      <p class="mt-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-300">{ic("pin", "w-3.5 h-3.5")}{c['name']}, TN</p>
      <h1 id="hero-title" class="mt-5 max-w-4xl font-display text-[2.3rem] font-extrabold leading-[1.08] tracking-tight sm:text-6xl">{h1}</h1>
      <p class="mt-6 max-w-3xl text-lg leading-relaxed text-slate-300 sm:text-xl">{c['lede']}</p>
      {promise()}
      <div class="mt-8 flex flex-col gap-3 sm:flex-row">
        <a class="btn btn-primary btn-lg" href="/#contact">Get my free draft{ic("arrow")}</a>
        <a class="btn btn-dark btn-lg" href="{TEL}">{ic("phone")}Call or text {PHONE}</a>
      </div>
      <ul class="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">{points}</ul>
    </div>
  </section>

  <section class="border-t border-slate-900 bg-slate-900/40 px-4 py-16 sm:px-6 sm:py-20 lg:px-8" aria-labelledby="demos-title">
    <div class="mx-auto max-w-6xl">
      <p class="kicker">Live demos</p>
      <h2 id="demos-title" class="h2">{c['demos_title']}</h2>
      <p class="mt-4 max-w-3xl text-lg text-slate-400">Working examples, built the same way I'll build yours. Demos of real businesses aren't their official websites.</p>
      <ul class="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
{demos}      </ul>
      <p class="mt-10 text-center"><a class="btn btn-primary" href="/demos/">See all live demos{ic("arrow")}</a></p>
    </div>
  </section>

  <section class="border-t border-slate-900 px-4 py-16 sm:px-6 sm:py-20 lg:px-8" aria-labelledby="price-title">
    <div class="mx-auto max-w-6xl">
      <p class="kicker">Pricing</p>
      <h2 id="price-title" class="h2">Clear prices. Paid only after you approve your draft.</h2>
      <ul class="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
        {price("Starter", "$350", "one time", "A polished one-page site with services, hours, map and tap to call.")}
        {price("Business", "$950", "one time", "Custom logo, online booking or price list, Google Business Profile setup.")}
        {price("Care plan", "$45", "/ month", "Optional. Text me changes any time. Cancel any time.")}
      </ul>
      <p class="mt-6 rounded-2xl border border-blue-900/50 bg-blue-950/30 p-5 text-sm text-slate-300"><b class="text-white">Contractors and shops:</b> missed-call text-back is $297/month, or get a website with text-back built in for $497/month + $497 setup. Month to month, no long-term contract.</p>
      <p class="mt-6"><a class="link font-semibold" href="/#pricing">See everything included &rarr;</a></p>
    </div>
  </section>

  <section class="border-t border-slate-900 bg-slate-900/40 px-4 py-16 sm:px-6 sm:py-20 lg:px-8" aria-labelledby="faq-title">
    <div class="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[1fr_2fr]">
      <div>
        <p class="kicker">FAQ</p>
        <h2 id="faq-title" class="h2">Questions from {c['name']} owners.</h2>
        <p class="mt-4 text-slate-400">Don't see yours? <a class="link" href="{TEL}">Call or text</a> or <a class="link" href="/#contact">send a message</a>.</p>
      </div>
      <div class="space-y-3">
{faqs}
      </div>
    </div>
  </section>

  <section class="border-t border-slate-900 px-4 py-16 sm:px-6 sm:py-20 lg:px-8" aria-labelledby="cta-title">
    <div class="mx-auto max-w-6xl">
      <div class="flex flex-col gap-6 rounded-3xl border border-blue-900/50 bg-gradient-to-r from-blue-950/50 via-slate-900 to-slate-900 p-7 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
        <div><h2 id="cta-title" class="font-display text-2xl font-extrabold sm:text-3xl">Let's see what your site could look like.</h2><p class="mt-2 text-slate-300">Free working draft in 2&ndash;3 days. No payment, no card and no obligation.</p></div>
        <div class="flex shrink-0 flex-col gap-3 sm:flex-row"><a class="btn btn-primary" href="/#contact">Get my free draft</a><a class="btn btn-dark" href="{TEL}">{PHONE}</a></div>
      </div>
      <h2 class="kicker mt-12">Other areas I serve</h2>
      <ul class="mt-4 flex flex-wrap gap-2">{areas}<li><a class="inline-block rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-blue-500 hover:text-white" href="/">All of the Memphis area</a></li></ul>
    </div>
  </section>
</main>

"""
    return head(c["title"], c["desc"], url, ld=ld) + body + tail()

def simple(pill, h1, lede, steps, buttons, after=""):
    items = "".join(f'<li class="flex gap-3"><span class="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-600 font-display text-xs font-extrabold">{n}</span><span><b class="block text-white">{t}</b>{d}</span></li>' for n, (t, d) in enumerate(steps, 1))
    lst = f'<ol class="mx-auto mt-8 max-w-md space-y-4 text-left text-sm text-slate-300">{items}</ol>' if steps else ""
    pill_html = f'<p class="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-300">{pill}</p>' if pill else ""
    return f"""
<main id="main">
  <section class="relative overflow-hidden bg-gradient-to-b from-[#143fc5]/25 via-slate-950 to-slate-950 px-4 py-20 sm:px-6 sm:py-28 lg:px-8" aria-labelledby="pg-title">
    <div class="mx-auto max-w-2xl text-center">
      {pill_html}
      <h1 id="pg-title" class="font-display text-4xl font-extrabold tracking-tight sm:text-6xl">{h1}</h1>
      <p class="mt-5 text-lg text-slate-300">{lede}</p>
      {lst}
      <div class="mt-10 flex flex-col justify-center gap-3 sm:flex-row">{buttons}</div>
      {after}
    </div>
  </section>
</main>

"""

pages = {}
for slug, c in CITIES.items():
    pages[f"{slug}/index.html"] = city_page(slug, c)

pages["404.html"] = head("Page not found | Bartlett Website Design", "That page doesn't exist. See live website demos or get a free draft of your site.", None, robots="noindex") + simple(
    "", f'<span class="block font-display text-7xl text-blue-400 sm:text-8xl" aria-hidden="true">404</span>That page isn\'t here.',
    "The link may be old or mistyped. Here's where most people are headed:", [],
    f'<a class="btn btn-primary" href="/#contact">Get my free draft{ic("arrow")}</a><a class="btn btn-dark" href="/demos/">See live demos</a><a class="btn btn-dark" href="/">Home</a>',
    after=f'<p class="mt-6 text-sm text-slate-400">Or call or text <a class="link" href="{TEL}">{PHONE}</a>.</p>'
) + tail()

# They just asked for a draft, so the thanks pages have no "Get my free draft" bar
pages["thanks/index.html"] = head("Thanks | Bartlett Website Design", "Your free draft request was sent.", None, robots="noindex") + simple(
    "Sent &middot; your request", "Got it, thanks!", "Here's what happens next:",
    [("I reply within one business day", "By text or email, with a couple of quick questions about your business."),
     ("You get a link to your draft in 2&ndash;3 days", "A real, working site you can open on your phone and share."),
     ("You decide", "Love it, and we agree on a price before you pay. If not, you owe nothing.")],
    f'<a class="btn btn-primary" href="{TEL}">{ic("phone")}Call or text {PHONE}</a><a class="btn btn-dark" href="/demos/">Browse live demos</a>') + tail(bar=False)
# Booking-agent leads (dental page, or the homepage with that plan) land here, so they count separately from website leads
pages["thanks/booking-agent/index.html"] = head("Thanks | Bartlett Website Design", "Your booking agent request was sent.", None, robots="noindex") + simple(
    "Sent &middot; your booking agent request", "Got it, thanks!", "Here's what happens next:",
    [("I reply within one business day", "By text or email, to set up a short call."),
     ("We check your phones and calendar", "I confirm your scheduling software can connect before you pay anything."),
     ("You decide", "The price is in writing before setup starts. No long-term contract.")],
    f'<a class="btn btn-primary" href="{TEL}">{ic("phone")}Call or text {PHONE}</a><a class="btn btn-dark" href="/demos/missed-call-booking-agent/">Watch the demo again</a>') + tail(bar=False)

# Compile one Tailwind build from all of these pages and inline it into each
here = os.path.join(os.path.dirname(os.path.abspath(__file__)), "home")
with tempfile.TemporaryDirectory() as d:
    for i, html in enumerate(pages.values()):
        open(os.path.join(d, f"p{i}.html"), "w", encoding="utf8").write(html)
    out = os.path.join(d, "out.css")
    subprocess.run(["npx", "--yes", "tailwindcss@3.4.17", "-c", os.path.join(here, "tailwind.config.js"), "-i", os.path.join(here, "in.css"),
                    "-o", out, "--minify"], check=True, capture_output=True, env={**os.environ, "HOME_HTML": os.path.join(d, "p*.html")})
    css = open(out, encoding="utf8").read().strip()
for path, html in pages.items():
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
    open(path, "w", encoding="utf8").write(html.replace("/*CSS*/", css, 1))
print("built", list(CITIES), "+ 404.html + thanks/ + thanks/booking-agent/ with", len(css), "bytes of CSS")
