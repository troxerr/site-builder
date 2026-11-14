// <head> and structured data (JSON-LD). Everything here is derived from src/data so it can't drift from the page text.
import { site, areas, faqEntries, faqJsonLd, money, intake } from "./ui.mjs";

export const SITE_URL = site.url;
const P = site.pricing;
const esc = (s) => s.replace(/&(?!(?:[a-z]+|#\d+|#x[0-9a-f]+);)/gi, "&amp;").replace(/"/g, "&quot;");
const ldTag = (x) => `<script type="application/ld+json">${JSON.stringify(x)}</script>`;
const area = (name) => ({ "@type": "City", name: `${name}, TN` });
const provider = { "@type": "ProfessionalService", name: site.name, url: `${SITE_URL}/`, telephone: site.phone.e164 };
const address = { "@type": "PostalAddress", addressLocality: "Bartlett", addressRegion: "TN", addressCountry: "US" };
const offer = (name, price, description) => ({ "@type": "Offer", name, price: String(price), priceCurrency: "USD", ...(description ? { description } : {}) });

export const structuredData = {
  home: () => [
    {
      "@context": "https://schema.org", "@type": "ProfessionalService", name: site.name, url: `${SITE_URL}/`,
      logo: `${SITE_URL}/assets/logo-mark-512.png`, image: `${SITE_URL}/assets/og-image.png`,
      telephone: site.phone.e164, email: site.email,
      description: "Website design and missed-call text-back for small businesses and contractors in Bartlett, Memphis and the Mid-South. See a free draft before you pay.",
      founder: { "@type": "Person", name: "Austin" }, priceRange: `${money(P.textback)}–${money(P.agent.setup)}`,
      areaServed: areas.map(([, n]) => `${n}, TN`),
      address,
      makesOffer: [
        offer("Starter website", P.starter), offer("Business website", P.business), offer("Care plan", P.care, "Per month, optional"),
        offer("Missed-call text-back", P.textback, "Per month. No long-term contract."),
        offer("Website + text-back", P.suite.monthly, `Per month, plus ${money(P.suite.setup)} one-time setup. No long-term contract.`),
        offer("Missed-call booking agent", P.agent.setup, `One-time setup, then ${money(P.agent.monthly)} per month. No long-term contract.`),
      ],
      sameAs: [site.facebook, site.googleReview],
    },
    faqJsonLd(faqEntries()),
  ],
  dental: () => [{
    "@context": "https://schema.org", "@type": "Service", name: "Missed-call booking agent for dental offices",
    serviceType: "Missed-call text-back and appointment booking", url: `${SITE_URL}/dental/`, provider,
    areaServed: areas.map(([, n]) => `${n}, TN`), audience: { "@type": "BusinessAudience", name: "Dental offices" },
    offers: offer("Missed-call booking agent", P.agent.setup, `One-time setup, then ${money(P.agent.monthly)} per month. No long-term contract.`),
  }],
  intake: (faqs) => [{
    "@context": "https://schema.org", "@type": "Service", name: "After-hours call intake assistant for bail bond offices",
    serviceType: "AI call answering and lead intake", url: `${SITE_URL}/bail-bonds/`, provider,
    areaServed: areas.map(([, n]) => `${n}, TN`), audience: { "@type": "BusinessAudience", name: "Bail bond offices" },
    offers: { "@type": "Offer", price: String(intake.price()), priceCurrency: "USD", description: `Per month after a ${intake.trialDays}-day free trial. No contract.` },
  }, faqJsonLd(faqs)],
  city: (slug, city, faqs) => [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: `Website design in ${city.name}`, item: `${SITE_URL}/${slug}/` }] },
    { "@context": "https://schema.org", "@type": "ProfessionalService", name: site.name, url: `${SITE_URL}/`, telephone: site.phone.e164, email: site.email,
      priceRange: `${money(P.textback)}–${money(P.agent.setup)}`, address, areaServed: area(city.name) },
    faqJsonLd(faqs),
  ],
};

/** The <head> of a page. `meta`: title, description, path, ogTitle/ogDescription/ogImage, robots, ld. */
export function head(meta) {
  const { title, description, path, robots, ld = [], ogImage = "/assets/og-image.png" } = meta;
  const ogTitle = meta.ogTitle ?? title, ogDescription = meta.ogDescription ?? description, image = `${SITE_URL}${ogImage}`;
  const lines = [
    "<!doctype html>", '<html lang="en" class="motion-safe:scroll-smooth studio-site">', "<head>",
    '<meta charset="utf-8">', '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">',
    `<title>${esc(title)}</title>`, `<meta name="description" content="${esc(description)}">`,
    robots && `<meta name="robots" content="${robots}">`,
    '<meta name="theme-color" content="#143fc5">', '<meta name="color-scheme" content="dark">',
    !robots && `<link rel="canonical" href="${SITE_URL}${path}">`,
    '<meta property="og:type" content="website">',
    !robots && `<meta property="og:url" content="${SITE_URL}${path}">`,
    `<meta property="og:title" content="${esc(ogTitle)}">`, `<meta property="og:description" content="${esc(ogDescription)}">`,
    `<meta property="og:image" content="${image}">`, '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${esc(ogTitle)}">`, `<meta name="twitter:description" content="${esc(ogDescription)}">`, `<meta name="twitter:image" content="${image}">`,
    '<link rel="icon" href="/favicon.ico" sizes="48x48">', '<link rel="icon" href="/assets/logo-mark.svg" type="image/svg+xml">', '<link rel="manifest" href="/site.webmanifest">', '<link rel="apple-touch-icon" href="/assets/logo-mark-512.png">',
    '<link rel="preload" href="/assets/fonts/sora-latin.woff2" as="font" type="font/woff2" crossorigin>',
    '<link rel="preload" href="/assets/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin>',
    ...ld.map(ldTag),
    '<link rel="stylesheet" href="{{CSS}}">',
    '<link rel="stylesheet" href="/assets/studio-editorial.7dbc2ba9c1.css">',
    "</head>",
  ];
  return lines.filter(Boolean).join("\n");
}

