# bartlettwebsitedesign.online

The full static site for Bartlett Website Design: the homepage (`index.html`, inline CSS and JS), the 9 demos under `demos/`, the dental-office landing page under `dental/`, and their assets. Cloudflare Workers Builds deploys it to production automatically on every push to `homepage-conversion-pass` (the production branch set in the Worker's build settings); other branches get preview builds, using `wrangler.jsonc` to serve the folder as static assets (`.assetsignore` keeps the README and config private).

- `?preview` on the URL shows the dashed testimonial placeholders that visitors don't see.
- Cloudflare adds its email obfuscation and bot-check scripts when it serves pages, so they aren't in these files.
