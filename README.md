# bartlettwebsitedesign.online

The full static site for Bartlett Website Design: the homepage (`index.html`, inline CSS and JS), the 8 demos under `demos/`, and their assets. Upload the whole folder (or a zip of it, minus this README) to Cloudflare to deploy.

- `?preview` on the URL shows the dashed placeholder boxes (headshot, testimonials) that visitors don't see.
- Headshot: save a 400x500 portrait as `assets/austin.webp`, then swap the `.avatar` div in the About section for the `<img>` in the comment next to it.
- Cloudflare adds its email obfuscation and bot-check scripts when it serves pages, so they aren't in these files.
