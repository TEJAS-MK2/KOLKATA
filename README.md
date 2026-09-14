# কলকাতা দুর্গাপূজা — ২০২৬

A mobile-first Durga Puja guide and pandal explorer for Kolkata.

## What's included

- Editorial-style hero and festival storytelling
- Puja timeline from Mahalaya to Dashami
- Culture / artisan storytelling section
- North, South and Central Kolkata guide cards
- Interactive pandal explorer and map
- Expanded 2026 discovery catalog with verified-pin status
- 28 exact verified map pins in the canonical data registry
- Puja route planner with walking, driving, transit and two-wheeler modes
- Puja Night Mode with saved route progress
- Responsive visual gallery and lightbox
- Mobile navigation and smooth scrolling
- Bengali typography and subtle festival-inspired visual treatment
- Kolkata and Durga Puja imagery throughout the experience
- Graceful Leaflet fallback when the map provider is unavailable
- Accessibility and external-link hardening
- One canonical pin registry shared by the explorer, map and route planner
- Network-first service-worker caching to reduce stale production assets
- Wikimedia Commons image credits in `IMAGE_CREDITS.md`

## Live site

**GitHub Pages:** https://tejas-mk2.github.io/KOLKATA/

## Run locally

Open `index.html` in a browser. The core page is static; GitHub Pages deployment applies the production CDN integrity attributes and injects the maintained production modules.

## GitHub Pages

This is a static site and is deployed automatically to GitHub Pages from the `main` branch.

The deployment workflow validates JavaScript, the 28-pin canonical registry, deterministic script order, required assets, legacy-file removal, Bengali document language, and undefined Google Maps destinations before publishing.

<!-- Verified Pages build: 2026-09-14 -->
