(() => {
  const MAX_ROUTE = 8;
  const MODE = {
    walking: { label: 'Walk', speed: 4.5, roadFactor: 1.28 },
    driving: { label: 'Drive', speed: 22, roadFactor: 1.18 },
    transit: { label: 'Transit', speed: 16, roadFactor: 1.22 },
    'two-wheeler': { label: 'Two-wheeler', speed: 25, roadFactor: 1.18 }
  };

  const style = document.createElement('style');
  style.textContent = `
    .route-intelligence{margin:0 0 15px;padding:14px;border:1px solid rgba(243,234,217,.12);border-radius:15px;background:rgba(8,5,4,.16)}
    .route-intel-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
    .route-intel-stat{padding:10px 12px;border-radius:11px;background:rgba(243,234,217,.045)}
    .route-intel-stat strong{display:block;font:600 19px/1.1 'Playfair Display',serif}.route-intel-stat span{display:block;margin-top:4px;font-size:10px;letter-spacing:.08em;text-transform:uppercase;opacity:.52}
    .route-intel-actions{display:flex;gap:8px;align-items:center;justify-content:space-between;margin-top:10px;flex-wrap:wrap}.optimize-route{border:1px solid rgba(243,234,217,.2);background:#f3ead9;color:#140c0a;border-radius:999px;padding:9px 13px;font:inherit;font-size:12px;cursor:pointer}.route-intel-note{font-size:10px!important;opacity:.45!important;margin:0!important}
    .route-stop-distance{display:block;margin-top:3px;font-size:10px;opacity:.48}.route-stop.next-stop{border-color:rgba(243,234,217,.38)}
    @media(max-width:800px){.route-intel-grid{grid-template-columns:1fr 1fr}.route-intel-stat:last-child{grid-column:1/-1}}
  `;
  document.head.appendChild(style);

  const haversineKm = (a, b) => {
    const R = 6371, rad = Math.PI / 180;
    const dLat = (b.lat - a.lat) * rad, dLon = (b.lng - a.lng) * rad;
    const x = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(x));
  };

  const currentMode = () => MODE[window.travelMode] || MODE.walking;
  const estimate = (stops) => {
    if (stops.length < 2) return { distance: 0, minutes: 0 };
    const mode = currentMode();
    let distance = 0;
    for (let i = 1; i < stops.length; i++) distance += haversineKm(stops[i - 1], stops[i]) * mode.roadFactor;
    const minutes = distance / mode.speed * 60;
    return { distance, minutes };
  };
  const formatDistance = km => km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
  const formatTime = mins => {
    if (!mins) return '—';
    const rounded = Math.max(1, Math.round(mins));
    return rounded >= 60 ? `${Math.floor(rounded / 60)}h ${rounded % 60}m` : `${rounded} min`;
  };

  function ensureUI() {
    const planner = document.querySelector('#route-planner');
    if (!planner || document.querySelector('#route-intelligence')) return;
    const intel = document.createElement('div');
    intel.id = 'route-intelligence';
    intel.className = 'route-intelligence';
    intel.innerHTML = `<div class="route-intel-grid"><div class="route-intel-stat"><strong id="route-distance">—</strong><span>estimated distance</span></div><div class="route-intel-stat"><strong id="route-time">—</strong><span>travel time</span></div><div class="route-intel-stat"><strong id="route-mode-label">Walk</strong><span>travel mode</span></div></div><div class="route-intel-actions"><button id="optimize-route" class="optimize-route" type="button">Optimize stop order ↗</button><p class="route-intel-note">Approximate city travel estimate, not live traffic.</p></div>`;
    const stops = planner.querySelector('#route-stops');
    planner.insertBefore(intel, stops);
    intel.querySelector('#optimize-route').addEventListener('click', optimizeRoute);
  }

  function refreshStopDetails() {
    const stops = Array.isArray(window.routeStops) ? window.routeStops : [];
    const { distance, minutes } = estimate(stops);
    const d = document.querySelector('#route-distance'), t = document.querySelector('#route-time'), m = document.querySelector('#route-mode-label');
    if (d) d.textContent = formatDistance(distance);
    if (t) t.textContent = formatTime(minutes);
    if (m) m.textContent = currentMode().label;

    const cards = document.querySelectorAll('.route-stop');
    cards.forEach((card, i) => {
      card.classList.toggle('next-stop', i === (window.nightIndex || 0));
      let detail = card.querySelector('.route-stop-distance');
      if (detail) detail.remove();
      if (i > 0 && stops[i - 1] && stops[i]) {
        const leg = haversineKm(stops[i - 1], stops[i]) * currentMode().roadFactor;
        detail = document.createElement('span'); detail.className = 'route-stop-distance'; detail.textContent = `≈ ${formatDistance(leg)} from previous stop`;
        const body = card.querySelector('div:nth-child(2)'); body?.appendChild(detail);
      }
    });
  }

  function optimizeRoute() {
    if (!Array.isArray(window.routeStops) || window.routeStops.length < 3) return;
    const remaining = [...window.routeStops.slice(1)];
    const ordered = [window.routeStops[0]];
    while (remaining.length) {
      const last = ordered[ordered.length - 1];
      let bestIndex = 0, bestDistance = Infinity;
      remaining.forEach((candidate, i) => {
        const distance = haversineKm(last, candidate);
        if (distance < bestDistance) { bestDistance = distance; bestIndex = i; }
      });
      ordered.push(remaining.splice(bestIndex, 1)[0]);
    }
    window.routeStops.splice(0, window.routeStops.length, ...ordered);
    if (typeof window.persistNight === 'function') window.persistNight();
    if (typeof window.renderRoute === 'function') window.renderRoute();
    if (typeof window.renderPandalExplorer === 'function') window.renderPandalExplorer();
    refreshStopDetails();
  }

  function installHooks() {
    ensureUI();
    refreshStopDetails();
    document.querySelectorAll('.mode-btn').forEach(btn => {
      if (btn.dataset.intelligenceBound) return;
      btn.dataset.intelligenceBound = '1';
      btn.addEventListener('click', () => setTimeout(refreshStopDetails, 0));
    });
    const planner = document.querySelector('#route-planner');
    if (planner && !planner.dataset.observerBound) {
      planner.dataset.observerBound = '1';
      new MutationObserver(() => setTimeout(refreshStopDetails, 0)).observe(planner, { childList: true, subtree: true });
    }
  }

  window.routeIntelligence = { refresh: refreshStopDetails, optimize: optimizeRoute, estimate };
  window.addEventListener('load', () => setTimeout(installHooks, 50));
  setTimeout(installHooks, 1500);
})();
