import { chromium } from 'playwright';
import { spawn } from 'node:child_process';

const server = spawn('python3', ['-m', 'http.server', '4173', '--bind', '127.0.0.1'], { stdio: 'ignore' });
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const fail = message => { throw new Error(message); };
let browser;
try {
  await wait(800);
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto('http://127.0.0.1:4173/index.html', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForFunction(() => document.querySelectorAll('.pandal-card').length >= 100, null, { timeout: 15000 });
  await page.waitForFunction(() => window.__KOLKATA_CANONICAL_CONTROLLER_READY === true, null, { timeout: 10000 });
  // Companion/Toolkit/Bingo modules initialize asynchronously after the core controller.
  await wait(3000);

  const checks = await page.evaluate(() => ({
    cards: document.querySelectorAll('.pandal-card').length,
    canonicalPins: Object.keys(window.KOLKATA_CANONICAL_PINS || {}).length,
    pandals: Array.isArray(window.pandals) ? window.pandals.length : -1,
    markerCount: document.querySelectorAll('.leaflet-marker-icon').length,
    leaflet: Boolean(window.L),
    map: Boolean(document.getElementById('pandal-map')?._leaflet_id),
    search: Boolean(document.getElementById('pandal-search')),
    route: Boolean(document.getElementById('route-stops')),
    menu: Boolean(document.querySelector('.menu')),
    toolkit: /Puja Toolkit/i.test(document.body.innerText),
    bingo: /Puja Bingo/i.test(document.body.innerText),
  }));

  if (checks.cards !== 100) fail(`Expected 100 pandal cards, found ${checks.cards}`);
  if (checks.canonicalPins !== 28) fail(`Expected 28 canonical pins, found ${checks.canonicalPins}`);
  if (checks.pandals < 28) fail(`Expected at least 28 canonical pandals, found ${checks.pandals}`);
  if (checks.markerCount !== 28) fail(`Expected 28 Leaflet markers, found ${checks.markerCount}`);
  if (!checks.leaflet || !checks.map) fail('Leaflet map did not initialize');
  if (!checks.search || !checks.route || !checks.menu) fail('Core mobile controls are missing');
  if (!checks.toolkit || !checks.bingo) fail('Puja Toolkit or Puja Bingo did not load');

  const search = page.locator('#pandal-search');
  await search.fill('20 Palli');
  await wait(250);
  if (await page.locator('.pandal-card:visible').count() < 1) fail('Pandal search did not find 20 Palli Sarbojani Durgotsab');
  await search.fill('');
  await wait(250);

  const firstAdd = page.locator('.pandal-card:visible .add-route').first();
  if (await firstAdd.count()) {
    await firstAdd.click();
    await wait(200);
    const routeCount = await page.locator('#route-count').textContent();
    if (!routeCount?.startsWith('1 / 8')) fail(`Route add failed; got ${routeCount}`);
    const directionHref = await page.locator('.pandal-card:visible .route').first().getAttribute('href');
    if (!directionHref?.includes('destination=')) fail('Directions URL is missing a destination');
  } else fail('No Add to route control found on the first pandal card');

  const menu = page.locator('.menu');
  await menu.click();
  if ((await menu.getAttribute('aria-expanded')) !== 'true') fail('Mobile menu did not open');
  await menu.click();
  if ((await menu.getAttribute('aria-expanded')) !== 'false') fail('Mobile menu did not close');

  if (pageErrors.length) fail(`Runtime page errors: ${pageErrors.join(' | ')}`);
  console.log('Smoke test passed:', JSON.stringify(checks));
} finally {
  await browser?.close();
  server.kill('SIGTERM');
}
