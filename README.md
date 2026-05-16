# archnimations.com

Static site for Archnimations — architectural visualization, animation and design communication studio. Pure HTML/CSS/JS, no build step. Hosted on GitHub Pages.

## Structure
- `index.html` — Home
- `about/` — About the studio
- `work/` — Work samples (filterable gallery + lightbox)
- `contact/` — Contact info + message form
- `assets/css/style.css` — design system
- `assets/js/intro-state.js` — early intro-state setup for the home page
- `assets/js/main.js` — nav, scroll reveal, metrics, contact mailto, gallery filter, lightbox
- `assets/images/work/` — project renders and drawings

## Deployment
GitHub Pages serves from the repo root. `CNAME` points the site at `archnimations.com`.

### DNS (point archnimations.com here)
A records for the apex domain:
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```
CNAME for `www` → `marberd.github.io`

### Email — info@archnimations.com
Email is handled by **Cloudflare Email Routing** (free forwarding to a personal inbox).
Set up at dash.cloudflare.com → Email → Email Routing.

## To do before launch
- Add a real favicon / studio logo (export from the old Wix site if available).
