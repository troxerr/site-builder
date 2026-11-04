"""Builds the city landing pages, /thanks/ and 404.html from the homepage's header, footer and mobile bar.
Run from the repo root after changing the homepage header or footer: python3 -I tools/gen_city.py"""
import json, os, re

SITE = "https://bartlettwebsitedesign.online"
home = open("index.html", encoding="utf8").read()

def grab(pattern):
    return re.search(pattern, home).group(0)

sprite = grab(r'<svg width="0" height="0" style="position:absolute" aria-hidden="true">[\s\S]*?</svg>')
header = grab(r'<header class="site-header" id="header">[\s\S]*?</header>')
footer = grab(r'<footer class="site-footer">[\s\S]*?</footer>')
mbar = grab(r'<nav class="mobile-bar"[\s\S]*?</nav>')
beacon = grab(r'<!-- Cloudflare Web Analytics[\s\S]*?</script>')

def absolutize(html):
    # Homepage-relative links become root-relative so they work from /bartlett/ and from any 404 path
    html = re.sub(r'href="#(?!i-)', 'href="/#', html)
    html = html.replace('href="/#top"', 'href="/"')
    html = re.sub(r'href="(demos|dental|bartlett|memphis|germantown|cordova|arlington|lakeland)/"', r'href="/\1/"', html)
    return re.sub(r'\s*<!-- Add once verified:.*?-->', '', html)

header, footer, mbar = absolutize(header), absolutize(footer), absolutize(mbar)
# These pages have no h3 before the footer, so its column titles are h2s (styled like the homepage h4s)
footer = footer.replace("<h4>", "<h2>").replace("</h4>", "</h2>")

SCRIPT = """<script>
(function () {
  var header = document.getElementById("header");
  var onScroll = function () { header.classList.toggle("scrolled", window.scrollY > 8); };
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  var nav = document.getElementById("nav"), toggle = document.getElementById("menu-toggle");
  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  nav.addEventListener("click", function (e) { if (e.target.tagName === "A") { nav.classList.remove("open"); toggle.setAttribute("aria-expanded", false); } });
  document.getElementById("year").textContent = new Date().getFullYear();
})();
</script>"""

def head(title, desc, canonical, robots=None, ld=()):
    lds = "".join(f'<script type="application/ld+json">{json.dumps(x, ensure_ascii=False, separators=(",", ":"))}</script>\n' for x in ld)
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{title}</title>
<meta name="description" content="{desc}">
{f'<meta name="robots" content="{robots}">' + chr(10) if robots else ''}<meta name="theme-color" content="#0a1a3a">
{f'<link rel="canonical" href="{canonical}">' + chr(10) if canonical else ''}<meta property="og:type" content="website">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="{SITE}/assets/og-image.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/assets/logo-mark.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/logo-mark-512.png">
<link rel="preload" href="/assets/fonts/sora-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/site.css">
{lds}</head>
<body>
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

def card(key):
    slug, name, typ, what, chip = DEMOS[key]
    cls = "chip chip-demo" if chip == "Live demo" else "chip chip-concept"
    return f"""        <li><a class="work-card" href="/demos/{slug}/">
          <div class="browser"><div class="browser-bar" aria-hidden="true"><i></i><i></i><i></i><span>bartlettwebsitedesign.online/demos/{slug}/</span></div><img src="/assets/work/demo-{slug}-sm.webp" srcset="/assets/work/demo-{slug}-sm.webp 560w, /assets/work/demo-{slug}.webp 1120w" sizes="(max-width: 640px) calc(100vw - 40px), (max-width: 1060px) 50vw, 370px" alt="{name} demo homepage" loading="lazy" width="1120" height="700"></div>
          <div class="work-meta"><h3>{name}</h3><p>{typ}</p>
            <p class="outcome">{what}</p>
            <div class="work-foot"><span class="visit">Try the live demo<svg class="icon"><use href="#i-arrow"/></svg></span><span class="chips"><span class="{cls}">{chip}</span></span></div></div></a></li>
"""

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

def city_page(slug, c):
    url = f"{SITE}/{slug}/"
    ld = [
        {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": f"{SITE}/"},
            {"@type": "ListItem", "position": 2, "name": f"Website design in {c['name']}", "item": url}]},
        {"@context": "https://schema.org", "@type": "ProfessionalService", "name": "Bartlett Website Design", "url": f"{SITE}/",
         "telephone": "+1-901-321-0023", "email": "bartlett.website.design@gmail.com", "priceRange": "$350–$950",
         "address": {"@type": "PostalAddress", "addressLocality": "Bartlett", "addressRegion": "TN", "addressCountry": "US"},
         "areaServed": {"@type": "City", "name": f"{c['name']}, TN"}},
        {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
            {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in c["faqs"]]},
    ]
    points = "".join(f'<li><b>{t}</b><span>{d}</span></li>' for t, d in c["points"])
    demos = "".join(card(k) for k in c["demos"])
    faqs = "\n".join(f'        <details{" open" if i == 0 else ""}><summary>{q}<svg class="icon"><use href="#i-plus"/></svg></summary><p>{a}</p></details>' for i, (q, a) in enumerate(c["faqs"]))
    areas = "".join(f'<li><a href="/{s}/"{" aria-current=\"page\"" if s == slug else ""}>{n}</a></li>' for s, n in AREAS)
    body = f"""
<main id="main">
  <section class="city-hero" aria-labelledby="hero-title">
    <div class="wrap">
      <p class="crumbs"><a href="/">Home</a> &rsaquo; Website design in {c['name']}</p>
      <p class="pill"><b>Local</b>{c['name']}, TN</p>
      <h1 id="hero-title">{c['h1']}</h1>
      <p class="lede">{c['lede']}</p>
      <div class="promise">
        <span class="promise-badge" aria-hidden="true">$0</span>
        <div>
          <strong>See a free working draft of your site before you pay.</strong>
          <p>Send me a few details and I'll build a real, clickable draft with your name, services and hours in 2&ndash;3 days. Love it, then we talk price. Don't, and you owe nothing.</p>
        </div>
      </div>
      <div class="hero-actions">
        <a class="btn btn-primary" href="/#contact">Get my free draft<svg class="icon"><use href="#i-arrow"/></svg></a>
        <a class="btn btn-ghost" href="tel:+19013210023"><svg class="icon"><use href="#i-phone"/></svg>Call or text (901) 321-0023</a>
      </div>
      <ul class="city-points">{points}</ul>
    </div>
  </section>

  <section class="section section-soft" aria-labelledby="demos-title">
    <div class="wrap">
      <div class="section-head">
        <p class="kicker">Live demos</p>
        <h2 id="demos-title">{c['demos_title']}</h2>
        <p class="section-lede">Working examples, built the same way I'll build yours. Demos of real businesses aren't their official websites.</p>
      </div>
      <ul class="city-demos">
{demos}      </ul>
      <p class="work-more"><a class="btn btn-primary" href="/demos/">See all live demos<svg class="icon"><use href="#i-arrow"/></svg></a></p>
    </div>
  </section>

  <section class="section" aria-labelledby="price-title">
    <div class="wrap">
      <div class="section-head">
        <p class="kicker">Pricing</p>
        <h2 id="price-title">Clear prices. Paid only after you approve your draft.</h2>
      </div>
      <ul class="price-strip">
        <li><span>Starter</span><b>$350</b><span>A polished one-page site with services, hours, map and tap to call.</span></li>
        <li><span>Business</span><b>$950</b><span>Custom logo, online booking or price list, Google Business Profile setup.</span></li>
        <li><span>Care plan (optional)</span><b>$45/mo</b><span>Text me changes any time. Cancel any time.</span></li>
      </ul>
      <p style="margin-top:20px"><a href="/#pricing">See everything included &rarr;</a></p>
    </div>
  </section>

  <section class="section section-soft" aria-labelledby="faq-title">
    <div class="wrap faq-grid">
      <div>
        <p class="kicker">FAQ</p>
        <h2 id="faq-title">Questions from {c['name']} owners.</h2>
        <p class="section-lede">Don't see yours? <a href="tel:+19013210023">Call or text</a> or <a href="/#contact">send a message</a>.</p>
      </div>
      <div class="faq">
{faqs}
      </div>
    </div>
  </section>

  <section class="section" aria-labelledby="cta-title">
    <div class="wrap">
      <div class="cta-band">
        <div><h2 id="cta-title">Let's see what your site could look like.</h2><p>Free working draft in 2&ndash;3 days. No payment, no card and no obligation.</p></div>
        <div class="hero-actions" style="margin:0"><a class="btn btn-primary" href="/#contact">Get my free draft</a><a class="btn btn-ghost" href="tel:+19013210023">(901) 321-0023</a></div>
      </div>
      <h2 class="kicker" style="display:block;margin:48px 0 14px">Other areas I serve</h2>
      <ul class="areas">{areas}<li><a href="/">All of the Memphis area</a></li></ul>
    </div>
  </section>
</main>

"""
    return head(c["title"], c["desc"], url, ld=ld) + body + tail()

for slug, c in CITIES.items():
    os.makedirs(slug, exist_ok=True)
    open(f"{slug}/index.html", "w", encoding="utf8").write(city_page(slug, c))

notfound = head("Page not found | Bartlett Website Design", "That page doesn't exist. See live website demos or get a free draft of your site.", None, robots="noindex") + """
<main id="main">
  <section class="notfound" aria-labelledby="nf-title">
    <div class="wrap">
      <p class="big" aria-hidden="true">404</p>
      <h1 id="nf-title">That page isn't here.</h1>
      <p class="section-lede" style="max-width:32em;margin:0 auto 28px">The link may be old or mistyped. Here's where most people are headed:</p>
      <div class="hero-actions" style="justify-content:center">
        <a class="btn btn-primary" href="/#contact">Get my free draft<svg class="icon"><use href="#i-arrow"/></svg></a>
        <a class="btn btn-ghost" href="/demos/">See live demos</a>
        <a class="btn btn-ghost" href="/">Home</a>
      </div>
      <p style="margin-top:22px;color:var(--muted)">Or call or text <a href="tel:+19013210023">(901) 321-0023</a>.</p>
    </div>
  </section>
</main>

""" + tail()
open("404.html", "w", encoding="utf8").write(notfound)
thanks = head("Thanks | Bartlett Website Design", "Your free draft request was sent.", None, robots="noindex") + """
<main id="main">
  <section class="notfound" aria-labelledby="ty-title">
    <div class="wrap" style="max-width:720px">
      <p class="pill" style="margin:0 auto 20px"><b>Sent</b>Your free draft request</p>
      <h1 id="ty-title">Got it, thanks!</h1>
      <p class="section-lede" style="margin:0 auto 26px">Here's what happens next:</p>
      <ol class="next" style="text-align:left;max-width:30em;margin:0 auto">
        <li><span><b>I reply within one business day</b>By text or email, with a couple of quick questions about your business.</span></li>
        <li><span><b>You get a link to your draft in 2&ndash;3 days</b>A real, working site you can open on your phone and share.</span></li>
        <li><span><b>You decide</b>Love it, and we agree on a price before you pay. If not, you owe nothing.</span></li>
      </ol>
      <div class="hero-actions" style="justify-content:center;margin-top:32px">
        <a class="btn btn-primary" href="tel:+19013210023"><svg class="icon"><use href="#i-phone"/></svg>Call or text (901) 321-0023</a>
        <a class="btn btn-ghost" href="/demos/">Browse live demos</a>
      </div>
    </div>
  </section>
</main>

""" + tail(bar=False)  # they just asked for a draft; no "Get my free draft" bar
os.makedirs("thanks", exist_ok=True)
open("thanks/index.html", "w", encoding="utf8").write(thanks)
print("built", list(CITIES), "+ 404.html + thanks/")
