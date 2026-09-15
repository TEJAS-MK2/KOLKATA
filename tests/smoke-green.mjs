import { chromium } from 'playwright';
import { spawn } from 'node:child_process';

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
    if (request.url().startsWith('http://127.0.0.1:4173/')) failedRequests.push(`${request.method()} ${request.url()} :: ${request.failure()?.errorText || 'failed'}`);
  });

  await page.goto('http://127.0.0.1:4173/index.html', { waitUntil: 'commit', timeout: 60000 });
  await page.waitForFunction(() => Array.isArray(window.pandals) && window.pandals.length >= 100 && document.querySelectorAll('.pandal-card').length >= 100, null, { timeout: 30000 });
  await wait(2200);

  const checks = await page.evaluate(() => ({
    pandals: Array.isArray(window.pandals) ? window.pandals.length : 0,
    uniquePandals: Array.isArray(window.pandals) ? new Set(window.pandals.map(item => item.name)).size : 0,
    canonicalPins: Object.keys(window.KOLKATA_CANONICAL_PINS || {}).length,
    cards: document.querySelectorAll('.pandal-card').length,
    markerCount: document.querySelectorAll('.leaflet-marker-icon').length,
    leaflet: Boolean(window.L),
    map: Boolean(document.getElementById('pandal-map')?._leaflet_id),
    mapFallback: Boolean(document.querySelector('#pandal-map .map-fallback')),
    state: window.KolkataState?.get?.() || null,
    search: Boolean(document.getElementById('pandal-search')),
    route: Boolean(document.getElementById('route-stops')),
    menu: Boolean(document.querySelector('.menu')),
    toolkit: Boolean(document.querySelector('#puja-suite-launcher')),
    guides: Boolean(document.querySelector('.puja-guides')),
    details: Boolean(document.querySelector('#pandal-details')),
    gallery: Boolean(document.querySelector('#lightbox')),
    bingoRemoved: !document.querySelector('#puja-bingo') && !document.querySelector('.bingo-panel'),
    pageEntryReady: document.documentElement.classList.contains('kolkata-page-ready')
  }));

  const fail = message => { throw new Error(message); };
  if (checks.cards < 109) fail(`Expected at least 109 catalog cards, found ${checks.cards}`);
  if (checks.pandals < 100 || checks.uniquePandals !== checks.pandals) fail(`Unified pandal catalog is invalid (${checks.pandals} entries, ${checks.uniquePandals} unique)`);
  if (checks.canonicalPins !== 36) fail(`Expected 36 canonical pins, found ${checks.canonicalPins}`);
  if (checks.leaflet && checks.markerCount < 41) fail(`Leaflet loaded but expected at least 41 markers, found ${checks.markerCount}`);
  if (!checks.leaflet && !checks.mapFallback) fail('Neither Leaflet map nor documented map fallback initialized');
  if (!checks.search || !checks.route || !checks.menu || !checks.details || !checks.gallery) fail('Core mobile controls or overlays are missing');
  if (!checks.toolkit || !checks.guides) fail('One or more remaining Puja feature modules did not load');
  if (!checks.bingoRemoved) fail('Retired Puja Bingo UI is still present');
  if (!checks.state || checks.state.version !== 3) fail('Unified v3 state store did not initialize');

  const search = page.locator('#pandal-search');
  await search.fill('20 Palli');
  await wait(250);
  if (await page.locator('.pandal-card:not(.v2-hidden)').count() < 1) fail('Search did not find 20 Palli Sarbojani Durgotsab');
  await search.fill('');

  await page.locator('.filter-btn[data-zone="North"]').click();
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

  await firstCard.locator('h3').click();
  await page.waitForFunction(() => document.querySelector('#pandal-details')?.hidden === false && document.querySelector('#details-title')?.textContent.includes('Bagbazar Sarbojanin'), null, { timeout: 3000 });
  await page.locator('.pandal-details-close').click();
  await page.waitForFunction(() => document.querySelector('#pandal-details')?.hidden === true, null, { timeout: 3000 });

  const menu = page.locator('.menu');
  await menu.click({ force: true });
  await page.waitForFunction(() => document.querySelector('.menu')?.getAttribute('aria-expanded') === 'true' && document.querySelector('.site-header nav')?.classList.contains('is-open'), null, { timeout: 3000 });
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => document.querySelector('.menu')?.getAttribute('aria-expanded') === 'false' && !document.querySelector('.site-header nav')?.classList.contains('is-open'), null, { timeout: 3000 });

  if (pageErrors.length) fail(`Runtime page errors: ${pageErrors.join(' | ')}`);
  if (consoleErrors.length) fail(`Console errors: ${consoleErrors.join(' | ')}`);
  if (failedRequests.length) fail(`Unexpected local asset request failures: ${failedRequests.join(' | ')}`);

  console.log('Production smoke test passed:', JSON.stringify(checks));
} finally {
  await browser?.close();
  server.kill('SIGTERM');
}
