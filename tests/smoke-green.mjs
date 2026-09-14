import { chromium } from 'playwright';
import { spawn } from 'node:child_process';

// Production smoke test: Leaflet is optional because the app has a documented fallback.
const server = spawn('python3', ['-m', 'http.server', '4173', '--bind', '127.0.0.1'], { stdio: 'ignore' });
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
let browser;

try {
  await wait(500);
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const pageErrors = [];
  const consoleErrors = [];
  const failedRequests = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('requestfailed', request => {
    if (request.url().startsWith('http://127.0.0.1:4173/')) {
      failedRequests.push(`${request.method()} ${request.url()} :: ${request.failure()?.errorText || 'failed'}`);
    }
  });

  await page.goto('http://127.0.0.1:4173/index.html', { waitUntil: 'commit', timeout: 60000 });
  await page.waitForFunction(() => Array.isArray(window.pandals) && window.pandals.length >= 100 && document.querySelectorAll('.pandal-card').length >= 100, null, { timeout: 30000 });
  await wait(2200);

  const bootstrap = await page.evaluate(() => ({
    readyState: document.readyState,
    pandals: Array.isArray(window.pandals) ? window.pandals.length : null,
    uniquePandals: Array.isArray(window.pandals) ? new Set(window.pandals.map(item => item.name)).size : null,
    canonicalPins: Object.keys(window.KOLKATA_CANONICAL_PINS || {}).length,
    leaflet: Boolean(window.L),
    state: Boolean(window.KolkataState),
    cards: document.querySelectorAll('.pandal-card').length,
    discoveryListings: Array.isArray(window.KOLKATA_EXTRA_PANDALS) ? window.KOLKATA_EXTRA_PANDALS.length : 0
  }));
  if (bootstrap.pandals === null || bootstrap.uniquePandals !== bootstrap.pandals) {
    throw new Error(`Bootstrap catalog invalid: ${JSON.stringify(bootstrap)}`);
  }

  await page.waitForFunction(() => document.querySelectorAll('.pandal-card').length >= 109, null, { timeout: 10000 });
  await page.waitForFunction(() => Object.keys(window.KOLKATA_CANONICAL_PINS || {}).length === 36, null, { timeout: 10000 });

  const checks = await page.evaluate(() => ({
    cards: document.querySelectorAll('.pandal-card').length,
    canonicalPins: Object.keys(window.KOLKATA_CANONICAL_PINS || {}).length,
    pandals: Array.isArray(window.pandals) ? window.pandals.length : -1,
    uniquePandals: Array.isArray(window.pandals) ? new Set(window.pandals.map(item => item.name)).size : -1,
    discoveryListings: Array.isArray(window.KOLKATA_EXTRA_PANDALS) ? window.KOLKATA_EXTRA_PANDALS.length : 0,
    markerCount: document.querySelectorAll('.leaflet-marker-icon').length,
    leaflet: Boolean(window.L),
    map: Boolean(document.getElementById('pandal-map')?._leaflet_id),
    mapFallback: Boolean(document.querySelector('#pandal-map .map-fallback')),
    state: window.KolkataState?.get?.() || null,
    search: Boolean(document.getElementById('pandal-search')),
    route: Boolean(document.getElementById('route-stops')),
    menu: Boolean(document.querySelector('.menu')),
    toolkit: Boolean(document.querySelector('#puja-suite-launcher')),
    bingo: Boolean(document.querySelector('#puja-bingo')),
    guides: Boolean(document.querySelector('.puja-guides')),
    details: Boolean(document.querySelector('#pandal-details')),
    gallery: Boolean(document.querySelector('#lightbox')),
    swSupported: 'serviceWorker' in navigator,
    duplicateIds: (() => { const ids=[...document.querySelectorAll('[id]')].map(el=>el.id).filter(Boolean); return ids.filter((id,i)=>ids.indexOf(id)!==i); })(),
    canonicalMatches: Object.entries(window.KOLKATA_CANONICAL_PINS || {}).every(([name, coords]) => {
      const pandal = window.pandals?.find(item => item.name === name);
      return pandal && Number(pandal.lat) === Number(coords[0]) && Number(pandal.lng) === Number(coords[1]);
    }),
    expandedPins: ['Tala Park', 'Muhammad Ali Park', 'Dumdum Park Tarun Dal', 'Chorebagan Sarbojanin', 'Bakul Bagan'].every(name => {
      const pandal = window.pandals?.find(item => item.name === name);
      return pandal && Number.isFinite(Number(pandal.lat)) && Number.isFinite(Number(pandal.lng));
    }),
    discoveryDataComplete: Array.isArray(window.KOLKATA_EXTRA_PANDALS) && window.KOLKATA_EXTRA_PANDALS.length === 9 && window.KOLKATA_EXTRA_PANDALS.some(item => item.name === 'Chaltabagan Sarbojanin'),
    introPresent: Boolean(document.querySelector('.puja-intro')),
    pageEntryReady: document.documentElement.classList.contains('kolkata-page-ready')
  }));

  const fail = message => { throw new Error(message); };
  if (checks.cards < 109) fail(`Expected at least 109 catalog cards, found ${checks.cards}`);
  if (checks.pandals < 100) fail(`Expected at least 100 unified catalog entries, found ${checks.pandals}`);
  if (checks.uniquePandals !== checks.pandals) fail(`Unified pandal catalog contains duplicate names (${checks.pandals} entries, ${checks.uniquePandals} unique)`);
  if (checks.discoveryListings !== 9 || !checks.discoveryDataComplete) fail('Discovery listing dataset is incomplete');
  if (checks.canonicalPins !== 36) fail(`Expected 36 canonical pins, found ${checks.canonicalPins}`);
  if (checks.leaflet && checks.markerCount < 41) fail(`Leaflet loaded but expected at least 41 markers, found ${checks.markerCount}`);
  if (!checks.leaflet && !checks.mapFallback) fail('Neither Leaflet map nor documented map fallback initialized');
  if (!checks.canonicalMatches) fail('Canonical coordinates do not match the unified pandal catalog');
  if (!checks.expandedPins) fail('Verified expansion pins were not merged into the unified pandal catalog');
  if (!checks.search || !checks.route || !checks.menu || !checks.details || !checks.gallery) fail('Core mobile controls or overlays are missing');
  if (!checks.toolkit || !checks.bingo || !checks.guides) fail('One or more Puja feature modules did not load');
  if (!checks.state || checks.state.version !== 3) fail('Unified v3 state store did not initialize');
  if (checks.duplicateIds.length) fail(`Duplicate DOM ids found: ${checks.duplicateIds.join(', ')}`);

  const search = page.locator('#pandal-search');
  await search.fill('20 Palli');
  await wait(250);
  if (await page.locator('.pandal-card:not(.v2-hidden)').count() < 1) fail('Search did not find 20 Palli Sarbojani Durgotsab');
  await search.fill('');

  const north = page.locator('.filter-btn[data-zone="North"]');
  await north.click();
  await wait(150);
  if (await page.locator('.pandal-card:not(.v2-hidden)').count() < 1) fail('North zone filter hid every pandal');
  await page.locator('.filter-btn[data-zone="all"]').click();

  const firstCard = page.locator('.pandal-card').filter({ hasText: 'Bagbazar Sarbojanin' }).first();
  const add = firstCard.locator('.catalog-route,.add-route').first();
  if (await add.count() !== 1) fail('No route control found for Bagbazar Sarbojanin');
  await add.click();
  await wait(150);
  if ((await page.locator('#route-count').textContent())?.trim() !== '1 / 8') fail('Adding a pandal did not update the route count');

  await page.locator('.mode-btn[data-mode="driving"]').click();
  await page.waitForFunction(() => window.KolkataState?.get?.().mode === 'driving', null, { timeout: 3000 });
  await page.waitForFunction(() => document.querySelector('#open-route')?.href.includes('travelmode=driving'), null, { timeout: 3000 });

  await firstCard.click();
  await page.waitForFunction(() => document.querySelector('#pandal-details')?.hidden === false && document.querySelector('#details-title')?.textContent.includes('Bagbazar Sarbojanin'), null, { timeout: 3000 });
  await page.locator('.pandal-details-close').click();
  await page.waitForFunction(() => document.querySelector('#pandal-details')?.hidden === true, null, { timeout: 3000 });

  const menu = page.locator('.menu');
  await menu.click();
  await page.waitForFunction(() => document.querySelector('.menu')?.getAttribute('aria-expanded') === 'true' && document.querySelector('.site-header nav')?.classList.contains('is-open'), null, { timeout: 3000 });
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => document.querySelector('.menu')?.getAttribute('aria-expanded') === 'false' && !document.querySelector('.site-header nav')?.classList.contains('is-open'), null, { timeout: 3000 });

  if (checks.swSupported) {
    await page.waitForFunction(async () => Boolean(await navigator.serviceWorker.getRegistration()), null, { timeout: 5000 }).catch(() => fail('Service worker did not register'));
  }
  if (pageErrors.length) fail(`Runtime page errors: ${pageErrors.join(' | ')}`);
  if (consoleErrors.length) fail(`Console errors: ${consoleErrors.join(' | ')}`);
  if (failedRequests.length) fail(`Unexpected local asset request failures: ${failedRequests.join(' | ')}`);

  console.log('Production smoke test passed:', JSON.stringify(checks));
} finally {
  await browser?.close();
  server.kill('SIGTERM');
}
