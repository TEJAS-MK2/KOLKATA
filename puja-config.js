(()=>{
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
  const esc = value => String(value ?? '').replace(/[&<>\\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\\"':'&quot;',"'":'&#39;'}[c]));
  const correctOfficialDates = () => {
    const dates = document.querySelector('.puja-2026-dates');
    if (dates) {
      const official = [['17 Oct','Shashthi'],['18 Oct','Saptami'],['19 Oct','Ashtami'],['20 Oct','Navami'],['21 Oct','Dashami']];
      dates.querySelectorAll('.puja-2026-date').forEach((el, i) => {
        if (!official[i]) return;
        const b = el.querySelector('b'), span = el.querySelector('span');
        if (b) b.textContent = official[i][0];
        if (span) span.textContent = official[i][1];
      });
    }
    const hero = document.querySelector('.hero .eyebrow');
    if (hero) hero.textContent = 'MAHALAYA 10 OCTOBER · PUJA 17—21 OCTOBER 2026';
    const proCopy = document.querySelector('#pro-today-copy');
    if (proCopy) proCopy.textContent = 'The official 2026 Puja dates run from Maha Shashthi on 17 October through Vijaya Dashami on 21 October; Mahalaya falls on 10 October.';
    document.querySelectorAll('.pro-guide small').forEach(el => {
      if (el.textContent.includes('17 Oct')) el.textContent = el.textContent.replace('17 Oct', '18 Oct');
    });
  };
  const renderUpdates = () => {
    correctOfficialDates();
    const host = document.querySelector('#puja-2026-info');
    if (!host || !updates.length || document.getElementById('puja-live-updates')) return;
    const section = document.createElement('div');
    section.id = 'puja-live-updates';
    section.className = 'puja-2026-grid';
    section.setAttribute('aria-label', 'Recently verified 2026 Puja updates');
    section.innerHTML = updates.map(item => `<article class="puja-2026-card"><strong>${esc(item.title)}</strong><small>${esc(item.meta)}</small><p>${esc(item.text)}</p><p><a href="${esc(item.source)}" target="_blank" rel="noopener noreferrer">${esc(item.sourceLabel)}</a></p></article>`).join('');
    const note = document.createElement('p');
    note.className = 'puja-2026-note';
    note.textContent = 'Freshness check: 16 September 2026. Committee-level themes are shown only when a current announcement could be verified; local timings and access rules may still change.';
    host.append(section, note);
  };
  const loadPolishLayer = () => {
    if (document.getElementById('site-enhancements-js')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet'; link.href = 'site-enhancements.css?v=20260916'; link.id = 'site-enhancements-css';
    document.head.appendChild(link);
    const script = document.createElement('script');
    script.src = 'site-enhancements.js?v=20260916'; script.defer = true; script.id = 'site-enhancements-js';
    document.body.appendChild(script);
  };
  const boot = () => { renderUpdates(); loadPolishLayer(); setTimeout(correctOfficialDates, 0); setTimeout(correctOfficialDates, 1000); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, {once:true});
  else boot();
  addEventListener('load', correctOfficialDates, {once:true});
})();
