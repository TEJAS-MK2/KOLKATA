(() => {
  'use strict';
  const updates = Object.freeze([
    Object.freeze({
      title: 'Chaltabagan · Nishan — The Mark',
      meta: 'Confirmed committee announcement · 4 Sep 2026',
      text: 'Manicktala Chaltabagan Lohapatty Durga Puja announced “Nishan — The Mark” as its 2026 theme. The announcement also introduced the committee’s Durga Puja Connect digital initiative.',
      source: 'https://www.business-standard.com/amp/content/press-releases-ani/chaltabagan-durga-puja-unveils-2026-puja-theme-nishan-inspired-by-ramnami-samaj-announces-durga-puja-connect-global-app-for-the-festival-126090400680_1.html?isa=yes',
      sourceLabel: 'Source: committee announcement reported by Business Standard ↗'
    })
  ]);
  window.KolkataPujaConfig = Object.freeze({
    emergency: Object.freeze([
      Object.freeze({number:'112', label:'India emergency response'}),
      Object.freeze({number:'101', label:'Fire'}),
      Object.freeze({number:'108', label:'Ambulance'}),
      Object.freeze({number:'1091', label:'Women helpline'}),
      Object.freeze({number:'139', label:'Railway assistance'})
    ]),
    updates
  });
  const esc = value => String(value ?? '').replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const renderUpdates = () => {
    const host = document.querySelector('#puja-2026-info');
    if (!host || !updates.length || document.getElementById('puja-live-updates')) return;
    const section = document.createElement('div');
    section.id = 'puja-live-updates';
    section.className = 'puja-2026-grid';
    section.setAttribute('aria-label', 'Recently verified 2026 Puja updates');
    section.innerHTML = updates.map(item => `<article class="puja-2026-card"><strong>${esc(item.title)}</strong><small>${esc(item.meta)}</small><p>${esc(item.text)}</p><p><a href="${esc(item.source)}" target="_blank" rel="noopener noreferrer">${esc(item.sourceLabel)}</a></p></article>`).join('');
    const note = document.createElement('p');
    note.className = 'puja-2026-note';
    note.textContent = 'Freshness check: 14 September 2026. Committee-level themes are shown only when a current announcement could be verified; local timings and access rules may still change.';
    host.append(section, note);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', renderUpdates, {once:true});
  else renderUpdates();
})();
