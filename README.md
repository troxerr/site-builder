# bartlettwebsitedesign.online

The full static site for Bartlett Website Design: the homepage (`index.html`, inline CSS and JS), the 21 demos under `demos/`, the dental-office landing page under `dental/`, six city pages (`bartlett/`, `memphis/`, `germantown/`, `cordova/`, `arlington/`, `lakeland/`), a `thanks/` page, a branded `404.html`, and their assets. Cloudflare Workers Builds deploys it to production automatically on every push to `homepage-conversion-pass` (the production branch set in the Worker's build settings); other branches get preview builds, using `wrangler.jsonc` to serve the folder as static assets (`.assetsignore` keeps the README and config private).

- `?preview` on the URL shows the dashed testimonial placeholders that visitors don't see.
- Cloudflare adds its email obfuscation and bot-check scripts when it serves pages, so they aren't in these files.
- `_headers` sets security headers on every response and a one-week cache on `assets/` (file names aren't hashed, so a replaced image can take up to a week to refresh for repeat visitors).
- `wrangler.jsonc` uses `"not_found_handling": "404-page"`, so unknown paths get `404.html`. It uses root-relative links because it can be served at any path.
- `tools/gen_city.py` builds the city pages, `thanks/` and `404.html` from the homepage header, footer and mobile bar (run `python3 -I tools/gen_city.py` from the repo root after changing those). `tools/` is not deployed.
- After a successful form send, the homepage goes to `/thanks/`, so each lead shows up as a `/thanks/` page view in Cloudflare Web Analytics.
- City pages, `thanks/` and `404.html` share `assets/css/site.css`, a copy of the homepage's inline styles plus a few page-specific rules. If you change the homepage styles, copy the change there too.
- Cloudflare Web Analytics (cookieless) is the one `static.cloudflareinsights.com/beacon.min.js` tag before `</body>`, on the homepage, city pages, dental page, demos page and 404.

## Adding a demo

1. Put the site in `demos/<slug>/` with the dark "Demo site" bar right after `<body>` (copy it from any demo), `<meta name="robots" content="noindex, follow">`, and no canonical or structured data that claims to be the business.
2. Screenshot its first screen at 1120×700 and save `assets/work/demo-<slug>.webp`, plus a 560×350 copy as `assets/work/demo-<slug>-sm.webp`. Cards load the small one through `srcset`.
3. Add a card to `demos/index.html` (it shuffles itself). Optionally add it to the homepage pool in `index.html` as a `<li class="work-item" hidden>`; the homepage shows a random five.
