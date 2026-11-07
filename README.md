# bartlettwebsitedesign.online

The full static site for Bartlett Website Design: the homepage (`index.html`: dark design with a before/after slider, inline CSS and JS), the 23 demos under `demos/`, the dental-office landing page under `dental/`, six city pages (`bartlett/`, `memphis/`, `germantown/`, `cordova/`, `arlington/`, `lakeland/`), `thanks/` and `thanks/booking-agent/` pages, a branded `404.html`, and their assets. Cloudflare Workers Builds deploys it to production automatically on every push to `homepage-conversion-pass` (the production branch set in the Worker's build settings); other branches get preview builds, using `wrangler.jsonc` to serve the folder as static assets (`.assetsignore` keeps the README and config private).

- `?preview` on the URL shows the dashed testimonial placeholders that visitors don't see.
- Cloudflare adds its email obfuscation and bot-check scripts when it serves pages, so they aren't in these files.
- `_headers` sets security headers on every response and a one-week cache on `assets/` (file names aren't hashed, so a replaced image can take up to a week to refresh for repeat visitors).
- `wrangler.jsonc` uses `"not_found_handling": "404-page"`, so unknown paths get `404.html`. It uses root-relative links because it can be served at any path.
- The homepage and `dental/index.html` are edited by hand. Their CSS is Tailwind 3, compiled and inlined in the `<style>` block (no CDN script). After changing classes, run `python3 -I tools/home/build_css.py` (homepage) or `python3 -I tools/home/build_css.py dental/index.html` from the repo root. The shared config and component styles are in `tools/home/`.
- `tools/gen_city.py` builds the city pages, the `demos/` page, `thanks/`, `thanks/booking-agent/` and `404.html` in the homepage's design: it copies the header, footer, icon sprite and mobile bar from `index.html` and inlines Tailwind CSS compiled from those pages (run `python3 -I tools/gen_city.py` from the repo root after changing the homepage header or footer, or the page data in the script). `tools/` is not deployed.
- After a successful form send, the homepage goes to `/thanks/`, so each website lead shows up as a `/thanks/` page view in Cloudflare Web Analytics. Booking-agent leads (the `/dental/` form, or the homepage form with the booking-agent plan) go to `/thanks/booking-agent/` instead, so they count separately. Text-back leads go to `/thanks/` with a "Text-back inquiry" email subject.
- The city pages link back to the homepage's `#showcase`, `#work`, `#booking-agent`, `#pricing`, `#about`, `#faq` and `#contact` sections, so keep those ids.
- Cloudflare Web Analytics (cookieless) is the one `static.cloudflareinsights.com/beacon.min.js` tag before `</body>`, on the homepage, city pages, dental page, demos page and 404.

## Development

Needs Node 22 (`.nvmrc`) and Python 3. Setup once: `npm ci`, then `npx playwright install chromium`.

| Command | What it does |
|---|---|
| `npm run build` | Regenerates the generated pages and the compiled CSS |
| `npm run build:check` | Rebuilds, then fails if any committed file changed (CI runs this) |
| `npm run serve` | Serves the site locally at http://127.0.0.1:8080 with the same headers and 404 page as the host |
| `npm run lint` | Validates the HTML |
| `npm test` | Links, SEO tags, accessibility, forms, headers, deploy contents and the URL contract |
| `npm run test:live` | Checks the deployed site (all contract URLs, headers, console errors) |
| `npm run snapshot -- before` / `after`, then `npm run snapshot:compare` | Pixel-compares every main page at three widths before and after a refactor |
| `npm run baseline` | Records the demos' current accessibility violations; the test then only lets them go down |

Sandbox note: in a sandbox that needs a proxy, set `CHROMIUM_PATH` to a Chromium binary, and `NODE_USE_ENV_PROXY=1` for `npm run test:live`.

`tests/url-contract.json` lists every URL that has been shared (texts, posts, the sitemap). They must keep working. Add to it, and remove from it only on purpose.

## Founding-client deal

The first 3 website clients get $100 off (Starter $250, Business $850). In return, if they're happy, they're asked for a Google review, a short quote and permission to show their site.

- **When a spot is taken:** lower the count in two places, then push.
  - `data-spots="3"` on `#founding` in `index.html`. The homepage script updates every "N of 3 spots left".
  - `FOUNDING_SPOTS = 3` at the top of `tools/gen_city.py`. Then run `python3 -I tools/gen_city.py`.
- **At 0:** the homepage hides the deal, the FAQ entry and the founding prices on its own. The city and demos pages drop it on the next `gen_city.py` run.
- **After the deal ends:** remove the FAQ entry from the homepage's FAQPage structured data too.

## Adding a demo

1. Put the site in `demos/<slug>/` with the dark "Demo site" bar right after `<body>` (copy it from any demo), `<meta name="robots" content="noindex, follow">`, and no canonical, `og:url` or structured data that claims to be the business.
2. Screenshot its first screen at 1120×700 and save `assets/work/demo-<slug>.webp`, plus a 560×350 copy as `assets/work/demo-<slug>-sm.webp`. Cards load the small one through `srcset`.
3. Screenshot it at 1200×630 and save `assets/og/demo-<slug>.jpg`, then add the link-preview tags after its `<title>` (copy the block from any demo). The `og:title` says it's a demo, and `og:url` is its bartlettwebsitedesign.online address. This is the card people see when you text the link.
4. Add a row to `DEMO_PAGE` in `tools/gen_city.py` and run `python3 -I tools/gen_city.py` to rebuild `demos/index.html` (it shuffles itself). Optionally add it to the homepage pool in `index.html` by copying one of its `<li class="work-item" hidden>` cards (the homepage shows a random five), then rebuild the homepage CSS.
