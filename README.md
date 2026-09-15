# কলকাতা দুর্গাপূজা — ২০২৬

A mobile-first Durga Puja guide and pandal explorer for Kolkata, built as a static GitHub Pages site with a Vercel production mirror and Supabase-backed cloud state storage.

## Features

- Editorial-style Kolkata and Durga Puja storytelling
- Puja timeline from Mahalaya to Dashami
- Culture and artisan storytelling
- North, Central, South Kolkata and Salt Lake discovery catalog
- **100-entry unified pandal catalog**
- **36 canonical verified map pins**
- Additional verified catalog pins merged from maintained 2026 expansion data
- Discovery-only listings where an exact map pin has not been verified
- Interactive Leaflet pandal map with graceful fallback
- Search and neighbourhood/zone filtering
- Route planner with walking, driving, transit and two-wheeler modes
- Puja Night Mode with saved route progress
- Pandal details, favourites, visited state and private notes
- Puja Toolkit, Puja Passport, festival guides
- Responsive gallery and lightbox
- Mobile navigation and smooth scrolling
- Bengali typography and festival-inspired visual treatment
- Accessibility and external-link hardening
- Network-first service-worker caching with versioned core assets
- Supabase-backed cloud persistence for the personal Puja state, with localStorage fallback
- Wikimedia Commons archival image credits in `IMAGE_CREDITS.md`

## Verification-first map

Coordinates are not guessed. The canonical registry in `production-bootstrap.js` contains the maintained verified coordinates used by the explorer, map and route planner. Additional 2026 expansion data is merged only when coordinates are explicitly available. Listings without verified coordinates remain discovery listings and do not receive a map marker.

## Live sites

**GitHub Pages:** https://tejas-mk2.github.io/KOLKATA/

**Vercel:** https://kolkata-puja-2026.vercel.app/

The Vercel production URL mirrors the current GitHub Pages deployment through a Vercel rewrite, keeping the public Vercel URL stable while the repository remains the source of truth.

## Supabase storage

The project uses the existing Supabase project in the `ap-south-1` region for lightweight personal Puja-state persistence. The browser generates a random per-device session UUID and stores the saved, visited, route, completion, mode and notes state in `public.kolkata_puja_user_state`. If Supabase is unavailable, the site continues using localStorage without blocking the explorer.

Only a Supabase publishable/anon client key is used in browser code. No service-role or secret key is shipped to the client. The Supabase table is protected with Row Level Security; the current anonymous session model is intended for non-account-based device sync rather than identity or sensitive-data storage.

## Run locally

The project is a static site. For a simple local preview:

```bash
python3 -m http.server 4173
```

Then open `http://127.0.0.1:4173/` in a browser.

For browser QA:

```bash
npm ci
npx playwright install --with-deps chromium
npm run test:smoke
```

The smoke test exercises mobile rendering, catalog rendering, the map, search, route planner, details modal, personal state, Puja features, menu and service-worker registration. Its current production contract checks 109 rendered catalog/discovery cards, 36 canonical pins, 100 unified catalog records and 41 Leaflet markers.

## GitHub Pages

Every push to `main` triggers the Pages workflow. It validates required source files, Bengali document language, CDN integrity attributes, deterministic script order, JavaScript syntax, canonical pin count, local assets and legacy-file removal before running the browser smoke test and publishing the site.

## Data and image credits

Pandal information is presented as a planning guide, not as an official committee directory. 2026 themes, schedules, access arrangements, traffic controls, ratings and opening conditions can change and should be confirmed locally before visiting.

Archival imagery is credited in `IMAGE_CREDITS.md`. The project does not claim ownership of those photographs; reuse should follow the individual Wikimedia Commons file's current licence and attribution requirements.

## License

Source code is distributed under the **Mozilla Public License 2.0 (MPL-2.0)**. See `LICENSE` for the full terms.

## Community and security

Please read `CODE_OF_CONDUCT.md` before contributing or participating in project discussions, and `SECURITY.md` before reporting a security vulnerability.

<!-- Documentation reviewed: 2026-09-15 -->
