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
  const failedRequests = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  page.on('requestfailed', request => {
    if (request.url().startsWith('http://127.0.0.1:4173/')) {
      failedRequests.push(`${request.method()} ${request.url()} :: ${request.failure()?.errorText || 'failed'}`);
    }
  });

  await page.goto('http://127.0.0.1:4173/index.html', { waitUntil: 'commit', timeout: 60000 });
  await page.waitForFunction(() => Array.isArray(window.pandals) && window.pandals.length === 100, null, { timeout: 90000 });
  await page.waitForFunction(() => document.querySelectorAll('.pandal-card').length >= 100, null, { timeout: 30000 });
  await page.waitForFunction(() => Object.keys(window.KOLKATA_CANONICAL_PINS || {}).length === 36, null, { timeout: 30000 });
  await page.waitForFunction(() => document.querySelectorAll('.leaflet-marker-icon').length === 41, null, { timeout: 30000 });
  await page.waitForFunction(() => document.querySelectorAll('.pandal-card').length >= 109, null, { timeout: 30000 });
  await wait(500);

  const checks = await page.evaluate(() => ({
    cards: document.querySelectorAll('.pandal-card').length,
    canonicalPins: Object.keys(window.KOLKATA_CANONICAL_PINS || {}).length,
    pandals: Array.isArray(window.pandals) ? window.pandals.length : -1,
    markerCount: document.querySelectorAll('.leaflet-marker-icon').length,
    leaflet: Boolean(window.L),
    map: Boolean(document.getElementById('pandal-map')?._leaflet_id),
    state: window.KolkataState?.get?.() || null,
    search: Boolean(document.getElementById('pandal-search')),
    route: Boolean(document.getElementById('route-stops')),
    menu: Boolean(document.querySelector('.menu')),
    toolkit: Boolean(document.querySelector('#puja-suite-launcher')),
    bingo: Boolean(document.querySelector('#puja-bingo')),
    guides: Boolean(document.querySelector('.puja-guides')),
    swSupported: 'serviceWorker' in navigator,
    canonicalMatches: Object.entries(window.KOLKATA_CANONICAL_PINS || {}).every(([name, coords]) => {
      const pandal = window.pandals?.find(item => item.name === name);
      return pandal && Number(pandal.lat) === Number(coords[0]) && Number(pandal.lng) === Number(coords[1]);
    }),
    expandedPins: ['Tala Park', 'Muhammad Ali Park', 'Dumdum Park Tarun Dal', 'Chorebagan Sarbojanin', 'Bakul Bagan'].every(name => {
      const pandal = window.pandals?.find(item => item.name === name);
      return pandal && Number.isFinite(Number(pandal.lat)) && Number.isFinite(Number(pandal.lng));
    })
  }));

  const fail = message => { throw new Error(message); };
  if (checks.cards !== 109) fail(`Expected 109 pandal cards, found ${checks.cards}`);
  if (checks.canonicalPins !== 36) fail(`Expected 36 canonical pins, found ${checks.canonicalPins}`);
  if (checks.pandals !== 100) fail(`Expected unified window.pandals catalog to contain 100 entries, found ${checks.pandals}`);
  if (checks.markerCount !== 41) fail(`Expected 41 Leaflet markers, found ${checks.markerCount}`);
  if (!checks.canonicalMatches) fail('Canonical coordinates do not match the unified pandal catalog');
  if (!checks.expandedPins) fail('Verified expansion pins were not merged into the unified pandal catalog');
  if (!checks.leaflet || !checks.map) fail('Leaflet map did not initialize');
  if (!checks.search || !checks.route || !checks.menu) fail('Core mobile controls are missing');
  if (!checks.toolkit || !checks.bingo || !checks.guides) fail('One or more Puja feature modules did not load');
  if (!checks.state || checks.state.version !== 3) fail('Unified v3 state store did not initialize');

  const search = page.locator('#pandal-search');
  await search.fill('20 Palli');
  await wait(250);
  if (await page.locator('.pandal-card:not(.v2-hidden)').count() < 1) fail('Search did not find 20 Palli Sarbojani Durgotsab');
  await search.fill('');

  await search.fill('Chaltabagan Sarbojanin');
  await wait(300);
  if (await page.locator('[data-extra-pandal="true"]').count() !== 1) fail('Expanded discovery listing was not injected');
  await search.fill('');

  const firstCard = page.locator('.pandal-card').filter({ hasText: 'Bagbazar Sarbojanin' }).first();
  const add = firstCard.locator('.catalog-route,.add-route').first();
  if (await add.count() !== 1) fail('No route control found for Bagbazar Sarbojanin');
  await add.click();
  await wait(150);
  if ((await page.locator('#route-count').textContent())?.trim() !== '1 / 8') fail('Adding a pandal did not update the route count');

  await page.locator('.mode-btn[data-mode="driving"]').click();
  await page.waitForFunction(() => window.KolkataState?.get?.().mode === 'driving', null, { timeout: 3000 });
  await page.waitForFunction(() => document.querySelector('#open-route')?.href.includes('travelmode=driving'), null, { timeout: 3000 });

  const menu = page.locator('.menu');
  await menu.click();
  if (await menu.getAttribute('aria-expanded') !== 'true') fail('Mobile menu did not open');
  await menu.click();
  if (await menu.getAttribute('aria-expanded') !== 'false') fail('Mobile menu did not close');

  if (checks.swSupported) {
    await page.waitForFunction(async () => Boolean(await navigator.serviceWorker.getRegistration()), null, { timeout: 5000 }).catch(() => fail('Service worker did not register'));
  }
  if (pageErrors.length) fail(`Runtime page errors: ${pageErrors.join(' | ')}`);
  if (failedRequests.length) fail(`Unexpected local asset request failures: ${failedRequests.join(' | ')}`);

  console.log('Production smoke test passed:', JSON.stringify(checks));
} finally {
  await browser?.close();
  server.kill('SIGTERM');
}
