# bartlettwebsitedesign.online

The full static site for Bartlett Website Design: the homepage (`index.html`: dark design with a before/after slider, inline CSS and JS), the 21 demos under `demos/`, the dental-office landing page under `dental/`, six city pages (`bartlett/`, `memphis/`, `germantown/`, `cordova/`, `arlington/`, `lakeland/`), `thanks/` and `thanks/booking-agent/` pages, a branded `404.html`, and their assets. Cloudflare Workers Builds deploys it to production automatically on every push to `homepage-conversion-pass` (the production branch set in the Worker's build settings); other branches get preview builds, using `wrangler.jsonc` to serve the folder as static assets (`.assetsignore` keeps the README and config private).

- `?preview` on the URL shows the dashed testimonial placeholders that visitors don't see.
- Cloudflare adds its email obfuscation and bot-check scripts when it serves pages, so they aren't in these files.
- `_headers` sets security headers on every response and a one-week cache on `assets/` (file names aren't hashed, so a replaced image can take up to a week to refresh for repeat visitors).
- `wrangler.jsonc` uses `"not_found_handling": "404-page"`, so unknown paths get `404.html`. It uses root-relative links because it can be served at any path.
- The homepage's CSS is Tailwind 3, compiled and inlined in its `<style>` block (no CDN script). After changing classes in `index.html`, run `python3 -I tools/home/build_css.py` from the repo root to rebuild it. Its config and component styles are in `tools/home/`.
- `tools/gen_city.py` builds the city pages, `thanks/`, `thanks/booking-agent/` and `404.html` from the shared header, footer and mobile bar in `tools/chrome.html` (run `python3 -I tools/gen_city.py` from the repo root after changing that file). `tools/` is not deployed.
- After a successful form send, the homepage goes to `/thanks/`, so each website lead shows up as a `/thanks/` page view in Cloudflare Web Analytics. Booking-agent leads (the `/dental/` form, or the homepage form with the booking-agent plan) go to `/thanks/booking-agent/` instead, so they count separately. Text-back leads go to `/thanks/` with a "Text-back inquiry" email subject.
- City pages, `thanks/` and `404.html` share `assets/css/site.css` (the light design the homepage used before Nov 2026) and keep that look. They link back to the homepage's `#work`, `#process`, `#booking-agent`, `#pricing`, `#about`, `#faq` and `#contact` sections, so keep those ids.
- Cloudflare Web Analytics (cookieless) is the one `static.cloudflareinsights.com/beacon.min.js` tag before `</body>`, on the homepage, city pages, dental page, demos page and 404.

## Adding a demo

1. Put the site in `demos/<slug>/` with the dark "Demo site" bar right after `<body>` (copy it from any demo), `<meta name="robots" content="noindex, follow">`, and no canonical or structured data that claims to be the business.
2. Screenshot its first screen at 1120×700 and save `assets/work/demo-<slug>.webp`, plus a 560×350 copy as `assets/work/demo-<slug>-sm.webp`. Cards load the small one through `srcset`.
3. Add a card to `demos/index.html` (it shuffles itself). Optionally add it to the homepage pool in `index.html` by copying one of its `<li class="work-item" hidden>` cards; the homepage shows a random five. Then rebuild the homepage CSS (above).
