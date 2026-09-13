(() => {
  'use strict';
  // pandal-catalog-upgrade.js intentionally finishes its catalog render ~1.2s after load.
  // Run the final integration pass after that render so the verified-pin layer owns the UI.
  window.setTimeout(() => {
    if (document.querySelectorAll('#pandal-list .pandal-card').length < 80) return;
    const s = document.createElement('script');
    s.src = 'puja2026-upgrade.js?final=20260914';
    s.defer = true;
    document.body.appendChild(s);
  }, 2400);
})();
